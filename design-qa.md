# Portfolio Design QA

## Canonical campus architecture

| Destination | Portfolio content |
| --- | --- |
| Deer Computer Repairs Workshop | Origin story and About |
| Self-Serve Copy Building | Android print, payment, deployment, and monitoring work |
| Connected Vehicle App Garage | Connected-vehicle companion app platform work |
| Scanner Automation Depot | Mobile scanner automation and testing |
| TabTally Receipt Café | TabTally product case study |
| Maker & Game Lab | 3D printing and Godot experiments |

The 3D campus is the only spatial portfolio view. The recruiter route is a compact, text-first summary derived from the same destination data.

## Content checks

- Removed Split.It and replaced it with the verified TabTally product.
- Kept Yardscape as additional work rather than a featured campus destination.
- Framed robotics as a future direction.
- Used the user-confirmed age, bank-mandated terminal update, and zero vendor-technician rollout cost.
- Removed unsupported adoption, staffing, revenue, and store-count claims.
- Rewrote copy to use concrete actions, systems, and outcomes instead of generic positioning language.

## Interaction and accessibility checks

- Keyboard navigation reaches the campus, map destinations, dialogs, recruiter lenses, and resume links.
- Closing a destination dialog restores focus to the destination that opened it.
- Every 3D landmark has a visible desktop label and an accessible button name.
- The mobile and tablet map provides the destination labels when scene labels are hidden to prevent clipping.
- Reduced-motion preferences collapse animation duration.
- A WebGL runtime failure switches to the complete 2D destination list.

## Responsive and route checks

Checked at 390 x 844, 768 x 1024, 1280 x 720, and 1440 x 900:

- `/`
- `/campus`
- `/recruiter`
- `/products`
- `/products/tabtally`

No broken images or application console errors were found. The only console notices were dependency deprecation warnings from Three.js.

## Build checks

- ESLint: passes with existing `next/no-img-element` warnings on product pages.
- TypeScript: passes.
- Production build: passes.
- Test script: passes.
- Static Pages export: passes.
