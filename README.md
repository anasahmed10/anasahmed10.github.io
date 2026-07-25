# Anas Ahmed — Public Engineering and Product Site

Anas Ahmed’s public home for enterprise engineering work, recruiter information, and products. The site combines a lightweight interactive 2D/2.5D systems campus with a conventional recruiter view and a reusable product directory.

## What is included

- Public hub at `/`
- Enterprise Systems Campus at `/campus`
- Recruiter View at `/recruiter`
- Product directory at `/products`
- Recruiter-first TabTally product story at `/products/tabtally`
- Keyboard-controlled service rover (`WASD` or arrow keys)
- Touch controls for mobile and tablet
- Seven accessible campus landmarks and case-study dialogs
- Campus map, progress, reset, muted-by-default audio, and reduced-effects controls
- Conventional Recruiter Mode with impact, experience, projects, skills, contact status, and print-to-PDF résumé
- A no-JavaScript résumé fallback
- Responsive layouts and reduced-motion support

The product pages use sanitized application visuals and avoid unverified store, release, adoption, and privacy claims. TabTally Support and Privacy remain independently published public pages.

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

The included Pages workflow produces a fully static export. The `anasahmed10.github.io` user-site repository publishes at the domain root; other repositories automatically derive their project subpath from `GITHUB_REPOSITORY`.

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
