# Enterprise Systems Campus Design QA

## Comparison setup

- Source visual truth: `/Users/anas/.codex/generated_images/019f91f0-1b4f-7f70-ae1b-1b1080822529/call_mF9yJCDUTYaIgKFg3V1IIwYQ.png`
- Baseline implementation screenshot: `/Users/anas/Documents/Codex/2026-07-23/sites-plugin-sites-openai-bundled-create-3/work/design-qa-implementation-before.png`
- Baseline combined evidence: `/Users/anas/Documents/Codex/2026-07-23/sites-plugin-sites-openai-bundled-create-3/work/design-qa-baseline-comparison.jpg`
- Target pixels: 1586 × 992
- Baseline pixels: 1280 × 720
- CSS viewport: 1280 × 720 at devicePixelRatio 2
- Density normalization: both images were center-cropped and downsampled to 640 × 360 before side-by-side comparison.
- State: desktop Campus Mode, map closed, systems drawer open, no blocking modal.

## Baseline findings

- [P1] The world is visually secondary.
  - Evidence: the baseline spends substantial height on the site header and campus heading, then confines the map to a framed dashboard region. The target makes the circular campus fill the viewport.
  - Fix: make Campus Mode an edge-to-edge world with only transparent overlay controls.
- [P1] Landmark art lacks distinct operational substance.
  - Evidence: the baseline repeats small CSS-drawn device primitives, while the target uses seven recognizable industrial stations with real equipment and differentiated silhouettes.
  - Fix: replace the CSS world art with a purpose-built raster campus environment and real raster rover.
- [P1] Navigation has little spatial feedback.
  - Evidence: the baseline rover changes position but has no heading, acceleration, collision response, or camera behavior.
  - Fix: add velocity, heading, bounded service paths, collision feedback, and a gently following camera.
- [P2] The systems index takes permanent layout space from the map.
  - Evidence: the baseline uses a solid grid column; the target keeps the world continuous beneath a translucent direct-access drawer.
  - Fix: move the list into a collapsible glass overlay.
- [P2] Case-study presentation disconnects visitors from the campus.
  - Evidence: the baseline opens a full-screen modal that hides the world.
  - Fix: replace it in Campus Mode with a contextual inspection console while preserving location.
- [P2] The map and discovery states are schematic.
  - Evidence: the baseline mini-map is a generic button grid rather than an illustrated overview.
  - Fix: reuse the illustrated campus world for the map with semantic landmark hotspots and rover position.

## Required fidelity surfaces

- Fonts and typography: retain the existing Geist/Geist Mono system, but match the target’s tighter technical hierarchy and readable 14–16px drawer content.
- Spacing and layout: replace stacked page sections with edge-to-edge world composition and 12–14px overlay insets.
- Colors and tokens: preserve graphite, navy, off-white, mint, amber, blue, and signal green; use translucency rather than opaque panel fills.
- Image quality and assets: use generated raster world, rover, and printer preview assets; do not substitute landmark illustrations with CSS art.
- Copy and content: preserve verified case-study claims and all seven direct-access labels.

## Comparison history

### Iteration 0 — baseline

- Findings: three P1 and three P2 issues listed above.
- Fixes made: none at baseline capture.
- Result: blocked.

### Iteration 1 — full-screen world implementation

- Evidence:
  - `/Users/anas/Documents/Codex/2026-07-23/sites-plugin-sites-openai-bundled-create-3/work/design-qa-implementation-1.png`
  - `/Users/anas/Documents/Codex/2026-07-23/sites-plugin-sites-openai-bundled-create-3/work/design-qa-comparison-1.jpg`
- Fixes:
  - Replaced the dashboard map with a purpose-built 1920 × 1200 illustrated circular campus.
  - Replaced the CSS rover with a transparent raster service rover.
  - Moved the campus toolbar and systems index into translucent overlays.
  - Added contextual side-console case studies, illustrated map hotspots, camera follow, velocity, heading, collision feedback, and proximity states.
- Remaining P2 findings:
  - Top station labels were too close to the toolbar.
  - Direct-access labels wrapped tightly in the first compact drawer pass.
  - The 768px layout used the mobile bottom sheet and obscured too much of the map.

### Iteration 2 — responsive and hierarchy correction

- Evidence:
  - `/Users/anas/Documents/Codex/2026-07-23/sites-plugin-sites-openai-bundled-create-3/work/design-qa-implementation-final.png`
  - `/Users/anas/Documents/Codex/2026-07-23/sites-plugin-sites-openai-bundled-create-3/work/design-qa-comparison-final.jpg`
- Fixes:
  - Lowered the top station hotspots to clear the transparent toolbar.
  - Constrained direct-access labels to single, readable lines and removed list overlap.
  - Added a dedicated 601–780px tablet layout with a right-side translucent drawer so the map remains visible.
  - Kept the compact bottom-sheet list and touch rover controls for phone layouts.
- Result: no remaining actionable P0, P1, or P2 findings.

## Browser verification

- Desktop, 1280 × 720:
  - Expanded Campus Mode is the default.
  - Framed/expanded toggle works.
  - Direct-access landmark opening, contextual console, and Escape close work.
  - `M` illustrated-map shortcut, reset, sound, effects, and Recruiter Mode controls work.
  - Visited progress updates and reset returns it to 0/7.
  - Final browser console contains no application errors.
- Tablet, 768 × 844:
  - Full campus remains visible.
  - Direct access uses a translucent right drawer.
  - Touch controls are present and the landmark labels remain readable.
- Mobile, 390 × 844:
  - Campus remains full viewport.
  - Direct access is immediately visible as a bottom sheet.
  - Touch rover controls and touch-friendly landmark buttons are present.
  - The systems list remains independently scrollable.
- Conventional Recruiter Mode was opened directly from Campus Mode and its tailored résumé download actions remained available.
- Static compatibility:
  - `pnpm build` passed.
  - `GITHUB_REPOSITORY=anasahmed10/anas-systems-campus pnpm run build:pages` passed with a statically prerendered `/` route.

final result: passed
