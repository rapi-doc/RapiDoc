// The RapiDoc integration contract, version 2, in C#: a port of packages/rapidoc-embed/src/core.js, same
// function for function. It takes the contract's own option names (uiPath, specUrl, scriptUrl) as a
// JsonObject, because the conformance fixtures are read as they are; RapiDocOptions translates .NET naming.
// No ASP.NET Core type is used here. Change the output only together with core.js and its fixtures.

using System.Globalization;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;

namespace RapiDoc.AspNetCore;

/// <summary>Where the page, the bundle and the OAuth return page are, and how the bundle is loaded.</summary>
public sealed record RapiDocUrls(string Page, string Script, string? Integrity, string OAuthReceiver);

/// <summary>A route an integration serves. <c>Kind</c> is <c>page</c>, <c>oauth-receiver</c> or <c>file</c>.</summary>
public sealed record RapiDocRoute(string Path, string Kind, string ContentType, string? File = null);

/// <summary>The integration contract of <c>@rapidoc/embed</c>: options in, routes and HTML out.</summary>
public static class RapiDocContract
{
    /// <summary>Version of the contract this port implements.</summary>
    public const int ContractVersion = 2;

    /// <summary>Where the reference is served when <c>uiPath</c> is not given.</summary>
    public const string DefaultUiPath = "/docs";

    /// <summary>The page title when none is given.</summary>
    public const string DefaultTitle = "API Reference";

    /// <summary>File name of the bundle, under the page's path.</summary>
    public const string ScriptFile = "rapidoc-min.js";

    /// <summary>File name of the bundle's third-party notices.</summary>
    public const string LicenseFile = "rapidoc-min.js.LICENSE.txt";

    /// <summary>File name of the OAuth return page.</summary>
    public const string OAuthReceiverFile = "oauth-receiver.html";

    private const string BaseStyle = "html,body{height:100%;margin:0}rapi-doc{height:100vh;width:100%}";
    private const string HtmlType = "text/html; charset=utf-8";

    private static readonly Regex UpperCase = new("[A-Z]", RegexOptions.CultureInvariant);
    private static readonly Regex AttributeNamePattern = new(@"\A[a-z][a-z0-9-]*\z", RegexOptions.CultureInvariant);
    private static readonly Regex StyleEnd = new("</(style)", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);

    /// <summary>Escapes text for HTML content and double-quoted attribute values.</summary>
    public static string EscapeHtml(string value) =>
        value.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace("\"", "&quot;");

    /// <summary>Compact JSON, keys in input order, that cannot end the script element it is written into.</summary>
    /// <param name="spec">The document, or JSON text of it.</param>
    public static string InlineJson(JsonNode? spec)
    {
        if (spec is JsonValue value && value.GetValueKind() == JsonValueKind.String)
        {
            spec = JsonNode.Parse(value.GetValue<string>());
        }
        return CompactJson(spec)
            .Replace("<", Escape("003c"))
            .Replace(">", Escape("003e"))
            .Replace("&", Escape("0026"))
            .Replace(((char)0x2028).ToString(), Escape("2028"))
            .Replace(((char)0x2029).ToString(), Escape("2029"));
    }

    /// <summary>The <c>uiPath</c> option; <c>path</c>, its name in contract version 1, is still read.</summary>
    public static string UiPathOf(JsonObject? options) =>
        Text(options?["uiPath"]) ?? Text(options?["path"]) ?? DefaultUiPath;

    /// <summary>A public URL path without a trailing slash; the site root is the empty string.</summary>
    public static string NormalizePath(string? path = DefaultUiPath)
    {
        var trimmed = (path ?? DefaultUiPath).Trim().TrimEnd('/');
        if (trimmed.Length == 0) return "";
        return trimmed.StartsWith('/') ? trimmed : "/" + trimmed;
    }

    /// <summary><c>allowTry</c> becomes <c>allow-try</c>; names already in kebab-case pass through.</summary>
    public static string AttributeName(string key)
    {
        var name = UpperCase.Replace(key, match => "-" + match.Value.ToLowerInvariant());
        if (!AttributeNamePattern.IsMatch(name))
        {
            throw new ArgumentException($"RapiDoc: \"{key}\" is not a valid attribute name");
        }
        return name;
    }

    /// <summary>Where the page, the bundle and the OAuth return page are, and how the bundle is loaded.</summary>
    public static RapiDocUrls EmbedUrls(JsonObject? options)
    {
        var path = NormalizePath(UiPathOf(options));
        var page = path.Length == 0 ? "/" : path;
        var oauthReceiver = $"{path}/{OAuthReceiverFile}";
        var assets = options?["assets"];

        if (assets is JsonObject custom)
        {
            var scriptUrl = Text(custom["scriptUrl"]);
            if (string.IsNullOrEmpty(scriptUrl))
            {
                throw new ArgumentException("RapiDoc: assets.scriptUrl is required");
            }
            var integrity = Text(custom["integrity"]);
            return new RapiDocUrls(page, scriptUrl, string.IsNullOrEmpty(integrity) ? null : integrity, oauthReceiver);
        }

        switch (assets is null ? "bundled" : Text(assets))
        {
            case "bundled":
                return new RapiDocUrls(page, $"{path}/{ScriptFile}", null, oauthReceiver);
            case "cdn":
                var manifest = options?["manifest"] as JsonObject;
                var cdn = Text(manifest?["cdn"]);
                var file = (manifest?["files"] as JsonObject)?[ScriptFile] as JsonObject;
                if (string.IsNullOrEmpty(cdn) || file is null)
                {
                    throw new ArgumentException("RapiDoc: assets \"cdn\" needs the integration manifest of rapidoc");
                }
                return new RapiDocUrls(page, cdn + ScriptFile, Text(file["integrity"]), oauthReceiver);
            default:
                throw new ArgumentException("RapiDoc: assets must be \"bundled\", \"cdn\" or { scriptUrl }");
        }
    }

    /// <summary>
    /// The attributes of <c>rapi-doc</c> as name and value pairs, sorted by name. <c>spec-url</c> and
    /// <c>oauth-receiver</c> come from the embed options; <c>options.options</c> adds to them and wins.
    /// A null value leaves an attribute out.
    /// </summary>
    public static IReadOnlyList<KeyValuePair<string, string>> ToAttributes(JsonObject? options)
    {
        var attributes = new Dictionary<string, JsonNode?>(StringComparer.Ordinal);
        var specUrl = options?["specUrl"];
        if (!string.IsNullOrEmpty(Text(specUrl))) attributes["spec-url"] = specUrl;
        attributes["oauth-receiver"] = JsonValue.Create(EmbedUrls(options).OAuthReceiver);
        if (options?["options"] is JsonObject extra)
        {
            foreach (var (key, value) in extra) attributes[AttributeName(key)] = value;
        }
        return attributes
            .Where(pair => pair.Value is not null)
            .Select(pair => new KeyValuePair<string, string>(pair.Key, AttributeValue(pair.Value!)))
            .OrderBy(pair => pair.Key, StringComparer.Ordinal)
            .ToList();
    }

    /// <summary>
    /// The HTML page that hosts <c>rapi-doc</c>. <c>head</c> and <c>css</c> are written as given: they are
    /// the developer's own markup, never user input.
    /// </summary>
    public static string RenderHostPage(JsonObject? options)
    {
        var urls = EmbedUrls(options);
        var nonce = Text(options?["nonce"]);
        var nonceAttribute = string.IsNullOrEmpty(nonce) ? "" : $" nonce=\"{EscapeHtml(nonce)}\"";
        var lines = new List<string>
        {
            "<!doctype html>",
            $"<html lang=\"{EscapeHtml(Text(options?["lang"]) ?? "en")}\">",
            "  <head>",
            "    <meta charset=\"utf-8\">",
            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
            $"    <title>{EscapeHtml(Text(options?["title"]) ?? DefaultTitle)}</title>",
            $"    <style{nonceAttribute}>{BaseStyle}</style>",
        };
        var css = Text(options?["css"]);
        if (!string.IsNullOrEmpty(css))
        {
            lines.Add($"    <style{nonceAttribute}>{StyleEnd.Replace(css, @"<\/$1")}</style>");
        }
        lines.Add($"    {ScriptTag(urls, nonce)}");
        var head = Text(options?["head"]);
        if (!string.IsNullOrEmpty(head)) lines.Add($"    {head}");
        lines.Add("  </head>");
        lines.Add("  <body>");

        var attributes = ToAttributes(options);
        var spec = options?["spec"];
        var hasSpec = spec is not null;
        if (attributes.Count == 0)
        {
            lines.Add(hasSpec ? "    <rapi-doc>" : "    <rapi-doc></rapi-doc>");
        }
        else
        {
            lines.Add("    <rapi-doc");
            foreach (var (name, value) in attributes) lines.Add($"      {name}=\"{EscapeHtml(value)}\"");
            lines.Add(hasSpec ? "    >" : "    ></rapi-doc>");
        }
        if (hasSpec)
        {
            lines.Add($"      <script type=\"application/json\" slot=\"rapidoc-spec\">{InlineJson(spec)}</script>");
            lines.Add("    </rapi-doc>");
        }
        lines.Add("  </body>");
        lines.Add("</html>");
        lines.Add("");
        return string.Join("\n", lines);
    }

    /// <summary>
    /// The page the OAuth provider sends the sign-in popup back to. It must be served from the same origin
    /// as the host page, also when the bundle comes from a CDN.
    /// </summary>
    public static string RenderOAuthReceiverPage(JsonObject? options) =>
        string.Join(
            "\n",
            "<!doctype html>",
            $"<html lang=\"{EscapeHtml(Text(options?["lang"]) ?? "en")}\">",
            "  <head>",
            "    <meta charset=\"utf-8\">",
            "    <title>OAuth sign-in</title>",
            $"    {ScriptTag(EmbedUrls(options), Text(options?["nonce"]))}",
            "  </head>",
            "  <body>",
            "    <oauth-receiver></oauth-receiver>",
            "  </body>",
            "</html>",
            "");

    /// <summary>
    /// The routes an integration serves. <c>page</c> and <c>oauth-receiver</c> are rendered; <c>file</c> is
    /// a file of rapidoc's dist folder, served only when assets are bundled.
    /// </summary>
    public static IReadOnlyList<RapiDocRoute> EmbedRoutes(JsonObject? options)
    {
        var path = NormalizePath(UiPathOf(options));
        var urls = EmbedUrls(options);
        var routes = new List<RapiDocRoute>
        {
            new(urls.Page, "page", HtmlType),
            new(urls.OAuthReceiver, "oauth-receiver", HtmlType),
        };
        var assets = options?["assets"];
        if (assets is null || Text(assets) == "bundled")
        {
            routes.Add(new(urls.Script, "file", "text/javascript; charset=utf-8", ScriptFile));
            routes.Add(new($"{path}/{LicenseFile}", "file", "text/plain; charset=utf-8", LicenseFile));
        }
        return routes;
    }

    /// <summary>A JSON escape for a UTF-16 code unit, built so that this file holds no such escape itself.</summary>
    private static string Escape(string hex) => "\\" + "u" + hex;

    private static string ScriptTag(RapiDocUrls urls, string? nonce)
    {
        var tag = $"<script type=\"module\" src=\"{EscapeHtml(urls.Script)}\"";
        if (!string.IsNullOrEmpty(urls.Integrity))
        {
            tag += $" integrity=\"{EscapeHtml(urls.Integrity)}\" crossorigin=\"anonymous\"";
        }
        if (!string.IsNullOrEmpty(nonce)) tag += $" nonce=\"{EscapeHtml(nonce)}\"";
        return tag + "></script>";
    }

    /// <summary>A value as JavaScript's String() writes it; null for a missing value, an object or an array.</summary>
    private static string? Text(JsonNode? node)
    {
        if (node is not JsonValue value) return null;
        return value.GetValueKind() switch
        {
            JsonValueKind.String => value.GetValue<string>(),
            JsonValueKind.True => "true",
            JsonValueKind.False => "false",
            JsonValueKind.Number => NumberText(value),
            _ => value.ToJsonString(),
        };
    }

    private static string AttributeValue(JsonNode value) => Text(value) ?? CompactJson(value);

    /// <summary>A whole number written with a fraction (2.0) is written without it, as JavaScript does.</summary>
    private static string NumberText(JsonValue value)
    {
        var raw = value.ToJsonString();
        if (
            raw.AsSpan().IndexOfAny('.', 'e', 'E') >= 0
            && decimal.TryParse(raw, NumberStyles.Float, CultureInfo.InvariantCulture, out var number)
            && number == decimal.Truncate(number)
            && Math.Abs(number) < 1_000_000_000_000_000m
        )
        {
            return decimal.Truncate(number).ToString("0", CultureInfo.InvariantCulture);
        }
        return raw;
    }

    /// <summary>
    /// JSON without whitespace, written as JavaScript's JSON.stringify writes it: keys in input order and
    /// non-ASCII characters as they are. (System.Text.Json's own writer escapes more than that.)
    /// </summary>
    private static string CompactJson(JsonNode? node)
    {
        var json = new StringBuilder();
        WriteJson(json, node);
        return json.ToString();
    }

    private static void WriteJson(StringBuilder json, JsonNode? node)
    {
        switch (node)
        {
            case null:
                json.Append("null");
                break;
            case JsonObject members:
                json.Append('{');
                var firstMember = true;
                foreach (var (key, value) in members)
                {
                    if (!firstMember) json.Append(',');
                    firstMember = false;
                    WriteString(json, key);
                    json.Append(':');
                    WriteJson(json, value);
                }
                json.Append('}');
                break;
            case JsonArray items:
                json.Append('[');
                for (var index = 0; index < items.Count; index++)
                {
                    if (index > 0) json.Append(',');
                    WriteJson(json, items[index]);
                }
                json.Append(']');
                break;
            default:
                var scalar = (JsonValue)node;
                switch (scalar.GetValueKind())
                {
                    case JsonValueKind.String:
                        WriteString(json, scalar.GetValue<string>());
                        break;
                    case JsonValueKind.Number:
                        json.Append(NumberText(scalar));
                        break;
                    default:
                        json.Append(scalar.ToJsonString());
                        break;
                }
                break;
        }
    }

    private static void WriteString(StringBuilder json, string text)
    {
        json.Append('"');
        for (var index = 0; index < text.Length; index++)
        {
            var character = text[index];
            switch (character)
            {
                case '"':
                    json.Append("\\\"");
                    break;
                case '\\':
                    json.Append("\\\\");
                    break;
                case '\b':
                    json.Append("\\b");
                    break;
                case '\f':
                    json.Append("\\f");
                    break;
                case '\n':
                    json.Append("\\n");
                    break;
                case '\r':
                    json.Append("\\r");
                    break;
                case '\t':
                    json.Append("\\t");
                    break;
                default:
                    var pairedSurrogate =
                        (char.IsHighSurrogate(character) && index + 1 < text.Length && char.IsLowSurrogate(text[index + 1]))
                        || (char.IsLowSurrogate(character) && index > 0 && char.IsHighSurrogate(text[index - 1]));
                    if (character < ' ' || (char.IsSurrogate(character) && !pairedSurrogate))
                    {
                        json.Append("\\u").Append(((int)character).ToString("x4", CultureInfo.InvariantCulture));
                    }
                    else
                    {
                        json.Append(character);
                    }
                    break;
            }
        }
        json.Append('"');
    }
}
