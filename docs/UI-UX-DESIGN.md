# UI/UX Design Document — APEX MEDIA CO Storefront
**Version 1.0 · 2026-09-29 · DecodeLabs Week 3 · Member 6**

## 1. Design intent
A dark, agency-grade storefront that feels like a premium brand deck — not a generic template.
One mood (midnight obsidian), one accent (electric cobalt), one type pairing, one signature
motif (glassmorphic bento grids + kinetic light) applied consistently on every screen.

## 2. Design system
| Token | Value | Usage |
|---|---|---|
| Surface | `#0A0A0C` obsidian (`oklch(0.12 0.01 260)`) | Page background, layered radial ambient light |
| Accent | `#2D68FF` electric cobalt (`oklch(0.58 0.24 260)`) | CTAs, focus rings, active states — used sparingly |
| Type | Space Grotesk (display) + Inter (body) | Geometric headlines, clean body copy |
| Radius | 8 / 14 / 22 / 32 px rhythm | Chips → cards → drawers → hero panels |
| Elevation | Frosted glass: 16–24px blur, 160–190% saturation, noise texture | Drawers, cards, navbar |

**Motion:** Lenis smooth scroll, spring drawer transitions, magnetic buttons, cursor spotlight
on glass panels, particle constellation hero. All motion disabled under
`prefers-reduced-motion`.

## 3. Information architecture
```
/            → hero, trust marquee, bento capabilities, flagship kits, stats, testimonials, CTA
/products    → search + category tabs + sorting + skeleton loading + filter reset
/products/[id] → gallery, variant matrix, stock badge, quantity, add-to-cart, recommendations
/checkout    → 4-step flow (shipping → logistics → payment → confirmation) + order summary sidebar
/privacy, /terms → legal pages
```

## 4. Key screens & interactions
- **Home:** floating glass navbar with live cart badge; kinetic headline; interactive 3D
  centerpiece with material switcher; infinite partner marquee; bento capabilities grid;
  flagship kits with instant add + quick-spec drawer; animated stat counters; testimonials.
- **Catalog:** real-time search filters as you type; category tabs; 4 sort modes; shimmer
  skeletons while loading; empty-filter state with one-click reset.
- **Product detail:** thumbnail gallery; variant selectors (size/colorway/finish) as real
  radio controls; stock badge (In Stock / Low Stock / Waitlist Only); quantity stepper with
  min/max clamping; add-to-cart button with Idle → Adding → Added feedback.
- **Cart drawer:** slides in from the right; line items with quantity steppers and animated
  removal; live subtotal + insured freight + production tax + total; CTA into checkout.
- **Checkout:** stepper with inline validation per step (invalid fields block progress);
  logistics as radio cards (Standard / Express / White-Glove); payment as Net-30 invoice vs
  corporate card; sticky order summary; confirmation screen with `APX-XXXXXX` reference,
  fulfillment milestones, print receipt, and confetti.
- **States:** empty cart → guarded checkout screen with return CTA; `stock: 0` → waitlist
  pill + disabled purchase + waitlist form; network/API failure → honest error, never a fake
  success.

## 5. Accessibility
Semantic landmarks; visible keyboard focus on all interactive elements; real
`<fieldset>`/`<legend>` radio groups with labels; AA contrast (scrims over imagery);
`prefers-reduced-motion` disables particles, springs, and marquee.

## 6. Responsive behavior
Desktop: multi-column bento grids, side-by-side detail layout, drawer cart.
Mobile: stacked layouts, horizontally scrollable filter chips, full-bleed drawer sheet,
44px touch targets on coarse pointers.

## 7. UX principles applied
1. **No dead ends** — every empty/error state offers the next action.
2. **Honest commerce** — prices always server-computed; stock states truthful; no fake badges.
3. **Progressive disclosure** — quick-spec drawer for details without leaving the catalog.
4. **Forgiving forms** — inline validation, clear error copy, no data loss between steps.
