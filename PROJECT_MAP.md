# Project Map

This document gives future contributors a quick map of the repository. The rules and validation checklist live in [AGENTS.md](./AGENTS.md).

## Request flow

The primary deployment uses Vinext and Vite. `vite.config.ts` composes Vinext, the local Sites plugin, and Cloudflare bindings; `worker/index.ts` handles image optimization and delegates application requests to the generated App Router handler. The alternate GitHub Pages build uses `next.config.ts` to enable static export and calculate the repository base path.

## Public routes

| Route | Entry point | Purpose |
| --- | --- | --- |
| `/` | `app/page.tsx` | Primary campus experience |
| `/campus` | `app/campus/page.tsx` | Explicit campus route |
| `/recruiter` | `app/recruiter/page.tsx` | Conventional recruiter-first portfolio |
| `/products` | `app/products/page.tsx` | Product directory |
| `/products/tabtally` | `app/products/tabtally/page.tsx` | TabTally product and engineering story |

`app/layout.tsx` owns global metadata, fonts, and stylesheet imports.

## Main modules

| Path | Responsibility |
| --- | --- |
| `app/components/ClayCampus.tsx` | 3D world, explorer movement, collisions, camera, landmark models, overlays, dialogs, fallback, and accessibility behavior |
| `app/components/PortfolioExperience.tsx` | Recruiter view and role-lens interactions |
| `app/components/PublicHeader.tsx` | Shared header and footer for conventional pages |
| `app/data/portfolio.ts` | Canonical campus destinations and featured-project facts |
| `app/data/products.ts` | Canonical product-directory data |
| `app/globals.css` | Reset, global tokens, and foundational styles |
| `app/public-site.css` | Recruiter and product page styling |
| `app/clay-campus.css` | Campus canvas, overlays, dialogs, controls, fallbacks, and responsive rules |
| `public/` | Images, clay textures, and downloadable resume PDFs |
| `scripts/generate_resumes.py` | Generates four local-only recruiter-lens resume drafts under `outputs/resume-drafts/` |

## Supporting infrastructure

- `next.config.ts`: static-export behavior, GitHub Pages base path, and unoptimized image setting.
- `vite.config.ts`: Vinext development/build configuration and Cloudflare D1/R2 binding setup.
- `worker/index.ts`: Cloudflare Worker entry and image transformation path.
- `.openai/hosting.json`: deployment binding names consumed by Vite.
- `.github/workflows/deploy-pages.yml`: GitHub Pages build and deployment.
- `db/`, `drizzle/`, and `examples/d1/`: database scaffolding and examples; they are excluded from the application TypeScript check and are not currently used by the public routes.
- `design-qa.md`: historical visual and performance evidence for the clay-campus work. It is a record, not a substitute for checking the current implementation.
- `CAMPUS_ART_DIRECTION.md`: durable visual standard for the campus's claymation materials, forms, palette, lighting, composition, and visual QA.

## Content ownership

Campus dialogs and the recruiter view both derive project information from `app/data/portfolio.ts`; edit shared facts there first. The product directory derives its cards from `app/data/products.ts`. The detailed TabTally page contains additional route-specific narrative and support/privacy links.

When adding a campus destination, update the destination ID/type and data, provide its scene representation, account for collision and approach coordinates, and verify every navigation surface and fallback. When adding a conventional route, include route metadata, use the shared public chrome where appropriate, and confirm it is emitted by the GitHub Pages static build.
