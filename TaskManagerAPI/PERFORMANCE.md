# Practical 9: In-Memory Caching and Query Optimization

## Implementation

- `GET /tasks` caches the authenticated user's task list for 60 seconds.
- `GET /tasks/:id` caches an individual task separately, also scoped to its owner.
- Successful `POST`, `PUT`, and `DELETE` operations clear all task cache entries for that user, preventing stale list or detail responses.
- Task GET responses include `X-Cache: MISS` when MongoDB was queried and `X-Cache: HIT` when the response came from memory.
- `GET /tasks/cache/stats` reports process-local hit/miss counts and the number of active keys. Like all task routes, it requires a bearer token.

## Response-time measurements

Record actual Postman or Thunder Client timings; values depend on the local MongoDB, network, and dataset and are intentionally left blank until measured.

| Run | Uncached (`X-Cache` disabled/bypassed) | Cached (`X-Cache: HIT`) |
| --- | ---: | ---: |
| 1 | ____ ms | ____ ms |
| 2 | ____ ms | ____ ms |
| 3 | ____ ms | ____ ms |
| Average | ____ ms | ____ ms |

For a fair comparison, use the same account, task data, request, machine, and database. Capture three uncached readings before enabling the cache, then send the same authenticated `GET /tasks` request three times without writing data: the first cached-enabled request should be `MISS`, and subsequent requests should be `HIT`. Record the Postman **Time** for each response. Do not label existing measurements as uncached unless the cache was actually disabled.

To measure a baseline after implementing this practical, temporarily disable the cache lookup and `setCached` call for the GET route, restart the API, and record three readings; restore caching and restart before taking the cached readings. Keep authentication and all other request conditions identical.

## Analysis

- Every successful task write invalidates the user's list and detail entries. Without invalidation, GET requests could return outdated task data until the 60-second TTL expires.
- A 60-second TTL is a reasonable short-lived cache for this lab: longer TTLs can improve hit rate but increase the window in which external database changes may be stale; shorter TTLs cause more database queries.
- `node-cache` stores data in one Node.js process. With multiple server instances, each process has independent values and invalidations, so requests routed to different instances can see inconsistent data. A shared cache such as Redis is more suitable for that deployment.
- In-memory entries disappear when the API process restarts.
