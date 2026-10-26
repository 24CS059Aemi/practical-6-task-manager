const test = require("node:test");
const assert = require("node:assert/strict");
const {
    allTasksCacheKey,
    cache,
    getCached,
    getCacheStats,
    invalidateUserTaskCache,
    setCached,
    taskCacheKey
} = require("../utils/taskCache");

test("cache keys isolate task data by user", () => {
    assert.notEqual(allTasksCacheKey("user-a"), allTasksCacheKey("user-b"));
    assert.notEqual(taskCacheKey("user-a", "task-1"), taskCacheKey("user-b", "task-1"));
});

test("cache reads track hits and misses", () => {
    cache.flushAll();
    const before = getCacheStats();
    const key = allTasksCacheKey("cache-test-user");

    assert.equal(getCached(key), undefined);
    setCached(key, [{ _id: "task-1" }]);
    assert.deepEqual(getCached(key), [{ _id: "task-1" }]);

    const after = getCacheStats();
    assert.equal(after.misses - before.misses, 1);
    assert.equal(after.hits - before.hits, 1);
    cache.flushAll();
});

test("write invalidation clears all task entries for one user only", () => {
    cache.flushAll();
    setCached(allTasksCacheKey("user-a"), [{ _id: "task-1" }]);
    setCached(taskCacheKey("user-a", "task-1"), { _id: "task-1" });
    setCached(allTasksCacheKey("user-b"), [{ _id: "task-2" }]);

    invalidateUserTaskCache("user-a");

    assert.equal(cache.get(allTasksCacheKey("user-a")), undefined);
    assert.equal(cache.get(taskCacheKey("user-a", "task-1")), undefined);
    assert.deepEqual(cache.get(allTasksCacheKey("user-b")), [{ _id: "task-2" }]);
    cache.flushAll();
});
