# Campus Claymation Art Direction

This document defines the visual language for the Enterprise Systems Campus. Use it for new landmarks, props, characters, materials, lighting, camera work, screenshots, and visual QA.

## Source of truth

The canonical reference is [the published campus preview](https://anasahmed10.github.io/campus/campus-preview.webp), committed locally as `public/campus/campus-preview.webp`.

The target is a handcrafted claymation tabletop diorama: warm, tactile, slightly imperfect, compact, friendly, and professionally composed. It should feel as though an expert model maker shaped and painted every object by hand, then photographed the miniature on a softly lit studio set.

The reference is art direction, not a pixel-exact layout mandate. The live campus may adapt its camera and interface for interaction and responsive viewports, but its world, objects, and materials should remain recognizably from the same visual universe.

## Defining characteristics

### Material

- Surfaces are matte modeling clay with soft, broad highlights and high roughness.
- Subtle fingerprints, kneading marks, shallow dents, pigment variation, and pressed seams should be visible at useful viewing distance.
- Texture should be irregular and organic, never a uniform procedural noise layer or evenly repeated ribbing.
- Edges are rounded, compressed, and slightly asymmetrical. Parts appear pressed together rather than manufactured to perfect tolerances.
- Small rotations, uneven thickness, and gentle silhouette wobble sell the handmade construction.
- Glass, screens, water, paper, and tires may remain smoother to create readable material contrast.

### Shape language

- Use chunky, simplified forms with clear silhouettes and a compact miniature scale.
- Buildings are soft rectangular clay shells with deep openings and oversized, legible signature props.
- Props communicate each project immediately: printer and payment terminal, connected car, scanner and conveyor, receipt and cup, 3D printer, or repair tools.
- Detail is selective. Prefer one strong story-bearing prop over many tiny realistic parts.
- Trees, bushes, flowers, rocks, clouds, and terrain use clustered, hand-pinched forms rather than mathematical primitives left visibly untouched.
- Avoid razor-sharp edges, paper-thin pieces, perfect bevels, and intricate mechanical realism.

### Color

- Use a cheerful but earthy clay palette: coral, denim and cobalt blue, mint green, mustard yellow, lavender, warm cream, moss and olive green, and dark navy accents.
- Colors should look like pigmented clay rather than emissive digital swatches. Allow restrained tonal variation within a surface.
- Keep enough value contrast for doors, signs, controls, and focal props to read from the isometric camera.
- The warm cream path and central clearing visually organize the green island. Buildings remain distinct color anchors around it.
- Reserve very dark navy or charcoal for signage, hair, tires, and small grounding accents; avoid large areas of pure black.

### Lighting and rendering

- Light the campus like a miniature studio set: a warm, broad key light, a subtle cool fill or rim, soft ambient fill, and close contact shadows.
- Shadows should ground every model without becoming harsh, muddy, or cinematic.
- Use gentle ambient occlusion/contact darkening around pressed joins, doorways, feet, and props.
- Maintain a soft sky-blue backdrop and bright daytime mood.
- Favor an orthographic or low-perspective isometric presentation. Do not introduce wide-angle distortion, dramatic depth of field, bloom, neon glow, or moody night lighting unless the user explicitly changes the direction.
- Preserve real-time performance. Achieve richness through shared textures, instancing, restrained geometry deformation, and lighting—not expensive post-processing or unique high-resolution maps per object.

### Composition and scale

- The campus reads as one oval island with a looping path, a central explorer, and six distinct destinations around the perimeter.
- Maintain generous negative space between landmarks so their silhouettes and labels remain readable.
- Props are intentionally oversized relative to architecture; this is a storytelling miniature, not an architectural scale model.
- The explorer should feel like a clay figure belonging to the same set, with compact proportions, simple facial features, and a stable readable silhouette.
- Responsive camera changes may crop or reframe the island, but primary navigation targets and the explorer must remain understandable.

### Typography and interface

- In-world signs are physical clay plaques with raised or inset high-contrast lettering. They may be slightly irregular, but must remain readable.
- Application UI overlays remain crisp digital interface elements. Do not apply fake clay texture, wobble, or baked-in raster text to functional controls.
- Preserve accessible HTML labels for all in-world signage; visual lettering is not a substitute for semantic text.

## What this style is not

Do not drift toward:

- glossy vinyl, polished plastic, porcelain, rubber, or candy-like materials;
- faceted low-poly geometry or voxel/pixel art;
- photorealistic buildings, vegetation, or physically exact machinery;
- perfectly smooth primitives with a noise texture added as an afterthought;
- exaggerated grunge, cracks, dirt, scratches, or distressed surfaces;
- hyper-saturated neon colors, metallic sci-fi lighting, or dark cinematic scenes;
- flat vector illustration translated directly into 3D;
- excessive micro-detail that disappears at the campus camera distance;
- random deformation that damages silhouettes, signage, collisions, or prop recognition.

## Adding or revising a landmark

Before implementation, identify the landmark's single visual story and its signature prop. Match the existing building footprint, rounded shell language, plaque treatment, clay palette, and miniature scale. Reuse shared clay materials and deformation helpers where practical.

During implementation:

1. Establish a readable silhouette and color block at the normal campus camera distance.
2. Add the signature prop and doorway/interior contrast.
3. Apply restrained material variation and hand-shaped asymmetry.
4. Add pressed joins and contact shadowing so parts feel assembled from clay.
5. Confirm that decorative geometry does not alter navigation raycasts or collision bounds.
6. Check the result beside the canonical preview, not only in isolation.

## Visual QA checklist

Review at desktop and mobile sizes, including 1280x720, 768x1024, and 390x844 where practical.

- Does the first impression read as handcrafted claymation?
- Are the surfaces matte and tactile rather than glossy or digitally smooth?
- Are silhouette imperfections intentional and restrained?
- Can each landmark be recognized by shape, color, and signature prop without reading its label?
- Do repeated textures or deformations reveal obvious tiling, ribs, or procedural patterns?
- Are signs and functional UI legible with sufficient contrast?
- Do contact shadows ground the pieces without making the scene dirty or heavy?
- Do the explorer, vegetation, buildings, and props appear to belong to one physical miniature set?
- Does reduced motion preserve the composed diorama rather than removing essential visual information?
- Did the change preserve frame rate, input behavior, collision behavior, and fallback access?

When recording a major visual pass, add current comparison evidence to `design-qa.md`. Keep that file as historical QA; this document remains the durable art-direction standard.
