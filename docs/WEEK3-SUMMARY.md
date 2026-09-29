# Week 3 Deliverable Summary — APEX MEDIA CO
**Full E-Commerce Storefront with Cart & Checkout Flow · National Marketing Agency · Member 6**

## What I built and why
APEX MEDIA CO is a working e-commerce storefront for a national marketing agency selling branded
collateral kits to enterprise clients. I chose this scope because it is real client-style work:
a catalog with search/filter/sort, product detail pages with variant configuration, a sliding cart
with a live financial summary, and a four-step client-side checkout ending in an authorized order
confirmation. Unlike a mockup, every flow is functional end-to-end against a real database.

## Tools and techniques
Next.js 16 + React 19 + TypeScript for a unified full-stack app; Tailwind CSS v4 with OKLCH design
tokens; Framer Motion/GSAP/Lenis for motion; and **MongoDB (Mongoose) as the primary data tool** —
chosen because collateral kits have polymorphic schemas (apparel sizes vs. digital licenses vs.
event-system specs) that fit documents better than rigid relational tables, and because embedding
line items inside the Order document gives immutable order snapshots. A dual-mode data layer falls
back to a seeded in-memory store so the app runs with zero configuration.

## What I tested and found
`npm run test:api` — 14/14 assertions passing, covering admin-key fail-closed behavior,
server-side repricing, input validation, idempotency, and rate limits. A live tamper test proved
the server ignores client-sent totals. The security review found and fixed real issues: open admin
endpoints, trusted client totals, a fake checkout fallback, and missing rate limits (full list in
`docs/TESTING.md`). Manual edge cases — empty cart, out-of-stock, invalid forms, offline mode —
are all handled.

## What I would improve with more time
Integrate a real payment gateway (e.g. Stripe) with webhook-verified capture, replacing the
current corporate PO / purchasing-card method selection, and add an authenticated admin dashboard
for order fulfillment. The data model already supports this: orders are server-priced and
immutable, so payment can attach without restructuring.

**Live:** https://apexmediaco.vercel.app · **Repo:** https://github.com/axediqbal/apexmediaco
