# Technical Requirements Document — APEX MEDIA CO Storefront
**Version 1.0 · 2026-09-29 · DecodeLabs Week 3 · Member 6**

## 1. Architecture
Unified full-stack app on **Next.js 16 (App Router)** — server components and API routes in one
deployment, no CORS, no separate backend service. Client state (cart) lives in a React context;
all persistence goes through internal `/api/*` routes backed by MongoDB (Mongoose) with a
seeded in-memory fallback when `MONGODB_URI` is absent.

## 2. Tech stack
| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 + React 19 + TypeScript (strict) | App Router, server components, Turbopack builds |
| Styling | Tailwind CSS v4, custom OKLCH tokens | Mathematical color curves, radius rhythm |
| Motion | Framer Motion, GSAP, Lenis, canvas particles | Hardware-accelerated, `prefers-reduced-motion` compliant |
| Database | MongoDB via Mongoose 9 (Atlas in prod) | Polymorphic product schemas; embedded immutable order snapshots |
| Images | `next/image` | Optimized, responsive delivery |
| Validation | Inline + API-level | Real-time checkout validation; server rejects bad input with 400 |

## 3. API contract
| Route | Method | Auth | Rate limit | Purpose |
|---|---|---|---|---|
| `/api/products` | GET | — | — | Catalog (search, category, sort) |
| `/api/products/[id]` | GET | — | — | Single product by slug/ID |
| `/api/orders` | POST | — | 10/min/IP | Create order — **re-prices from catalog** |
| `/api/orders` | GET | `x-admin-key` | — | Read orders (401 without key) |
| `/api/orders/[id]` | GET | `x-admin-key` | — | Single order (401 without key) |
| `/api/cart` | GET/POST | — | — | Session cart |
| `/api/seed` | POST | `x-admin-key` | 5/min/IP | Re-seed catalog (`?force=true` to overwrite) |
| `/api/newsletter` | POST | — | 5/min/IP | Subscribe — validated, idempotent |
| `/api/waitlist` | POST | — | 5/min/IP | Join waitlist — validated, idempotent |

Error model: `400` validation, `401` missing/invalid admin key, `404` unknown resource, `429`
rate-limited. All write endpoints validate email format, item existence, and quantity bounds.

## 4. Data layer
`src/lib/dataStore.ts` implements the dual-mode strategy: if `MONGODB_URI` is set and reachable,
Mongoose connects; otherwise a high-fidelity in-memory store (pre-seeded with the 8-product
catalog) serves identical CRUD semantics. Models live in `src/models/` (see
[`BACKEND-SCHEMA.md`](BACKEND-SCHEMA.md)). TypeScript interfaces in `src/types/` are the single
source of truth shared by client, API, and models.

## 5. Security requirements
- **SR-1:** Order totals are computed server-side from the catalog; client-sent totals ignored.
- **SR-2:** Seed and order-read endpoints require `x-admin-key = ADMIN_API_KEY`, fail closed (401).
- **SR-3:** No secrets in client bundles; admin key lives only in server env vars.
- **SR-4:** Rate limits on all write endpoints (see §3).
- **SR-5:** No fake success paths — checkout only confirms against a real API response.

## 6. Performance & SEO
`next/image` for all product imagery, static generation where possible, sitemap.xml +
robots.txt (checkout disallowed), page metadata, semantic HTML.

## 7. Deployment
Vercel (production). Required env vars: `MONGODB_URI`, `ADMIN_API_KEY`.
Build: `npm run build` · Type-check: `npx tsc --noEmit` · Tests: `npm run test:api` (14/14).

## 8. Testing strategy
Automated API integration suite (`scripts/api-tests.mjs`) boots a production build and asserts
auth, pricing integrity, validation, idempotency, and rate limits. Manual pass covers empty-cart
guard, out-of-stock waitlist, form validation, and offline fallback. Full evidence:
[`TESTING.md`](TESTING.md).
