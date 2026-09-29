# Scope Statement — APEX MEDIA CO Storefront
**Week 3 · DecodeLabs Internship · Member 6 (individual build)**

## Client context
APEX MEDIA CO is a national marketing agency that sells branded collateral to enterprise clients —
executive apparel capsules, CNC-milled unboxing vaults, keynote event systems, and digital brand
identity kits. The agency needed a direct-to-enterprise storefront where CMOs, brand directors, and
event producers can browse the collateral catalog, configure kits, and place authorized orders
without a sales call.

## In scope
- Product listing page with real-time search, category filters, and multi-tier sorting
- Product detail pages with variant matrix (size / colorway / finish), stock states, and quantity controls
- Sliding cart drawer with line-item controls and live financial summary
- Multi-step client-side checkout: corporate shipping → logistics selection → payment method
  (Net-30 PO / corporate purchasing card) → authorized order confirmation with order ID
- MongoDB persistence (Mongoose) for products, orders, newsletter, and waitlist — with a
  zero-config in-memory fallback so reviewers can run it without a database
- Server-side order repricing (client totals are never trusted), admin-key locked seed/orders
  read endpoints, and per-IP rate limits on write endpoints
- SEO fundamentals (sitemap, robots, metadata, semantic HTML), accessibility (keyboard focus,
  real radio/fieldset controls, AA contrast), and responsive mobile layout
- Automated API integration tests (`npm run test:api`) and a documented manual test pass

## Out of scope (deliberate)
- Real payment gateway processing — checkout authorizes via corporate PO / purchasing-card
  method selection; no live card capture (a real gateway is the documented next step)
- Customer accounts / login and an admin dashboard
- Multi-currency, i18n, and real-time shipping carrier quotes

## Success criteria
A reviewer can clone the repo, run `npm run dev` with zero setup, browse the catalog, add kits
to the cart, complete checkout, and see the order persisted — or hit the live deployment and do
the same against MongoDB Atlas. Every required Week 3 feature works; every documented edge case
(empty cart, out-of-stock, invalid input, tampered totals) is handled.
