const test = require("node:test");
const assert = require("node:assert/strict");
const { generateTaskDescription } = require("../services/aiService");

test("AI service returns the generated description without exposing the key to callers", async() => {
    let requestUrl;
    let requestOptions;
    const description = await generateTaskDescription("Prepare presentation", {
        apiKey: "server-only-test-key",
        fetchImpl: async(url, options) => {
            requestUrl = url;
            requestOptions = options;
            return {
                ok: true,
                json: async() => ({
                    choices: [{ message: { content: "Draft slides and review them." } }]
                })
            };
        }
    });

    assert.equal(description, "Draft slides and review them.");
    assert.equal(requestUrl, "https://api.openai.com/v1/chat/completions");
    assert.equal(requestOptions.headers.Authorization, "Bearer server-only-test-key");
    assert.match(requestOptions.body, /Prepare presentation/);
});

test("AI service reports missing server-side API configuration", async() => {
    await assert.rejects(
        generateTaskDescription("Prepare presentation", {
            apiKey: "",
            fetchImpl: async() => {
                throw new Error("fetch must not run without an API key");
            }
        }),
        { status: 503, message: "AI description service is not configured" }
    );
});

test("AI service rejects unsuccessful provider responses", async() => {
    await assert.rejects(
        generateTaskDescription("Prepare presentation", {
            apiKey: "server-only-test-key",
            fetchImpl: async() => ({ ok: false })
        }),
        { status: 502, message: "AI provider request failed" }
    );
});
