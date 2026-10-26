const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });
let hits = 0;
let misses = 0;

function getCached(key) {
    const value = cache.get(key);
    if (value === undefined) {
        misses += 1;
    } else {
        hits += 1;
    }
    return value;
}

function setCached(key, value) {
    cache.set(key, value);
}

function allTasksCacheKey(userId) {
    return `tasks:${userId}:all`;
}

function taskCacheKey(userId, taskId) {
    return `tasks:${userId}:${taskId}`;
}

function invalidateUserTaskCache(userId) {
    const prefix = `tasks:${userId}:`;
    const keys = cache.keys().filter((key) => key.startsWith(prefix));
    if (keys.length > 0) {
        cache.del(keys);
    }
}

function getCacheStats() {
    return { hits, misses, keys: cache.keys().length };
}

module.exports = {
    allTasksCacheKey,
    cache,
    getCached,
    getCacheStats,
    invalidateUserTaskCache,
    setCached,
    taskCacheKey
};
