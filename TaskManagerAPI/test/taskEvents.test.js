const test = require("node:test");
const assert = require("node:assert/strict");
const TaskEvents = require("node:events");
const registerTaskListeners = require("../listeners/taskListeners");

test("task-created notification runs asynchronously after event emission", async() => {
    const events = new TaskEvents();
    const messages = [];
    registerTaskListeners(events, {
        delayMs: 10,
        log: (message) => messages.push(message),
        logError: (message) => messages.push(message)
    });

    events.emit("task-created", {
        title: "Write tests",
        timestamp: "2026-10-26T00:00:00.000Z",
        userId: "user-123"
    });
    assert.deepEqual(messages, []);

    await new Promise((resolve) => setTimeout(resolve, 30));
    assert.match(messages[0], /Write tests/);
    assert.match(messages[0], /user-123/);
});

test("task-deleted listener logs a distinct notification", async() => {
    const events = new TaskEvents();
    const messages = [];
    registerTaskListeners(events, {
        delayMs: 0,
        log: (message) => messages.push(message),
        logError: (message) => messages.push(message)
    });

    events.emit("task-deleted", { title: "Old task", userId: "user-456" });
    await new Promise((resolve) => setImmediate(resolve));

    assert.match(messages[0], /deleted/);
    assert.match(messages[0], /Old task/);
});

test("task-created listener forwards notification errors to its error event", async() => {
    const events = new TaskEvents();
    const errors = [];
    registerTaskListeners(events, {
        delayMs: 0,
        log: () => {
            throw new Error("log failed");
        },
        logError: (message) => errors.push(message)
    });

    events.emit("task-created", {
        title: "Test error",
        timestamp: "2026-10-26T00:00:00.000Z",
        userId: "user-789"
    });
    await new Promise((resolve) => setTimeout(resolve, 10));

    assert.deepEqual(errors, ["[Notification Error] log failed"]);
});
