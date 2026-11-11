// MapRapiDoc in a real app, on the in-memory test server.

using System.Net;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace RapiDoc.AspNetCore.Tests;

public class EndpointTests
{
    private static async Task<HttpClient> Start(Action<WebApplication> map)
    {
        var builder = WebApplication.CreateBuilder(new WebApplicationOptions { ApplicationName = "Pets" });
        builder.WebHost.UseTestServer();
        var app = builder.Build();
        map(app);
        await app.StartAsync();
        return app.GetTestClient();
    }

    [Fact]
    public async Task ServesThePageTheBundleAndTheOAuthReturnPage()
    {
        var client = await Start(app => app.MapRapiDoc());

        var page = await client.GetAsync("/docs");
        Assert.Equal(HttpStatusCode.OK, page.StatusCode);
        Assert.Equal("text/html; charset=utf-8", page.Content.Headers.ContentType?.ToString());
        Assert.Equal("no-cache", page.Headers.CacheControl?.ToString());
        var html = await page.Content.ReadAsStringAsync();
        Assert.Contains("<title>Pets - API Reference</title>", html);
        Assert.Contains("spec-url=\"/openapi/v1.json\"", html);
        Assert.Contains("oauth-receiver=\"/docs/oauth-receiver.html\"", html);
        Assert.Contains("<script type=\"module\" src=\"/docs/rapidoc-min.js\"></script>", html);
        Assert.Equal(html, await client.GetStringAsync("/docs/"));

        var receiver = await client.GetStringAsync("/docs/oauth-receiver.html");
        Assert.Contains("<oauth-receiver></oauth-receiver>", receiver);

        var script = await client.GetAsync("/docs/rapidoc-min.js");
        Assert.Equal("text/javascript; charset=utf-8", script.Content.Headers.ContentType?.ToString());
        Assert.True((await script.Content.ReadAsByteArrayAsync()).Length > 100_000);
        var license = await client.GetAsync("/docs/rapidoc-min.js.LICENSE.txt");
        Assert.Equal("text/plain; charset=utf-8", license.Content.Headers.ContentType?.ToString());

        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync("/docs/other.js")).StatusCode);
        Assert.Equal(HttpStatusCode.MethodNotAllowed, (await client.PostAsync("/docs", null)).StatusCode);
    }

    [Fact]
    public async Task AnswersHeadAndIfNoneMatch()
    {
        var client = await Start(app => app.MapRapiDoc());

        var head = await client.SendAsync(new HttpRequestMessage(HttpMethod.Head, "/docs/rapidoc-min.js"));
        Assert.Equal(HttpStatusCode.OK, head.StatusCode);
        Assert.True(head.Content.Headers.ContentLength > 100_000);
        Assert.Empty(await head.Content.ReadAsByteArrayAsync());
        var etag = head.Headers.ETag!;
        Assert.StartsWith("\"sha384-", etag.Tag);
        Assert.Equal("public, max-age=3600", head.Headers.CacheControl?.ToString());

        var again = new HttpRequestMessage(HttpMethod.Get, "/docs/rapidoc-min.js");
        again.Headers.IfNoneMatch.Add(etag);
        var notModified = await client.SendAsync(again);
        Assert.Equal(HttpStatusCode.NotModified, notModified.StatusCode);
        Assert.Empty(await notModified.Content.ReadAsByteArrayAsync());

        var pageHead = await client.SendAsync(new HttpRequestMessage(HttpMethod.Head, "/docs"));
        Assert.Equal(HttpStatusCode.OK, pageHead.StatusCode);
        Assert.Empty(await pageHead.Content.ReadAsByteArrayAsync());
    }

    [Fact]
    public async Task TakesOptionsInDotNetNaming()
    {
        var client = await Start(app =>
            app.MapRapiDoc("/reference", options =>
            {
                options.SpecUrl = "https://example.com/openapi.yaml";
                options.Title = "Pets <API>";
                options.Lang = "fr";
                options.Css = "rapi-doc{--x:1}";
                options.Head = "<meta name=\"robots\" content=\"noindex\">";
                options.Attributes["RenderStyle"] = "focused";
                options.Attributes["allowTry"] = false;
                options.Attributes["schema-expand-level"] = 2;
                options.Attributes["oauth-receiver"] = null;
                options.Nonce = context => context.Request.Headers["x-nonce"].ToString();
            }));

        var request = new HttpRequestMessage(HttpMethod.Get, "/reference");
        request.Headers.Add("x-nonce", "abc");
        var html = await (await client.SendAsync(request)).Content.ReadAsStringAsync();
        Assert.Contains("<html lang=\"fr\">", html);
        Assert.Contains("<title>Pets &lt;API&gt;</title>", html);
        Assert.Contains("<style nonce=\"abc\">rapi-doc{--x:1}</style>", html);
        Assert.Contains("src=\"/reference/rapidoc-min.js\" nonce=\"abc\"></script>", html);
        Assert.Contains("<meta name=\"robots\" content=\"noindex\">", html);
        Assert.Contains(
            "      allow-try=\"false\"\n      render-style=\"focused\"\n      schema-expand-level=\"2\"\n      spec-url=\"https://example.com/openapi.yaml\"\n",
            html);
        Assert.DoesNotContain("oauth-receiver=", html);
        Assert.DoesNotContain("nonce", await client.GetStringAsync("/reference"));
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync("/docs")).StatusCode);
    }

    [Fact]
    public async Task WritesTheSpecIntoThePage()
    {
        var document = new JsonObject
        {
            ["openapi"] = "3.1.0",
            ["info"] = new JsonObject { ["title"] = "Inline </script>", ["version"] = "1" },
            ["paths"] = new JsonObject(),
        };
        const string inline = "{\"openapi\":\"3.1.0\",\"info\":{\"title\":\"Inline \\u003c/script\\u003e\",\"version\":\"1\"},\"paths\":{}}";

        foreach (var spec in new object[] { document, document.ToJsonString(), new { openapi = "3.1.0", info = new { title = "Inline </script>", version = "1" }, paths = new { } } })
        {
            var client = await Start(app => app.MapRapiDoc(options => options.Spec = spec));
            var html = await client.GetStringAsync("/docs");
            Assert.Contains($"<script type=\"application/json\" slot=\"rapidoc-spec\">{inline}</script>", html);
            Assert.DoesNotContain("spec-url", html); // the default applies only without a spec
        }
    }

    [Fact]
    public async Task LoadsTheBundleFromACdnOrAUrlOfYourOwn()
    {
        var cdn = await Start(app => app.MapRapiDoc(options => options.Assets = RapiDocAssets.Cdn));
        var html = await cdn.GetStringAsync("/docs");
        Assert.Matches(
            "<script type=\"module\" src=\"https://cdn\\.jsdelivr\\.net/npm/rapidoc@[0-9.]+/dist/rapidoc-min\\.js\" integrity=\"sha384-[^\"]+\" crossorigin=\"anonymous\"></script>",
            html);
        Assert.Equal(HttpStatusCode.NotFound, (await cdn.GetAsync("/docs/rapidoc-min.js")).StatusCode);
        Assert.Contains("cdn.jsdelivr.net", await cdn.GetStringAsync("/docs/oauth-receiver.html"));

        var custom = await Start(app =>
            app.MapRapiDoc(options => options.Assets = RapiDocAssets.FromUrl("/static/rapidoc.js", "sha384-abc")));
        Assert.Contains(
            "src=\"/static/rapidoc.js\" integrity=\"sha384-abc\" crossorigin=\"anonymous\"",
            await custom.GetStringAsync("/docs"));
    }

    [Fact]
    public async Task FollowsThePathBaseAndARouteGroup()
    {
        var client = await Start(app =>
        {
            app.UsePathBase("/gateway");
            app.UseRouting();
            app.MapGroup("/internal").MapRapiDoc();
            app.MapRapiDoc("/", options => options.PublicUiPath = "/public/");
        });

        var html = await client.GetStringAsync("/gateway/internal/docs");
        Assert.Contains("src=\"/gateway/internal/docs/rapidoc-min.js\"", html);
        Assert.Contains("oauth-receiver=\"/gateway/internal/docs/oauth-receiver.html\"", html);
        Assert.Contains("spec-url=\"/gateway/openapi/v1.json\"", html);
        Assert.Contains(
            "src=\"/gateway/internal/docs/rapidoc-min.js\"",
            await client.GetStringAsync("/gateway/internal/docs/oauth-receiver.html"));
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/gateway/internal/docs/rapidoc-min.js")).StatusCode);

        // Without the prefix the same app answers too, with its own URLs
        Assert.Contains("src=\"/internal/docs/rapidoc-min.js\"", await client.GetStringAsync("/internal/docs"));

        // At the site root, behind a proxy the app does not know about
        var root = await client.GetStringAsync("/");
        Assert.Contains("src=\"/public/rapidoc-min.js\"", root);
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/rapidoc-min.js")).StatusCode);
    }

    [Fact]
    public async Task MapsNothingWhenDisabledAndTakesEndpointConventions()
    {
        var disabled = await Start(app => app.MapRapiDoc(options => options.Enabled = false));
        Assert.Equal(HttpStatusCode.NotFound, (await disabled.GetAsync("/docs")).StatusCode);

        EndpointDataSource? endpoints = null;
        var client = await Start(app =>
        {
            app.MapRapiDoc().WithMetadata("marked");
            endpoints = app.Services.GetRequiredService<EndpointDataSource>();
        });
        await client.GetAsync("/docs");
        Assert.Equal(4, endpoints!.Endpoints.Count);
        Assert.All(endpoints.Endpoints, endpoint =>
        {
            Assert.Contains("marked", endpoint.Metadata);
            // left out of the OpenAPI document the reference shows
            Assert.True(endpoint.Metadata.GetMetadata<IExcludeFromDescriptionMetadata>()?.ExcludeFromDescription);
        });
    }

    [Fact]
    public async Task RejectsWrongOptionsWhenTheAppStarts()
    {
        await Assert.ThrowsAsync<ArgumentException>(
            () => Start(app => app.MapRapiDoc(options => options.Attributes["on click"] = "x")));
        Assert.Throws<ArgumentException>(() => RapiDocAssets.FromUrl(""));
        await Assert.ThrowsAnyAsync<System.Text.Json.JsonException>(
            () => Start(app => app.MapRapiDoc(options => options.Spec = "not json")));
    }
}
