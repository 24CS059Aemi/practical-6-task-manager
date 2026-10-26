const express = require("express");
const { generateTaskDescription } = require("../services/aiService");

const router = express.Router();
const requestTimes = new Map();
const RATE_LIMIT_MS = 60_000;

router.post("/generate-description", async(req, res) => {
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
    if (!title || title.length > 160) {
        return res.status(400).json({
            message: "Enter a task title of 1 to 160 characters."
        });
    }

    const now = Date.now();
    for (const [key, timestamp] of requestTimes) {
        if (now - timestamp >= RATE_LIMIT_MS) {
            requestTimes.delete(key);
        }
    }

    const requestKey = `${req.user.id}:${title.toLowerCase()}`;
    const previousRequest = requestTimes.get(requestKey);
    if (previousRequest && now - previousRequest < RATE_LIMIT_MS) {
        return res.status(429).json({
            message: "Please wait one minute before requesting another suggestion for this task."
        });
    }

    requestTimes.set(requestKey, now);

    try {
        const description = await generateTaskDescription(title);
        return res.status(200).json({ description });
    } catch (error) {
        if (error.name === "TimeoutError" || error.name === "AbortError") {
            return res.status(504).json({
                message: "The AI suggestion timed out. You can still write the description yourself."
            });
        }

        if (error.status === 503) {
            return res.status(503).json({
                message: "AI suggestions are not configured. You can still write the description yourself."
            });
        }

        console.error("AI description request failed:", error.message);
        return res.status(502).json({
            message: "AI suggestions are temporarily unavailable. You can still write the description yourself."
        });
    }
});

module.exports = router;
