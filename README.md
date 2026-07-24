# Anas Ahmed — Enterprise Systems Campus

An original, recruiter-friendly interactive portfolio built as a lightweight 2D/2.5D campus. It uses React, CSS, and DOM interactions—no 3D engine, server, database, authentication, or private runtime configuration.

## What is included

- Keyboard-controlled service rover (`WASD` or arrow keys)
- Touch controls for mobile and tablet
- Seven accessible campus landmarks and case-study dialogs
- Campus map, progress, reset, muted-by-default audio, and reduced-effects controls
- Conventional Recruiter Mode with impact, experience, projects, skills, contact status, and print-to-PDF résumé
- A no-JavaScript résumé fallback
- Responsive layouts and reduced-motion support

The portfolio intentionally does not invent missing personal assets. Replace the contact-status note once verified email, GitHub, LinkedIn, résumé, or headshot assets are supplied.

## Local development

Requires Node.js 22.13 or newer.

```bash
pnpm install
pnpm dev
```

## Production build

The Sites-compatible production build is:

```bash
pnpm build
```

## GitHub Pages

The included Pages workflow produces a fully static export and automatically derives the repository subpath from `GITHUB_REPOSITORY`.

1. Push the repository to GitHub.
2. In **Settings → Pages**, choose **GitHub Actions** as the source.
3. Run the “Deploy to GitHub Pages” workflow, or push to `main`.

For a local Pages export:

```bash
GITHUB_REPOSITORY="owner/repository-name" pnpm build:pages
```

The static output is written to `out/`.

## Content verification

All outcomes shown in the portfolio come directly from the supplied brief. Employer names, confidential implementation detail, external contact links, a headshot, application screenshots, and app-store claims are omitted because verified source material was not provided.
