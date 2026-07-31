# AGENTS.md

This file is the operating guide for coding agents working in this repository. Read it before making changes. For a file and route map, see [PROJECT_MAP.md](./PROJECT_MAP.md). Any change to the campus visuals must also follow [CAMPUS_ART_DIRECTION.md](./CAMPUS_ART_DIRECTION.md).

## Project intent

This is Anas Ahmed's public engineering and product portfolio. It has two complementary experiences:

- an interactive, accessible 3D "Enterprise Systems Campus" at `/` and `/campus`;
- conventional recruiter and product pages at `/recruiter`, `/products`, and `/products/tabtally`.

Preserve the site's credibility. Do not invent employment details, outcomes, adoption figures, store status, privacy claims, testimonials, or product capabilities. Treat the existing copy, supplied resumes, and user-provided facts as the source of truth. Ask before publishing a claim that cannot be verified locally.

## Stack and runtime

- Node.js 22.13 or newer
- pnpm (the committed `pnpm-lock.yaml` is authoritative)
- Next.js 16 App Router, React 19, and TypeScript in strict mode
- React Three Fiber, Drei, and Three.js for the campus
- Vinext/Vite and a Cloudflare Worker for the primary production build
- Next.js static export for GitHub Pages
- Plain CSS files under `app/`; Tailwind is installed but is not the primary styling model
- Drizzle/D1 scaffolding exists but is not currently part of the public portfolio routes

Use `pnpm`; do not add npm or Yarn lockfiles. Do not edit generated output in `.next/`, `.vinext/`, `out/`, `dist/`, `.wrangler/`, or generated Drizzle metadata unless the task explicitly requires regeneration.

## Common commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
pnpm test
GITHUB_REPOSITORY="owner/repository-name" pnpm build:pages
```

`pnpm test` currently runs the production Vinext build. `pnpm build:pages` writes the static site to `out/`. A successful primary build does not prove that the GitHub Pages export works; run both builds when changing routing, asset URLs, server/client boundaries, metadata, or deployment configuration.

## Where to make changes

- Put shared portfolio/campus facts in `app/data/portfolio.ts`, not in multiple views.
- Put product-directory facts in `app/data/products.ts`.
- Keep route-specific product narrative in its route only when it is not shared catalog data.
- Reuse `PublicHeader` and `PublicFooter` for conventional public pages.
- Keep global public-page styles in `app/public-site.css`, global resets/tokens in `app/globals.css`, and campus-specific styles in `app/clay-campus.css`.
- Store public assets under `public/` and reference them with root-relative URLs such as `/products/tabtally/og.png`. The GitHub Pages configuration rewrites the deployment base path.
- Treat `app/components/ClayCampus.tsx` as performance-sensitive interactive code. Keep world coordinates, approach points, collision behavior, and destination data aligned.

## Campus requirements

The campus is decorative and interactive, but it must never be the only way to reach or understand portfolio content.

The visual source of truth is the claymation diorama shown in `public/campus/campus-preview.webp`. Preserve that handcrafted art direction; do not reinterpret the campus as glossy toy plastic, low-poly game art, photoreal architecture, or a generic SaaS illustration. The detailed visual rules and review checklist are in `CAMPUS_ART_DIRECTION.md`.

- Preserve keyboard navigation, touch/pointer navigation, the campus map, reset controls, dialogs, focus restoration, and the 2D/WebGL fallback.
- Preserve meaningful accessible names and semantic controls when changing labels or landmarks.
- Respect `prefers-reduced-motion`; navigation should remain available even when environmental motion is disabled.
- Avoid per-frame React state updates and avoid allocating vectors, geometries, materials, or textures inside frame loops.
- Reuse or instance repeated geometry/materials. Keep decorative meshes from intercepting navigation raycasts.
- Check desktop and mobile layouts after scene or overlay changes. The current practical QA viewports are 1280x720, 768x1024, and 390x844.
- Keep smooth materials such as water, screens, glass, paper, and tires visually distinct from the clay surfaces unless the design direction explicitly changes.

## Code conventions

- Follow the existing TypeScript and React style: two-space indentation, double quotes, semicolons, function components, and explicit types where they clarify domain data.
- Default to Server Components. Add `"use client"` only where hooks, browser APIs, or interactive rendering require it.
- Use the `@/*` alias for imports when it improves clarity; nearby relative imports are also established in the project.
- Keep components focused, but do not split the 3D scene mechanically if doing so obscures shared geometry/material lifecycles.
- Keep external URLs centralized when reused. Maintain safe external-link behavior (`rel="noreferrer"` or the established equivalent).
- Do not add a dependency for behavior that can be implemented cleanly with the current stack.

## Validation expectations

Run the smallest relevant checks while iterating, then validate in proportion to the change:

1. `pnpm lint` for application code.
2. `pnpm build` for all meaningful code/configuration changes.
3. `GITHUB_REPOSITORY="anasahmed10/anasahmed10.github.io" pnpm build:pages` for routes, links, assets, metadata, or deployment changes.
4. `git diff --check` before handoff.
5. Browser interaction and responsive checks for UI or campus changes.

Existing `@next/next/no-img-element` warnings on product pages are known; do not introduce new warnings, and do not report the existing warnings as a new regression. For campus changes, verify keyboard and pointer movement, map selection, dialog open/close and focus return, reduced motion, and the 2D fallback. Check the browser console for new errors.

## Scope and repository hygiene

- Inspect `git status` before editing and preserve user changes. Do not overwrite unrelated work.
- Keep changes narrowly scoped. Avoid opportunistic rewrites of the large campus component.
- Do not commit secrets or `.env*` files.
- Do not edit generated resumes or image assets unless the task calls for it. Resume PDFs are generated by `scripts/generate_resumes.py`; keep source facts consistent with the public copy.
- Update `README.md`, this file, or `PROJECT_MAP.md` whenever a change makes their commands, architecture, or constraints inaccurate.
