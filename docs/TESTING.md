# Testing Evidence — APEX MEDIA CO

## Automated API integration tests
`npm run test:api` boots a production build on a local port and runs **14 assertions** covering
the security-critical behaviors. Result: **14/14 passing.**

| # | Assertion | Result |
|---|-----------|--------|
| 1–3 | `GET /api/orders`, `GET /api/seed`, `POST /api/seed` without `x-admin-key` → **401** (fail closed) | PASS |
| 4–5 | `POST /api/orders` with tampered `total: 1` → server **re-prices from catalog**, ignores client total | PASS |
| 6–8 | Validation: missing items, unknown product ID, quantity ≤ 0 → **400** | PASS |
| 9–10 | Email validation on newsletter/waitlist endpoints → **400** on bad input | PASS |
| 11–12 | Newsletter + waitlist idempotency: re-subscribe returns 200, no duplicate document | PASS |
| 13–14 | Rate limiting: burst writes throttled per IP (orders 10/min, seed 5/min) | PASS |

## Live tamper test (production, 2026-09-28)
Sent an order with `total: 1` to the live API. Server re-priced from the catalog and returned
the correct total ($2,652); order `APX-545125` was created with server-computed pricing.
Client totals are never trusted.

## Manual / edge-case test pass
- **Empty-cart checkout guard:** direct navigation to `/checkout` with an empty cart renders an
  empty-state screen with a return button — no broken flow.
- **Out-of-stock handling:** `stock: 0` products render a "Waitlist Only" badge, disable add-to-cart,
  and offer the waitlist form instead.
- **Form validation:** checkout steps validate inline in real time; incomplete submissions are blocked.
- **In-memory fallback:** with no `MONGODB_URI`, the app boots the seeded in-memory store and the
  full flow works offline — verified by running the suite without env vars.
- **Seed idempotency:** `POST /api/seed` without `?force=true` refuses to overwrite; force re-seed
  returned 8 products in `mongodb` mode (2026-09-29).

## Issues found and fixed
| Issue | Found by | Fix |
|-------|----------|-----|
| Order totals trusted from the client (price tampering possible) | Security review | Server re-prices every order from the catalog; client totals ignored |
| `/api/orders` (GET) and `/api/seed` publicly accessible | Security review | Locked behind `x-admin-key` (`ADMIN_API_KEY`), fail closed with 401 |
| Fake checkout fallback masked real failures | Security review | Removed entirely; checkout only succeeds against a real API response |
| No rate limiting on write endpoints | Security review | 10/min orders, 5/min seed + newsletter/waitlist, per IP |
| Seed returned 401 despite correct key | Live debugging | Root cause: Vercel env var typo'd as `DMIN_API_KEY`; renamed to `ADMIN_API_KEY` + redeploy |
| Nested `<Link><Button>` markup, fake radio controls | a11y audit | Real `<fieldset>`/radio/label controls with focus rings; exported shared `buttonClassNames` |
| Generic stock photography on products | Visual review | Replaced with on-brand local product images (`/images/products/…`) |
| Dishonest "SOC2" footer label | Copy review | Replaced with an honest Security link |
| `/checkout` listed in sitemap | SEO review | Removed (robots-disallowed route) |
