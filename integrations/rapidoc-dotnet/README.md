# RapiDoc.AspNetCore

Serves a [RapiDoc](https://rapidocui.com) API reference from an ASP.NET Core app: an interactive page for your OpenAPI document, with a console to try requests.

```bash
dotnet add package RapiDoc.AspNetCore
```

```csharp
using RapiDoc.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();

var app = builder.Build();

app.MapOpenApi(); // the OpenAPI document, at /openapi/v1.json
app.MapRapiDoc(); // the reference, at /docs

app.Run();
```

Open `/docs`. The page reads the document `MapOpenApi()` serves, and nothing is loaded from another site: the package carries the RapiDoc bundle.

With Swashbuckle or NSwag, point it at their document: `app.MapRapiDoc(options => options.SpecUrl = "/swagger/v1/swagger.json")`.

## Options

```csharp
app.MapRapiDoc("/reference", options =>
{
    options.Title = "Pets API";
    options.Attributes["render-style"] = "focused";
    options.Attributes["allow-try"] = false;
});
```

| Option | Default | |
| :--- | :--- | :--- |
| `UiPath` | `/docs` | URL path the reference page is served at, within the app. Also the first argument of `MapRapiDoc("/reference")` |
| `SpecUrl` | `/openapi/v1.json` | URL of your OpenAPI document, which the browser fetches when the page opens. A path starting with `/` is a path of the app |
| `Spec` | | The OpenAPI document itself: JSON text, a `JsonNode`, or an object that serializes to it. It is written into the page, so the browser makes no request for it. With both, `Spec` is shown and `SpecUrl` is the download link |
| `Title` | the application's name + "API Reference" | Page title |
| `Assets` | `RapiDocAssets.Bundled` | `Bundled`: the app serves `rapidoc-min.js`. `RapiDocAssets.Cdn`: the browser loads the same version from jsDelivr, checked against its SRI hash. `RapiDocAssets.FromUrl(url, integrity)`: a URL of your own |
| `Attributes` | | [Attributes of `<rapi-doc>`](https://rapidocui.com/api/) by name; `render-style`, `renderStyle` and `RenderStyle` are the same attribute. They win over the package's own, and `null` removes one |
| `Head` | | HTML added to the end of `<head>`, as given |
| `Css` | | CSS added in a `<style>` element, as given |
| `Lang` | `en` | Language of the page |
| `Nonce` | | A function that reads the request's Content-Security-Policy nonce, which is then set on every `<script>` and `<style>` |
| `PublicUiPath` | | `UiPath` as the browser sees it. Only needed behind a proxy that strips a prefix without telling the app |
| `Enabled` | `true` | `false` maps nothing |

These are the options of every RapiDoc integration, in .NET naming.

## Notes

- `MapRapiDoc` returns an endpoint convention builder for all of its endpoints, so `app.MapRapiDoc().RequireAuthorization()` protects the reference, and `app.MapGroup("/internal").MapRapiDoc()` serves it at `/internal/docs`.
- To serve it only in development, call it inside `if (app.Environment.IsDevelopment())`.
- The request's `PathBase` (`UsePathBase`, or a reverse proxy with forwarded headers) and a route group's prefix are part of every URL the page writes.
- OAuth sign-in returns to `{UiPath}/oauth-receiver.html`, which the app serves on its own origin, also with `RapiDocAssets.Cdn`.
- The endpoints answer `GET` and `HEAD`, are left out of the OpenAPI document, and send the bundle with an `ETag`.
- The package ships one RapiDoc release (the version in `RAPIDOC_VERSION`); `rapidoc-min.js.LICENSE.txt`, served next to the bundle, lists the libraries inside it.

.NET 8 or later. MIT.

## Releasing (for maintainers)

Releases go to nuget.org from GitHub Actions, through a trusted publishing policy. There is no stored API key and nothing to upload by hand.

1. **Set the version.** Raise `<Version>` in `src/RapiDoc.AspNetCore/RapiDoc.AspNetCore.csproj`. nuget.org refuses a version number that already exists.
2. **Choose the bundle.** To ship a newer RapiDoc, put its npm version in `RAPIDOC_VERSION`. The package carries exactly that release of `rapidoc-min.js`. Leave the file alone for a release that only changes the C# code.
3. **Check locally** (optional; the workflow runs the same steps):

   ```bash
   scripts/sync-assets.sh --npm
   dotnet test
   ```

4. **Merge to `master`.** The ".NET package" workflow runs the tests on the oldest and newest supported .NET.
5. **Publish.** On GitHub, open Actions, choose **.NET package**, click **Run workflow**, tick **Publish the version in the project file to nuget.org**, and run it on `master`. It tests, packs, checks that the package contains the bundle, and pushes.
6. **Verify.** `dotnet add package RapiDoc.AspNetCore --version <version>` in a new project, and check https://www.nuget.org/packages/RapiDoc.AspNetCore.

Which number to raise: a fix or a newer bundle is a patch (0.1.1); a new option is a minor (0.2.0). While the version is 0.x, a change that breaks existing code is also a minor, and is called out in the release notes.

The trusted publishing policy on nuget.org is tied to the workflow file `publish-dotnet.yml` and the GitHub environment `nuget`, and the workflow reads the nuget.org user name from the repository secret `NUGET_USER`. Renaming the file or the environment stops publishing until the policy is updated under Trusted Publishing in the nuget.org account.
