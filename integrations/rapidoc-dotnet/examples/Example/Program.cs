// dotnet run --project examples/Example --urls http://localhost:4407  →  http://localhost:4407/docs

using RapiDoc.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();

var app = builder.Build();

app.MapOpenApi(); // the OpenAPI document, at /openapi/v1.json
app.MapRapiDoc(options =>
{
    options.Attributes["render-style"] = "focused";
    options.Attributes["show-header"] = false;
});

app.MapGet("/hello", (string name = "world") => new Greeting($"Hello, {name}!"))
    .WithTags("Greetings")
    .WithSummary("Say hello");

app.Run();

internal sealed record Greeting(string Message);
