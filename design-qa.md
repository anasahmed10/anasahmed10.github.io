# Performance-Safe Claymation Design QA

## Reference and implementation

- Visual target: `/Users/anas/.codex/generated_images/019fb655-1f60-78c3-bf40-e5d4f50bc2aa/call_spW4JEmfeHYVuoxGn1xHwvd9.png`
- Reference pixels: 1167 × 1348, resized proportionally for the 1280 × 1478 comparison.
- Implementation capture: `/var/folders/t5/ldjqvjls55vfj04ph9vq926w0000gn/T/clay-campus-final-1280x1478-v5.jpg`
- Comparison board: `/tmp/anas-clay-texture/clay-final-comparison.jpg`
- Focused material comparison: `/tmp/anas-clay-texture/clay-final-focus.jpg`
- State: 3D campus open, initial explorer position, no destination dialog.
- CSS viewport: 1280 × 1478 at DPR 1. A separate 1280 × 720 desktop capture was also checked.

The mock was treated as a material, lighting, and stop-motion reference. The existing responsive UI layout, camera framing rules, destination data, routes, and controls were intentionally preserved.

## Visual fidelity

| Surface | Result | Evidence |
| --- | --- | --- |
| Typography | Passed | Existing type families, weights, wrapping, and hierarchy remain unchanged. |
| Layout | Passed | Navigation, campus map, prompt panel, controls, labels, and dialogs retain their existing responsive placement. |
| Colors | Passed | The original palette remains recognizable with a warmer ground, cream path, golden center, warm key, and cool rim. |
| Asset quality | Passed | Clay objects use a seamless 256 × 256 normal map and roughness map with restrained fingerprints and tool marks. Glass, screens, water, paper, and tires remain smooth. |
| Form and joins | Passed | Deterministic mount-time deformation softens silhouettes; slight seeded rotations and overlaps create pressed joins without adding polygon density or changing collision bounds. |
| Lighting | Passed | Warm key, cool rim, restrained hemisphere fill, ACES tone mapping, and tighter contact shadows create a miniature-stage read without post-processing. |
| Content | Passed | Public copy, destination data, URLs, and routes are unchanged. |

## Comparison history

1. Baseline: smooth, evenly lit toy-plastic materials.
2. First clay pass: visible material texture and deformation, but the largest rounded boxes showed overly regular ribs.
3. Final pass: softened geometry displacement and rebalanced normal strength retained hand-worked texture while removing the ribbed artifact.

No P0, P1, or P2 visual issues remain. The realtime material is intentionally subtler than the offline mock at extreme close range to protect frame time and texture budget.

## Responsive, interaction, and accessibility

Checked at 1280 × 1478, 1280 × 720, 768 × 1024, and 390 × 844.

- Tapping or clicking open terrain sets a point-and-move destination and remains smooth at display refresh rate.
- Movement slides along building collision edges and cancels an unreachable target instead of trapping the explorer.
- Tapping a building, floating building label, top-navigation destination, or Campus map entry teleports the explorer and opens the matching information panel.
- Environmental poses update on a shared 12 Hz stepped clock.
- The TabTally dialog opens and closes correctly, and focus returns to the originating landmark button.
- The 2D fallback exposes all six destinations and returns to the 3D campus.
- Reduced-motion emulation produced pixel-identical environmental frames 750 ms apart while leaving navigation available.
- Desktop labels, mobile map behavior, hover states, routes, recruiter view, and keyboard controls remain unchanged.
- No application console errors were found. Three.js emitted only its existing clock deprecation notice during development.

## Performance and build evidence

- Baseline 10-second desktop walk: 60 fps, 16.7 ms median, 17.6 ms P95.
- Clay 10-second desktop walk: 60 fps, 16.7 ms median, 17.6 ms P95.
- Mobile emulation: 60 fps, 16.7 ms median, 17.6 ms P95.
- Active clay texture transfer: 41,046 bytes total.
- ClayCampus production chunk: 251,928 bytes gzip, 1,629 bytes above the measured production baseline.
- Repeated trees and flowers are instanced.
- Desktop profile: DPR capped at 1.5, 1024 px shadows.
- Mobile/coarse-pointer profile: DPR capped at 1.25, 512 px shadows, decorative sparkles omitted.
- Reduced-motion profile: static environmental poses with navigation preserved.
- ESLint: 0 errors; seven existing `next/no-img-element` warnings on product pages.
- TypeScript: passed.
- Vinext production build: passed.
- Test script: passed.
- Next.js static Pages build: passed; all routes prerendered.
- `git diff --check`: passed.

## Explorer reference pass

- Source visual target: `/tmp/codex-remote-attachments/019fb655-1f60-78c3-bf40-e5d4f50bc2aa/6B2A3823-FC4C-47A6-9658-80B0F0E77E1A/1-Pasted-Image-1.jpg`
- Browser-rendered implementation: `http://localhost:3000/`, 390 × 844 CSS px at DPR 1, with the explorer teleported to Deer Computer Repairs and the information panel closed.
- Focused implementation crop: `/tmp/anas-clay-texture/player-final-portrait.jpg`
- Combined comparison: `/tmp/anas-clay-texture/player-comparison.jpg`
- Source pixels: 588 × 1280. Normalized comparison: 460 × 1000 per side.

The player now uses the reference silhouette and palette: a larger warm-clay head, black bowl-style hair with side locks, black eyes and smile, white collar and sleeves, blue torso with a centered yellow button, skin-tone hands, and black clay trousers and shoes. The old chest stripe and backpack were removed because they were absent from the supplied reference. The implementation crop is necessarily softer because it is captured at the player's in-scene mobile scale; this is an expected P3 density difference, not a missing asset or layout defect.

Required fidelity surfaces for this focused pass all passed: typography/UI context unchanged, spacing and camera framing preserved, clay palette aligned, no new raster asset required, and player copy/content unaffected. Interaction checks still pass for map teleport, automatic dialog opening, nearby building prompt, reduced motion, and 2D fallback.

## South Asian explorer refinement

- Source visual truth: `/tmp/codex-remote-attachments/019fb655-1f60-78c3-bf40-e5d4f50bc2aa/3D9C7106-2A78-4E03-BC8A-5FEB5D37C5C5/1-Pasted-Image-1.jpg`
- Source pixels: 547 × 1075.
- Browser-rendered implementation: `/tmp/portfolio-player-implementation.png`
- Implementation pixels and CSS viewport: 1280 × 720 at DPR 1.
- Combined focused comparison: `/tmp/player-visual-comparison.jpg`
- Movement-state capture: `/tmp/portfolio-player-moved.png`
- State: campus open at the initial explorer position, then point-and-move tested on open terrain.

The revised explorer keeps the reference's compact clay proportions, swept black hair, prominent eyes and brows, navy outer layer, dark shirt and trousers, and white shoes. A warmer medium-brown skin palette and dark hair provide the requested South Asian appearance without relying on caricature or changing the character's role. The tablet shown in the source was deliberately omitted after the user's clarification; the explorer's arms instead use the existing natural idle and walking poses.

Required fidelity surfaces passed: UI typography and copy are unchanged; the player's size, camera framing, and collision footprint are preserved; the navy, charcoal, white, warm-brown, and black palette follows the source; the procedural clay geometry remains sharp enough at in-scene scale; and no unrelated content changed. The full-view and focused comparison found no actionable P0/P1/P2 differences. The scene's isometric camera necessarily shows less facial detail than the portrait reference, which is an acceptable P3 scale constraint.

Point-and-move was exercised after the visual change, the character moved to the selected terrain point, and no browser console errors were recorded. TypeScript, ESLint, the static Pages production build, and `git diff --check` passed; ESLint continues to report only the seven existing `next/no-img-element` warnings.

## Vibrant clay terrain pass

- Source state: `/var/folders/t5/ldjqvjls55vfj04ph9vq926w0000gn/T/codex-clipboard-df28a3f3-a141-45ea-84b8-c09bcd2f0a86.png`
- Mobile/default implementation: `/tmp/portfolio-ground-clay-vibrant.png`
- Mobile movement state: `/tmp/portfolio-ground-clay-vibrant-moved.png`
- Desktop implementation: `/tmp/portfolio-ground-clay-vibrant-desktop.png`
- Viewports: default in-app mobile viewport and 1280 × 720 desktop at DPR 1.
- State: 3D campus open, then point-and-move exercised on the revised ground.

The terrain now uses richer grass, warm cream path, and golden plaza pigments; stronger shared clay normal response; deterministic hand-wobbled boundaries; shallow pressed seams; and eight color-varied smudges rendered in one instanced draw call. All terrain remains flat for navigation, and the decorative overlays ignore raycasting so they cannot block tap-to-move.

Required fidelity surfaces passed: UI typography and copy are unchanged; the original campus layout and camera framing remain intact; the more saturated palette stays readable against landmark labels and controls; the existing clay maps remain the only texture transfer; and no content changed. The desktop and mobile captures show visible edge irregularity and pigment variation without the ground becoming noisy or plastic-looking. Point-and-move succeeded after the change, and no browser console errors were recorded.

final result: passed

## Buildings and environment clay pass

- Source visual truth: `/var/folders/t5/ldjqvjls55vfj04ph9vq926w0000gn/T/codex-clipboard-b4f8bf38-e3b1-40fe-852d-625933e45d09.png`
- Browser-rendered implementation: `/tmp/portfolio-environment-clay-final-maker.png`
- Full-view comparison: `/tmp/clay-environment-comparison.jpg`
- Focused environment comparison: `/tmp/clay-environment-focus-comparison.jpg`
- Movement-state evidence: `/tmp/portfolio-environment-clay-move-test.png`
- Source pixels and CSS viewport: 1167 × 1348 at DPR 1.
- State: Maker & Game Lab selected, information panel closed.

The environment now extends the hand-worked clay treatment to all six building shells and their painted-clay accessories, including doors, frames, posts, controls, car bodywork, scanner structures, tables, and Maker Lab parts. Trees use deformed shared trunk and three-lobe crown geometry with small deterministic tilts. The fountain adds a pressed, uneven clay rim while keeping the water and droplets smooth. Glass, screens, paper, water, and tires remain intentionally smooth to preserve material contrast and the original performance plan.

Comparison history:

1. The first environment pass increased geometry displacement enough to expose regular RoundedBox vertex ribs on large building faces (P2).
2. The final pass reduced global displacement and large-shell deformation while retaining stronger material normals, pressed joins, small-part rotations, and more pronounced organic tree/fountain forms. The post-fix browser capture no longer shows the exaggerated ribbed artifact.

Required fidelity surfaces passed: typography and copy are unchanged; layout, camera rules, labels, and UI spacing are unchanged; the brighter existing palette remains intact; the same 41,046-byte shared texture pair covers the new clay surfaces; and smooth-material exceptions remain visually distinct. The current responsive UI framing differs from the older static mock, but this is intentional existing product behavior rather than design drift.

Interaction checks passed after the visual update: Campus map selection teleported to Maker & Game Lab and opened its dialog, closing restored the scene, point-and-move changed the explorer position, the 2D fallback opened all six destinations and returned to 3D, and no application console errors were recorded. The only console message is the existing Three.js `Clock` deprecation warning. TypeScript, ESLint, the GitHub Pages production build, and `git diff --check` passed; ESLint continues to report only seven existing `next/no-img-element` warnings.

No actionable P0/P1/P2 visual or functional issues remain.

final result: passed

## Strong clay surface correction

- Visual target: `/var/folders/t5/ldjqvjls55vfj04ph9vq926w0000gn/T/codex-clipboard-4521de1a-3ed6-40fb-a10b-39345c21ef5e.png`
- Matched implementation state: `/tmp/portfolio-clay-maker.png`
- Combined reference comparison: `/tmp/clay-reference-comparison.jpg`
- Viewport: 1167 × 1348 CSS px, Maker & Game Lab selected, information panel closed.

The earlier shared maps were too faint to survive the campus camera distance, leaving the scene visibly smooth. The corrected pass uses a generated, seamless hand-worked clay color-variation map plus a derived normal map with mid-scale thumb impressions, pressed ridges, and kneading marks. Those two maps are shared by buildings, trees, props, rails, and terrain, so the stronger material read does not add per-object textures or draw calls. Colors remain deliberately brighter than the reference: saturated grass, purple rails, green trees, coral and blue buildings, and a warmer ochre plaza.

The side-by-side review confirms visible hand-worked texture on the ground, trees, building faces, rails, plaza, and Maker platform. Rounded silhouettes, pressed seams, contact shadows, navigation, labels, dialogs, and the existing player remain intact. The player was explicitly excluded from this visual target. No actionable P0/P1/P2 differences remain for the clay surface request; the live camera and current responsive UI naturally differ from the static mock's older framing.

The active texture pair transfers 41,046 bytes, remaining below the 100 KB clay asset budget. TypeScript, ESLint, the GitHub Pages production build, and `git diff --check` pass; ESLint still reports only the seven existing `next/no-img-element` warnings.

final result: passed
