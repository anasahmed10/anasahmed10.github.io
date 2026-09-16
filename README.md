# Anas Ahmed — Public Engineering and Product Site

Anas Ahmed’s public home for enterprise engineering work, recruiter information, and products. The site combines an interactive 3D clay campus with a conventional recruiter view and a reusable product directory.

## What is included

- Public hub at `/`
- Enterprise Systems Campus at `/campus`
- Recruiter View at `/recruiter`
- Product directory at `/products`
- Recruiter-first SplitDish product story at `/products/splitdish`
- Keyboard-controlled campus guide (`WASD` or arrow keys)
- Touch controls for mobile and tablet
- Eight accessible campus landmarks and case-study dialogs, including Highlight Corner
- Campus map, reset controls, reduced-motion support, and WebGL fallback
- Conventional Recruiter Mode with impact, experience, projects, skills, contact status, and print-to-PDF résumé
- A no-JavaScript résumé fallback
- Responsive layouts and reduced-motion support

The product pages use sanitized application visuals and avoid unverified store, release, adoption, and privacy claims. SplitDish Support and Privacy remain independently published public pages.

## Local development

Requires Node.js 22.13 or newer.

```bash
pnpm install
pnpm dev
```

Campus data and traversal checks run with `pnpm test:campus`. For browser checks,
serve the Pages export at `http://127.0.0.1:4173` and run
`node tests/campus-browser.mjs` with an existing Playwright installation and Chrome.
Set `PLAYWRIGHT_MODULE` to its module path when Playwright is supplied by an external
runtime. `CAMPUS_TEST_URL` overrides the test server; screenshots go to `/tmp` by default.

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

Experience claims and project outcomes are drawn from the supplied resumes, user-confirmed details, and the local SplitDish repository. The public copy avoids unverified adoption, store-count, and revenue claims.
