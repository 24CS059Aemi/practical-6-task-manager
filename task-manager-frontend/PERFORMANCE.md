# Practical 8: Performance Optimization and Lazy Loading

## Implementation

The React entry point selects a component from the current pathname. The task dashboard (`/`) is part of the initial entry bundle. Projects (`/projects`) and Contact (`/contact`) use `React.lazy()` and render inside one route-level `Suspense` boundary. The Projects page also lazy-loads its project register only after the user requests it.

The fallback is `Loading page...` for a route and `Loading project register...` for the optional register. To see either fallback reliably, open DevTools Network, enable **Slow 3G**, and navigate to a route or select **Load project register**.

## Build Measurements

Measurements are from `npm run build` in `task-manager-frontend`, using Vite's reported raw and gzip sizes.

| Build output | Before (single dashboard) | After (route splitting) |
| --- | ---: | ---: |
| Initial JavaScript entry | 197.50 kB / 62.14 kB gzip | 199.94 kB / 63.01 kB gzip |
| Route JavaScript chunks | None | Projects: 1.78 kB / 0.80 kB gzip; Contact: 0.93 kB / 0.45 kB gzip |
| Optional project register | Included in single bundle | 0.57 kB / 0.34 kB gzip, loaded on demand |
| CSS output | 10.11 kB / 2.91 kB gzip | 12.18 kB / 3.36 kB gzip |

The pre-change build predates the new Projects and Contact screens, so it is not a like-for-like comparison of identical features. With the new route/navigation code included, the initial entry is 2.44 kB larger raw (0.87 kB gzip) than the old dashboard-only build. The measurable benefit is that Projects and Contact are not part of the initial entry and download only when opened. Visiting every route eventually downloads the deferred chunks; lazy loading changes *when* code is transferred, not necessarily the total session transfer. Use the Network panel to compare the initial `/` navigation and subsequent route navigation on the same browser, cache state, and network profile.

## Browser Network Record

The following post-change values were captured from the browser Resource Timing API on the local production preview during this verification run, with no throttling. Resource durations and transferred bytes vary by browser, cache, and machine; use DevTools Network with cache disabled and a fixed throttle for an assessment comparison.

| Measurement | Before | After |
| --- | --- | --- |
| Initial entry JS transferred | Not captured | 62,628 bytes |
| Initial navigation load event | Not captured | 231.5 ms |
| JS transferred when opening `/projects` | Not a separate route | 1,101 bytes; 9.5 ms resource duration |
| JS transferred when opening `/contact` | Not a separate route | 1,235 bytes; 7.8 ms resource duration |
| Optional project register JS | Not a separate component | 873 bytes; 8.7 ms resource duration |
| Loading fallback observed with Slow 3G | N/A | Not tested with throttling; fallback appeared briefly during unthrottled local navigation |

For a fair browser comparison, build the pre-optimization version before editing, disable cache, reload `/`, and record transferred JavaScript and load time. Then repeat with the optimized build and record the newly requested chunks when opening `/projects` and `/contact`. The baseline browser values were not captured before the change and cannot be reconstructed from this optimized build. Save screenshots of the Network panel alongside this file if required for assessment evidence.

## Reflection

- The initial bundle is fetched as part of the first page load. A lazy chunk is requested only when rendering first requires that component; the browser can cache it for later visits.
- Lazy loading can improve perceived performance by prioritizing code needed for the current screen and postponing unrelated code. It does not promise a smaller total download after every route has been visited.
- It may not be worthwhile for a tiny app or for components users almost always need immediately: extra chunk requests and loading states can add complexity without a meaningful initial-load benefit.
- Vite's build output and browser resource list confirm separate route chunks. A React DevTools Profiler observation was not captured; use the Profiler during the lab session to record one unnecessary re-render rather than inferring one from source alone.