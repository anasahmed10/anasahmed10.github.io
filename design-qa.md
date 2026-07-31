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

- Landmark selection and walking remain smooth at display refresh rate.
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
- Texture transfer: 10,806 bytes total.
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

final result: passed
