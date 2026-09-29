# Mandatory Video Script — Week 3 Walkthrough (5–10 min)
Record your screen, narrate in your own voice, keep it calm and professional.
Webcam optional. Aim: show you genuinely understand your own build.

## 0:00–0:45 — Intro (show the live site homepage)
- "This is APEX MEDIA CO, my Week 3 individual build — a full e-commerce storefront for a
  national marketing agency, selling branded collateral kits to enterprise clients."
- One line on scope: product listing, cart, and a client-side checkout flow, backed by MongoDB.

## 0:45–2:30 — Product listing & detail (show /products, then a product page)
- Search, category tabs, sorting — all live against the API.
- Open a product: variant matrix (size/colorway/finish), stock states, quantity controls.
- Mention: out-of-stock items show "Waitlist Only" instead of breaking.

## 2:30–4:00 — Cart & checkout (add items, open the cart drawer, go to /checkout)
- Cart drawer: quantity controls, live financial summary.
- Walk the 4 checkout steps: shipping → logistics → payment method → confirmation.
- Show the confirmation screen with the APX order ID.

## 4:00–6:00 — The tool: MongoDB (show MongoDB Atlas or the code)
- "My primary Week 3 tool is MongoDB via Mongoose."
- Why documents over tables: kits have different attribute shapes (apparel vs digital vs event
  systems); order line items are embedded so pricing snapshots stay immutable.
- Show the dual-mode data layer: works with Atlas in production, falls back to a seeded
  in-memory store with zero config for reviewers.

## 6:00–8:00 — Problems I solved (show TESTING.md / terminal)
- "I ran a security review and found real issues:" open admin endpoints → locked with
  `x-admin-key`; client-sent totals trusted → server now re-prices every order from the catalog.
- Demo the tamper story: "I sent total: 1 and the server returned the correct price."
- The seed 401 mystery: "It turned out to be a typo in the Vercel env var name — DMIN_API_KEY
  instead of ADMIN_API_KEY. Renamed it, redeployed, re-seed worked."
- `npm run test:api` — 14/14 passing. Show it running if time allows.

## 8:00–9:00 — Docs & close (show README, CHANGELOG)
- Scope statement, testing evidence, changelog, and the summary doc are all in the repo.
- "With more time I'd add a real payment gateway and an admin dashboard — the order model
  already supports it since pricing is server-side and immutable."
- Close: repo link + live URL on screen.

## Tips
- Do one dry run first; keep each section tight.
- If something fails live during recording, narrate the fallback calmly — then re-record that bit.
- Speak in your own words; the points above are a guide, not a script to read verbatim.
