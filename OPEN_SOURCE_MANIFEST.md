# Open Source Manifest (Frontend)

This document defines what should be included when publishing the **frontend repository**.

## Include
- `app/` (all UI routes, components, styles)
- `lib/` (frontend chain clients, contracts config, helpers)
- `public/` (only required static assets)
- `graph/` (if subgraph sources are intentionally open in this repo)
- `README.md`
- `RELEASE_CHECKLIST.md`
- `OPEN_SOURCE_MANIFEST.md`
- `SECURITY.md`
- `REPORTING.md`
- `RULES_OF_USE.md`
- `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `.eslintrc.json`
- `.env.example`
- `.gitignore`

## Exclude (must not be committed)
- `.env` and any secret-bearing env files
- `.next/`, `node_modules/`, `coverage/`, build artifacts
- local OS/editor files (`.DS_Store`, temp files)
- private deployment logs with keys/tokens

## Review Before Publish
1. Verify no API keys/tokens/secrets in git diff.
2. Verify addresses in `.env.example` are placeholders only.
3. Verify docs match actual release version and deployment metadata.
4. Verify all links in footer/docs resolve.
5. Verify legal pages and reporting contacts are available.

## Suggested Repo Scope
If you want this repository to stay frontend-only, keep `FlashAlliance/` contracts directory in a separate core repo and link it via `NEXT_PUBLIC_CORE_REPO_URL`.
