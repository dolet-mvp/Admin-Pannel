# CI/CD Pipeline and Deployment Guide

## Overview
This repository now includes automated CI/CD pipelines using GitHub Actions to ensure code quality and streamline deployment.

## CI Pipeline

### Continuous Integration Workflow
**File:** `.github/workflows/ci.yml`

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop` branches

**What it does:**
1. **Multi-version testing:** Runs on Node.js 18.x and 20.x
2. **Dependency installation:** Uses `npm ci` for clean, reproducible builds
3. **Linting:** Runs ESLint to check code quality
4. **Build verification:** Ensures the application builds successfully
5. **Artifact storage:** Saves build artifacts for 7 days (Node 20.x only)

**Status Badge:**
Add this to your README to show CI status:
```markdown
![CI Pipeline](https://github.com/dolet-mvp/Admin-Pannel/actions/workflows/ci.yml/badge.svg)
```

## Deployment Options

### Option 1: GitHub Pages (Configured)
**File:** `.github/workflows/deploy-pages.yml`

**Triggers:**
- Push to `main` branch
- Manual dispatch via GitHub UI

**Setup Steps:**
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to main branch or trigger manually
4. Your site will be available at: `https://dolet-mvp.github.io/Admin-Pannel/`

**Configuration:**
- The `vite.config.js` is configured to use the correct base path for GitHub Pages
- Uses the `GITHUB_PAGES` environment variable to set the base path

### Option 2: Vercel (Not Configured)
To deploy to Vercel:
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel auto-detects Vite configuration
4. Deploy automatically on every push

### Option 3: Netlify (Not Configured)
To deploy to Netlify:
1. Sign up at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy automatically on every push

### Option 4: Custom Server
For custom deployment:
1. Run `npm run build` to create production build
2. Serve the `dist` folder with any static file server
3. Example with nginx, Apache, or cloud providers (AWS S3, Azure Static Web Apps, etc.)

## Manual Deployment

### Build locally:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

## Environment Variables
If your application needs environment variables:
1. Create `.env` file locally (already in `.gitignore`)
2. Add variables with `VITE_` prefix (e.g., `VITE_API_URL`)
3. For GitHub Actions, add secrets in repository Settings → Secrets and variables → Actions
4. Reference in workflow: `${{ secrets.YOUR_SECRET_NAME }}`

## Monitoring and Maintenance

### View CI/CD Status
- Go to the "Actions" tab in your GitHub repository
- See all workflow runs, logs, and artifacts

### Troubleshooting
- Check workflow logs for detailed error messages
- Verify Node.js version compatibility
- Ensure all dependencies are properly listed in `package.json`
- Check build artifacts for issues

## Future Enhancements
Consider adding:
- [ ] Unit tests and test coverage
- [ ] E2E testing with Playwright or Cypress
- [ ] Lighthouse CI for performance monitoring
- [ ] Automated dependency updates (Dependabot)
- [ ] Security scanning
- [ ] Docker containerization
- [ ] Preview deployments for pull requests
