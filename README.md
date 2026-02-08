# Admin Panel - React + Vite

![CI Pipeline](https://github.com/dolet-mvp/Admin-Pannel/actions/workflows/ci.yml/badge.svg)

This is an Admin Panel application built with React and Vite.

## CI/CD Pipeline

This repository includes automated CI/CD pipelines:
- ✅ **Continuous Integration:** Automated linting, building, and testing on every push/PR
- ✅ **GitHub Pages Deployment:** Automatic deployment to GitHub Pages on main branch
- 📚 **Full Documentation:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete CI/CD and deployment guide

## Quick Start

### Development
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Deployment

The application is configured for automatic deployment to GitHub Pages. See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- GitHub Pages setup instructions
- Alternative deployment options (Vercel, Netlify, custom servers)
- CI/CD pipeline details
- Environment variable configuration

---

## React + Vite Setup

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
