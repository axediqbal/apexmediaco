# Backend Schema — APEX MEDIA CO (MongoDB / Mongoose)
**Version 1.0 · 2026-09-29 · Source: `src/models/` + `src/types/`**

Five collections. Subdocuments are embedded (no `_id`) for immutable snapshots.
All models serialize with `id` (string) instead of `_id` and strip `__v`.

## 1. `products`
Catalog items. Polymorphic attributes (apparel sizes vs. digital licenses vs. event specs)
live in `variants` + `specs` maps — the reason a document model was chosen over relational tables.

| Field | Type | Constraints |
|---|---|---|
| `name` | String | required, trimmed |
| `slug` | String | required, **unique, indexed** |
| `tagline` / `description` | String | required |
| `price` | Number | required, min 0, indexed |
| `category` | String | required, indexed, enum: `Apparel` · `Event & Signage` · `VIP Kits` · `Digital Systems` |
| `images` | String[] | required |
| `variants` | [{ id, name, options[] }] | embedded, no `_id` |
| `features` | String[] | — |
| `stock` | Number | required, default 0, min 0 |
| `rating` / `reviewsCount` | Number | defaults 5 / 0 |
| `featured` | Boolean | default false, indexed |
| `badge` | String | optional (e.g. "Executive Tier") |
| `sku` | String | required, **unique, indexed** (e.g. `APX-APP-001`) |
| `leadTime` | String | default `"3-5 Business Days"` |
| `specs` | Map<String,String> | flexible key/value specs |
| `createdAt` / `updatedAt` | Date | timestamps |

**Indexes:** `slug` (unique), `sku` (unique), `category`, `price`, `featured`,
text index on `name` + `tagline` + `description` (keyword search).

## 2. `orders`
Created by `POST /api/orders`. **Totals are re-priced server-side from the catalog** —
client-sent totals are ignored. Items embed a full snapshot (name, price, variants, image)
so later catalog edits can't rewrite history.

| Field | Type | Constraints |
|---|---|---|
| `orderNumber` | String | required, **unique, indexed** (e.g. `APX-545125`) |
| `customer` | embedded | firstName, lastName, companyName, workEmail (indexed, lowercase), phone, address, suite?, city, state, postalCode, country (default `"United States"`), deliveryInstructions? |
| `items` | embedded[] | productId, productName, quantity (min 1), **price (min 0)**, image, selectedVariants (Map) |
| `subtotal` / `shipping` / `tax` / `total` | Number | required, min 0 — all server-computed |
| `shippingMethod` | String | enum: `standard` · `express` · `white-glove`, default `standard` |
| `paymentMethod` | String | enum: `invoice` (Net-30 PO) · `corporate-card`, default `invoice` |
| `status` | String | enum: `Processing` · `Production` · `Dispatched` · `Delivered`, default `Processing`, indexed |
| `notes` | String | optional |
| `createdAt` / `updatedAt` | Date | timestamps |

**Indexes:** `orderNumber` (unique), `status`, `customer.workEmail`,
compound `(customer.workEmail, createdAt desc)` for order-history queries.

## 3. `carts`
Server-side session carts (the client drawer mirrors this via CartContext).

| Field | Type | Constraints |
|---|---|---|
| `sessionId` | String | required, **unique, indexed** |
| `items` | embedded[] | productId, productName, price (min 0), image, quantity (min 1, default 1), selectedVariants (Map) |
| `subtotal` | Number | auto-computed by `pre('save')` hook |
| `itemCount` | Number | auto-computed by `pre('save')` hook |
| `createdAt` / `updatedAt` | Date | timestamps |

## 4. `newslettersubscribers`
| Field | Type | Constraints |
|---|---|---|
| `email` | String | required, trimmed, lowercase, **unique, indexed** |
| `createdAt` | Date | timestamps (no `updatedAt`) |

Idempotent subscribe: re-subscribing an existing email returns 200 without duplicating.

## 5. `waitlistentries`
One spot per email per product.

| Field | Type | Constraints |
|---|---|---|
| `productId` | String | required, indexed |
| `productName` | String | required |
| `email` | String | required, trimmed, lowercase |
| `name` | String | optional, trimmed |
| `createdAt` | Date | timestamps (no `updatedAt`) |

**Index:** compound `(productId, email)` **unique** — enforces one waitlist spot per email/product.

## 6. Data-layer notes
- **Dual mode:** `MONGODB_URI` set → Mongoose; otherwise a seeded in-memory store with
  identical semantics (zero-config reviewer experience).
- **Order immutability:** embedded item snapshots + server pricing = tamper-proof history.
- **No cross-collection joins:** reads are single-collection by design (catalog by slug,
  orders by orderNumber/email); the document model keeps hot paths join-free.
