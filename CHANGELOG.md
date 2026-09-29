# Changelog — APEX MEDIA CO

## 2026-09-29
- `fix(product)` — On-brand local image for the Monolith Executive Desk Collateral Set.
- Docs — Added Week 3 submission pack: `docs/SCOPE.md`, `docs/TESTING.md`, `docs/WEEK3-SUMMARY.md`,
  `docs/VIDEO-SCRIPT.md`, and this changelog.

## 2026-09-28
- **MongoDB Atlas goes live** — cluster created, `MONGODB_URI` + `ADMIN_API_KEY` set as Vercel
  production env vars; `/api/products` confirmed serving in `mongodb` mode.
- `fix(security)` — Locked `GET /api/orders` and `GET/POST /api/seed` behind `x-admin-key`
  (fail closed, 401); removed the fake checkout fallback; added rate limits
  (10/min orders, 5/min seed).
- `fix(security)` — `POST /api/orders` re-prices from the catalog; client-sent totals ignored.
  Verified live: tampered `total: 1` → server returned the correct $2,652.
- `feat(web)` — SEO pass: robots.txt, sitemap.xml, `/privacy`, `/terms`; metadata URL fixed;
  17 `<img>` migrated to `next/image`; footer SOC2 label replaced with an honest Security link.
- Recommendations pass — a11y: real fieldset/radio/label controls with focus rings, no nested
  link/button markup; spacing rhythm tightened; `POST /api/newsletter` + `POST /api/waitlist`
  added (validation, 5/min/IP, idempotent); footer newsletter + sold-out waitlist forms wired;
  `scripts/api-tests.mjs` added — 14/14 passing.
- Theme polish — infinite partner marquee, tighter section rhythm, on-brand product photography,
  card/header/CTA refinements.
- Fixed seed 401s: root cause was a Vercel env-var typo (`DMIN_API_KEY`); renamed to
  `ADMIN_API_KEY`, redeployed, force re-seed succeeded (8 products, 3 with new local images).

## 2026-09-25
- `feat(3d)` — Calibrated photorealistic imperial-gold hero materials from museum reference.
