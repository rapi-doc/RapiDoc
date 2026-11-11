using Microsoft.AspNetCore.Http;

namespace RapiDoc.AspNetCore;

/// <summary>Where the browser loads the RapiDoc bundle from.</summary>
public sealed class RapiDocAssets
{
    private RapiDocAssets(string kind, string? scriptUrl = null, string? integrity = null)
    {
        Kind = kind;
        ScriptUrl = scriptUrl;
        Integrity = integrity;
    }

    /// <summary>The app serves <c>rapidoc-min.js</c>, which is inside this package. The default.</summary>
    public static RapiDocAssets Bundled { get; } = new("bundled");

    /// <summary>The browser loads the same version from jsDelivr, checked against its SRI hash.</summary>
    public static RapiDocAssets Cdn { get; } = new("cdn");

    /// <summary>A URL of your own, with an optional SRI hash.</summary>
    public static RapiDocAssets FromUrl(string scriptUrl, string? integrity = null)
    {
        ArgumentException.ThrowIfNullOrEmpty(scriptUrl);
        return new("custom", scriptUrl, integrity);
    }

    internal string Kind { get; }

    internal string? ScriptUrl { get; }

    internal string? Integrity { get; }
}

/// <summary>Options of <c>MapRapiDoc</c>. They are the options of every RapiDoc integration, in .NET naming.</summary>
public sealed class RapiDocOptions
{
    /// <summary><c>false</c> maps nothing, for example outside development.</summary>
    public bool Enabled { get; set; } = true;

    /// <summary>The URL path the reference page is served at, within the app. Default <c>/docs</c>.</summary>
    public string UiPath { get; set; } = RapiDocContract.DefaultUiPath;

    /// <summary>
    /// <see cref="UiPath"/> as the browser sees it. Set it only behind a proxy that strips a prefix without
    /// telling the app; the request's <c>PathBase</c> and a route group's prefix are added without it.
    /// </summary>
    public string? PublicUiPath { get; set; }

    /// <summary>
    /// URL of the OpenAPI document, which the browser fetches when the page opens. Default
    /// <c>/openapi/v1.json</c>, where <c>MapOpenApi()</c> serves it. A path starting with <c>/</c> is a path
    /// of the app, so the request's <c>PathBase</c> is put in front of it. An empty string sets none.
    /// </summary>
    public string? SpecUrl { get; set; }

    /// <summary>
    /// The OpenAPI document itself: JSON text, a <c>JsonNode</c>, or an object that serializes to it. It is
    /// written into the page, so the browser makes no request for it. With both, this is shown and
    /// <see cref="SpecUrl"/> is the download link.
    /// </summary>
    public object? Spec { get; set; }

    /// <summary>Page title. Default: the application's name, followed by "API Reference".</summary>
    public string? Title { get; set; }

    /// <summary>Where the browser loads the bundle from. Default <see cref="RapiDocAssets.Bundled"/>.</summary>
    public RapiDocAssets Assets { get; set; } = RapiDocAssets.Bundled;

    /// <summary>
    /// Attributes of <c>rapi-doc</c>, by name: <c>render-style</c>, <c>renderStyle</c> and
    /// <c>RenderStyle</c> are the same attribute. A null value removes a default.
    /// </summary>
    public IDictionary<string, object?> Attributes { get; } = new Dictionary<string, object?>(StringComparer.Ordinal);

    /// <summary>HTML added to the end of <c>head</c>, as given.</summary>
    public string? Head { get; set; }

    /// <summary>CSS added in a <c>style</c> element, as given.</summary>
    public string? Css { get; set; }

    /// <summary>Language of the page.</summary>
    public string Lang { get; set; } = "en";

    /// <summary>Reads the request's Content-Security-Policy nonce, which is set on every script and style.</summary>
    public Func<HttpContext, string?>? Nonce { get; set; }
}
