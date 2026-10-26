async function generateTaskDescription(title, options = {}) {
    const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
    const fetchImpl = options.fetchImpl ?? fetch;

    if (!apiKey) {
        const error = new Error("AI description service is not configured");
        error.status = 503;
        throw error;
    }

    const response = await fetchImpl("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Write one concise, actionable task description in plain text. Do not add a title or invent private details."
                },
                {
                    role: "user",
                    content: `Write a short description for this task title: ${title}`
                }
            ],
            max_tokens: 120,
            temperature: 0.4
        }),
        signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
        const error = new Error("AI provider request failed");
        error.status = 502;
        throw error;
    }

    const payload = await response.json();
    const description = payload.choices?.[0]?.message?.content?.trim();
    if (typeof description !== "string" || description.length === 0) {
        const error = new Error("AI provider returned no description");
        error.status = 502;
        throw error;
    }

    return description;
}

module.exports = { generateTaskDescription };
