// Runs the conformance fixtures of @rapidoc/embed against the C# port of the contract.

using System.Text;
using System.Text.Json.Nodes;

namespace RapiDoc.AspNetCore.Tests;

public class ConformanceTests
{
    // In the monorepo the fixtures are a few folders up; in a repository of its own, point
    // RAPIDOC_CONFORMANCE_DIR at a copy of node_modules/@rapidoc/embed/conformance/fixtures.
    private static readonly string Fixtures = FindFixtures();

    private static string FindFixtures()
    {
        var fromEnvironment = Environment.GetEnvironmentVariable("RAPIDOC_CONFORMANCE_DIR");
        if (!string.IsNullOrEmpty(fromEnvironment)) return fromEnvironment;
        for (var folder = new DirectoryInfo(AppContext.BaseDirectory); folder is not null; folder = folder.Parent)
        {
            var candidate = Path.Combine(folder.FullName, "packages", "rapidoc-embed", "conformance", "fixtures");
            if (Directory.Exists(candidate)) return candidate;
        }
        throw new DirectoryNotFoundException("No conformance fixtures found; set RAPIDOC_CONFORMANCE_DIR");
    }

    public static TheoryData<string> Cases()
    {
        var cases = new TheoryData<string>();
        foreach (var folder in Directory.GetDirectories(Fixtures).Order(StringComparer.Ordinal))
        {
            if (File.Exists(Path.Combine(folder, "input.json"))) cases.Add(Path.GetFileName(folder));
        }
        return cases;
    }

    [Fact]
    public void FindsTheFixtures() => Assert.True(Cases().Count >= 24, $"no conformance fixtures in {Fixtures}");

    [Theory]
    [MemberData(nameof(Cases))]
    public void Fixture(string name)
    {
        var folder = Path.Combine(Fixtures, name);
        var input = JsonNode.Parse(File.ReadAllText(Path.Combine(folder, "input.json"), Encoding.UTF8))!.AsObject();
        var options = input["options"] as JsonObject;
        var page = input["page"]!.GetValue<string>();

        if (page == "routes")
        {
            var expected = JsonNode.Parse(File.ReadAllText(Path.Combine(folder, "expected.json"), Encoding.UTF8));
            var actual = new JsonArray();
            foreach (var route in RapiDocContract.EmbedRoutes(options))
            {
                var item = new JsonObject { ["path"] = route.Path, ["kind"] = route.Kind };
                if (route.File is not null) item["file"] = route.File;
                item["contentType"] = route.ContentType;
                actual.Add(item);
            }
            Assert.True(JsonNode.DeepEquals(expected, actual), $"routes differ: {actual.ToJsonString()}");
            return;
        }

        var html = page == "host" ? RapiDocContract.RenderHostPage(options) : RapiDocContract.RenderOAuthReceiverPage(options);
        AssertSamePage(File.ReadAllText(Path.Combine(folder, "expected.html"), Encoding.UTF8), html);
    }

    private const string SpecOpen = "<script type=\"application/json\" slot=\"rapidoc-spec\">";
    private const string SpecClose = "</script>";

    /// <summary>The page without its inline spec, and the inline spec's text (null when there is none).</summary>
    private static (string Page, string? Spec) SplitPage(string html)
    {
        var start = html.IndexOf(SpecOpen, StringComparison.Ordinal);
        if (start < 0) return (html, null);
        var begin = start + SpecOpen.Length;
        var end = html.IndexOf(SpecClose, begin, StringComparison.Ordinal);
        return (html[..begin] + html[end..], html[begin..end]);
    }

    /// <summary>The contract's comparison: byte for byte, except the inline spec, which is compared as parsed JSON.</summary>
    private static void AssertSamePage(string expected, string actual)
    {
        var (expectedPage, expectedSpec) = SplitPage(expected);
        var (actualPage, actualSpec) = SplitPage(actual);
        Assert.Equal(expectedPage, actualPage);
        if (expectedSpec is null) return;
        Assert.NotNull(actualSpec);
        Assert.True(actualSpec.IndexOfAny(['<', '>', '&', (char)0x2028, (char)0x2029, '\n']) < 0, "the inline spec cannot end its script element");
        Assert.True(JsonNode.DeepEquals(JsonNode.Parse(expectedSpec), JsonNode.Parse(actualSpec)), $"inline spec differs: {actualSpec}");
    }

    [Fact]
    public void ComparesAPageByteForByteExceptTheInlineSpec()
    {
        static string Page(string spec, string title = "T") =>
            $"<title>{title}</title>\n      {SpecOpen}{spec}{SpecClose}\n    </rapi-doc>\n";

        AssertSamePage(Page("{\"a\":2,\"b\":1}"), Page("{\"b\":1,\"a\":2}"));
        Assert.ThrowsAny<Xunit.Sdk.XunitException>(() => AssertSamePage(Page("{\"a\":2,\"b\":1}"), Page("{\"a\":3,\"b\":1}")));
        Assert.ThrowsAny<Xunit.Sdk.XunitException>(() => AssertSamePage(Page("{}"), Page("{}", "T ")));
        Assert.ThrowsAny<Xunit.Sdk.XunitException>(() => AssertSamePage(Page("{\"a\":\"x\"}"), Page("{\"a\":\"<\"}")));
    }

    [Fact]
    public void InlineJsonCannotEndItsScriptElement()
    {
        var lineSeparator = ((char)0x2028).ToString();
        var paragraphSeparator = ((char)0x2029).ToString();
        var name = "Zo" + (char)0xEB + " " + char.ConvertFromUtf32(0x1F600);
        var spec = new JsonObject
        {
            ["info"] = new JsonObject
            {
                ["title"] = "</script><b>&",
                ["note"] = "a" + lineSeparator + "b" + paragraphSeparator + "\ttab \"quoted\" back\\slash",
                ["name"] = name,
            },
        };
        var text = RapiDocContract.InlineJson(spec);
        Assert.DoesNotContain("<", text);
        Assert.DoesNotContain(">", text);
        Assert.DoesNotContain("&", text);
        Assert.DoesNotContain(lineSeparator, text);
        Assert.DoesNotContain(paragraphSeparator, text);
        Assert.Contains(name, text); // other non-ASCII characters are written as they are
        Assert.True(JsonNode.DeepEquals(spec, JsonNode.Parse(text)));
        Assert.Equal(text, RapiDocContract.InlineJson(JsonValue.Create(spec.ToJsonString())));
    }

    [Fact]
    public void WritesValuesAsJavaScriptDoes()
    {
        var options = new JsonObject
        {
            ["options"] = JsonNode.Parse("""{"a":2.0,"b":1.5,"c":true,"d":[1,"x",null],"e":10,"oauth-receiver":null}"""),
        };
        var attributes = RapiDocContract.ToAttributes(options);
        Assert.Equal(
            ["a=2", "b=1.5", "c=true", "d=[1,\"x\",null]", "e=10"],
            attributes.Select(pair => $"{pair.Key}={pair.Value}"));
        Assert.Throws<ArgumentException>(() => RapiDocContract.AttributeName("on click"));
        Assert.Throws<ArgumentException>(() => RapiDocContract.AttributeName("x\n"));
    }

    [Fact]
    public void ReadsUiPathAndNoOtherNameForIt()
    {
        Assert.Equal("/docs", RapiDocContract.EmbedUrls(new JsonObject { ["path"] = "/old/" }).Page);
        Assert.Equal("/new", RapiDocContract.EmbedUrls(new JsonObject { ["path"] = "/old", ["uiPath"] = "new" }).Page);
        Assert.Equal("/docs", RapiDocContract.EmbedUrls(null).Page);
        Assert.Equal("/docs", RapiDocContract.EmbedUrls(new JsonObject { ["uiPath"] = "" }).Page);
        Assert.Equal("/", RapiDocContract.EmbedUrls(new JsonObject { ["uiPath"] = "/" }).Page);
        Assert.Equal(2, RapiDocContract.ContractVersion);
    }

    [Fact]
    public void TakesAnEmptyOptionAsAnAbsentOne()
    {
        var empty = JsonNode.Parse("""{"uiPath":"","specUrl":"","spec":"","title":"","assets":"","head":"","css":"","lang":"","nonce":""}""")!.AsObject();
        Assert.Equal(RapiDocContract.RenderHostPage(null), RapiDocContract.RenderHostPage(empty));
        Assert.Equal(4, RapiDocContract.EmbedRoutes(empty).Count);
        var custom = JsonNode.Parse("""{"assets":{"scriptUrl":"/x.js"}}""")!.AsObject();
        Assert.Equal(2, RapiDocContract.EmbedRoutes(custom).Count);
    }
}
