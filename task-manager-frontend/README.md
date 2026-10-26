# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Practical 8: Performance Optimization

Projects and Contact are loaded as separate route chunks; the task dashboard remains in the initial bundle. The Projects page also lazy-loads its project register when requested. See [PERFORMANCE.md](./PERFORMANCE.md) for the build-size comparison, browser measurements, verification notes, and the limitation that baseline browser values were not captured before optimization.

Run `npm run build` in this directory to verify the split chunks. The optimized build reports an initial JavaScript entry of 199.94 kB (63.01 kB gzip), with separate Projects (1.78 kB), Contact (0.93 kB), and project-register (0.57 kB) chunks.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
