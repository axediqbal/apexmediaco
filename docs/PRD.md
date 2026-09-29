# Product Requirements Document — APEX MEDIA CO Storefront
**Version 1.0 · 2026-09-29 · DecodeLabs Week 3 · Member 6**

## 1. Overview
APEX MEDIA CO is a working e-commerce storefront for a national marketing agency that sells
branded collateral kits to enterprise clients — executive apparel capsules, CNC-milled unboxing
vaults, keynote event systems, and digital brand-identity kits. The product lets CMOs, brand
directors, and event producers browse the catalog, configure kits, and place authorized orders
without a sales call.

## 2. Target users
| Persona | Needs |
|---|---|
| **CMO / Brand Director** | Quickly find and order on-brand collateral for campaigns and summits |
| **Event Producer** | Configure event systems (pylons, signage) with accurate specs and lead times |
| **Agency Ops (reviewer)** | Verify orders, stock states, and fulfillment data without setup friction |

## 3. Goals
1. A reviewer can complete browse → cart → checkout → confirmed order with zero configuration.
2. Every order is priced server-side from the catalog — client totals are never trusted.
3. The storefront meets professional agency standards for visual polish, SEO, and accessibility.

## 4. Functional requirements
- **FR-1 — Catalog browsing:** product listing with real-time search, category tabs
  (Apparel, Event & Signage, VIP Kits, Digital Systems), and sorting (featured, price ↑↓, rating).
- **FR-2 — Product detail:** gallery, variant matrix (size / colorway / finish), stock badge
  (In Stock / Low Stock / Waitlist), quantity controls with boundary clamping, "what's included"
  breakdown, and complementary recommendations.
- **FR-3 — Cart:** slide-over drawer with line-item quantity controls, animated removal, and a
  live financial summary (subtotal, insured freight, production tax, total).
- **FR-4 — Checkout (4 steps):** ① corporate shipping & contact with inline validation,
  ② logistics selection (Standard / Express / White-Glove), ③ payment method
  (Net-30 corporate invoice / corporate purchasing card), ④ authorized confirmation with an
  `APX-XXXXXX` order reference, fulfillment milestones, and receipt printing.
- **FR-5 — Order persistence:** orders are stored in MongoDB with server-computed totals and an
  immutable embedded snapshot of items, variants, and prices at purchase time.
- **FR-6 — Edge cases:** empty-cart checkout guard, out-of-stock → waitlist signup instead of a
  dead end, invalid input blocked with inline errors, tampered totals ignored.
- **FR-7 — Newsletter & waitlist:** validated, idempotent signup endpoints (re-subscribe returns
  200 without duplicates); footer newsletter form and sold-out product waitlist form.
- **FR-8 — Admin operations:** catalog re-seed and order reads are locked behind an admin key
  (`x-admin-key`), fail closed with 401, and are rate-limited.

## 5. Non-functional requirements
- **NFR-1 — Performance:** production build with optimized images (`next/image`); sub-second
  interactive catalog filtering on the client.
- **NFR-2 — SEO:** sitemap, robots, metadata, semantic HTML; checkout excluded from indexing.
- **NFR-3 — Accessibility:** keyboard-navigable, visible focus states, real form controls
  (fieldset/radio/label), WCAG AA contrast, `prefers-reduced-motion` respected.
- **NFR-4 — Reliability:** dual-mode data layer — MongoDB Atlas in production, seeded in-memory
  fallback with zero config for reviewers; no fake success states (the old fake-checkout
  fallback was removed).
- **NFR-5 — Security:** server-side repricing, input validation on all write endpoints,
  per-IP rate limits (10/min orders, 5/min seed/newsletter/waitlist).

## 6. Out of scope
Real payment-gateway capture (Stripe is the documented next step), customer accounts/login,
an admin dashboard UI, multi-currency, i18n, and live carrier shipping quotes.

## 7. Acceptance criteria
- [ ] Clone → `npm install` → `npm run dev` → full purchase flow works with no env vars.
- [ ] `npm run test:api` → 14/14 passing.
- [ ] Tampered order total is corrected server-side (verified live).
- [ ] Admin endpoints return 401 without a valid `x-admin-key`.
- [ ] Live deployment serves the catalog from MongoDB (`mode: "mongodb"`).

## 8. Success metrics
Task completion rate for the purchase flow, zero critical defects in the test pass,
Lighthouse-friendly performance on the production build, and a reviewer able to understand
the project from the README alone.
