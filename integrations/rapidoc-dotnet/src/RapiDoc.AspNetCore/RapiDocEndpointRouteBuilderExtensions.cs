using System.Collections.Concurrent;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Net.Http.Headers;

namespace RapiDoc.AspNetCore;

/// <summary>Adds the RapiDoc API reference to an ASP.NET Core app.</summary>
public static class RapiDocEndpointRouteBuilderExtensions
{
    private static readonly string[] Methods = ["GET", "HEAD"];

    // A page is cached per public path and spec URL; more than this many means the keys come from requests
    private const int MaxCachedPages = 32;

    /// <summary>
    /// Serves an interactive API reference at <c>/docs</c> (or <see cref="RapiDocOptions.UiPath"/>), with
    /// the OAuth return page and, unless the bundle comes from a CDN, <c>rapidoc-min.js</c> under it.
    /// </summary>
    /// <returns>A builder for all of those endpoints, for example to call <c>RequireAuthorization()</c> on.</returns>
    public static IEndpointConventionBuilder MapRapiDoc(
        this IEndpointRouteBuilder endpoints,
        Action<RapiDocOptions>? configure = null)
    {
        ArgumentNullException.ThrowIfNull(endpoints);
        var options = new RapiDocOptions();
        configure?.Invoke(options);

        var group = endpoints.MapGroup("");
        if (!options.Enabled) return group;

        var uiPath = RapiDocContract.NormalizePath(options.UiPath);
        var spec = SpecNode(options.Spec);
        var specUrl = options.SpecUrl ?? (spec is null ? "/openapi/v1.json" : null);
        var applicationName = endpoints.ServiceProvider.GetService<IHostEnvironment>()?.ApplicationName;
        var title =
            options.Title
            ?? (string.IsNullOrEmpty(applicationName)
                ? RapiDocContract.DefaultTitle
                : $"{applicationName} - {RapiDocContract.DefaultTitle}");
        var attributes = options.Attributes.ToDictionary(pair => AttributeKey(pair.Key), pair => pair.Value);
        var publicUiPath = options.PublicUiPath is null ? null : RapiDocContract.NormalizePath(options.PublicUiPath);

        // A fresh object each time: a JsonNode has one parent, and the page's path and nonce vary by request
        JsonObject ContractOptions(string pagePath, string? pageSpecUrl, string? nonce) =>
            new()
            {
                ["uiPath"] = pagePath,
                ["specUrl"] = pageSpecUrl,
                ["spec"] = spec?.DeepClone(),
                ["title"] = title,
                ["assets"] = AssetsNode(options.Assets),
                ["manifest"] = options.Assets.Kind == "cdn" ? RapiDocBundle.Manifest.DeepClone() : null,
                ["options"] = JsonSerializer.SerializeToNode(attributes),
                ["head"] = options.Head,
                ["css"] = options.Css,
                ["lang"] = options.Lang,
                ["nonce"] = nonce,
            };

        // Also checks the options when the app starts instead of on the first request
        var routes = RapiDocContract.EmbedRoutes(ContractOptions(uiPath, specUrl, null));
        RapiDocContract.ToAttributes(ContractOptions(uiPath, specUrl, null));

        foreach (var route in routes)
        {
            if (route.Kind == "file")
            {
                var file = RapiDocBundle.File(route.File!);
                group.MapMethods(route.Path, Methods, context => WriteFile(context, file, route.ContentType));
                continue;
            }

            // One cache per route: the host page and the OAuth return page share their keys
            var pages = new ConcurrentDictionary<string, byte[]>(StringComparer.Ordinal);

            // What follows the page's path in this route: "" for the page, "/oauth-receiver.html" for the other
            var suffix = route.Kind == "page" ? "" : route.Path[uiPath.Length..];
            group.MapMethods(
                route.Path.Length == 0 ? "/" : route.Path,
                Methods,
                context =>
                {
                    var request = context.Request;
                    // PathBase and a route group's prefix are part of the URL the browser used
                    var requested = (request.PathBase.Value + request.Path.Value).TrimEnd('/');
                    var pagePath =
                        publicUiPath
                        ?? (requested.EndsWith(suffix, StringComparison.Ordinal) ? requested[..^suffix.Length] : uiPath);
                    var pageSpecUrl =
                        specUrl is not null && specUrl.StartsWith('/') && !specUrl.StartsWith("//", StringComparison.Ordinal)
                            ? request.PathBase.Value + specUrl
                            : specUrl;
                    var nonce = options.Nonce?.Invoke(context);

                    byte[] Render()
                    {
                        var contractOptions = ContractOptions(pagePath, pageSpecUrl, nonce);
                        return Encoding.UTF8.GetBytes(
                            route.Kind == "page"
                                ? RapiDocContract.RenderHostPage(contractOptions)
                                : RapiDocContract.RenderOAuthReceiverPage(contractOptions));
                    }

                    byte[] body;
                    var key = $"{pagePath}\n{pageSpecUrl}";
                    if (!string.IsNullOrEmpty(nonce))
                    {
                        body = Render();
                    }
                    else if (!pages.TryGetValue(key, out body!))
                    {
                        body = Render();
                        if (pages.Count < MaxCachedPages) pages.TryAdd(key, body);
                    }

                    context.Response.Headers.CacheControl = "no-cache";
                    return WriteBody(context, body, route.ContentType);
                });
        }

        // The reference's own routes do not belong in the OpenAPI document it shows
        group.ExcludeFromDescription();
        return group;
    }

    /// <summary>Serves the API reference at <paramref name="uiPath"/>.</summary>
    public static IEndpointConventionBuilder MapRapiDoc(
        this IEndpointRouteBuilder endpoints,
        string uiPath,
        Action<RapiDocOptions>? configure = null)
    {
        ArgumentNullException.ThrowIfNull(uiPath);
        return endpoints.MapRapiDoc(options =>
        {
            options.UiPath = uiPath;
            configure?.Invoke(options);
        });
    }

    private static Task WriteFile(HttpContext context, RapiDocBundle.BundleFile file, string contentType)
    {
        var headers = context.Response.Headers;
        headers.ETag = file.ETag;
        headers.CacheControl = "public, max-age=3600";
        if (context.Request.Headers.IfNoneMatch.ToString() == file.ETag)
        {
            context.Response.StatusCode = StatusCodes.Status304NotModified;
            return Task.CompletedTask;
        }
        return WriteBody(context, file.Content, contentType);
    }

    private static Task WriteBody(HttpContext context, byte[] body, string contentType)
    {
        context.Response.ContentType = contentType;
        context.Response.ContentLength = body.Length;
        return HttpMethods.IsHead(context.Request.Method)
            ? Task.CompletedTask
            : context.Response.Body.WriteAsync(body).AsTask();
    }

    private static JsonNode? SpecNode(object? spec) =>
        spec switch
        {
            null => null,
            string text => JsonNode.Parse(text),
            JsonNode node => node.DeepClone(),
            _ => JsonSerializer.SerializeToNode(spec),
        };

    private static JsonNode AssetsNode(RapiDocAssets assets) =>
        assets.Kind == "custom"
            ? new JsonObject { ["scriptUrl"] = assets.ScriptUrl, ["integrity"] = assets.Integrity }
            : JsonValue.Create(assets.Kind);

    /// <summary>.NET naming is accepted too: <c>RenderStyle</c> is <c>renderStyle</c>, which the contract takes.</summary>
    private static string AttributeKey(string key) =>
        key.Length > 0 && char.IsAsciiLetterUpper(key[0]) ? char.ToLowerInvariant(key[0]) + key[1..] : key;
}

/// <summary>The rapidoc release inside this package: the bundle, its license file and integration.json.</summary>
internal static class RapiDocBundle
{
    internal sealed record BundleFile(byte[] Content, string ETag);

    private static readonly ConcurrentDictionary<string, BundleFile> Files = new(StringComparer.Ordinal);

    private static readonly Lazy<JsonObject> LazyManifest = new(
        () => JsonNode.Parse(Read("integration.json"))!.AsObject());

    internal static JsonObject Manifest => LazyManifest.Value;

    /// <summary>The rapidoc version this package carries.</summary>
    internal static string Version => Manifest["version"]!.GetValue<string>();

    internal static BundleFile File(string name) =>
        Files.GetOrAdd(
            name,
            static file =>
            {
                // The SRI hash names the content, so it is also the ETag
                var integrity = (Manifest["files"]?[file] as JsonObject)?["integrity"]?.GetValue<string>() ?? file;
                return new BundleFile(Read(file), new EntityTagHeaderValue($"\"{integrity}\"").ToString());
            });

    private static byte[] Read(string name)
    {
        using var stream =
            typeof(RapiDocBundle).Assembly.GetManifestResourceStream($"rapidoc/{name}")
            ?? throw new InvalidOperationException($"RapiDoc: {name} is missing from the RapiDoc.AspNetCore assembly");
        using var buffer = new MemoryStream();
        stream.CopyTo(buffer);
        return buffer.ToArray();
    }
}
