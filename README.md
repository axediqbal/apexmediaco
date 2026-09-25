# APEX MEDIA CO — Brand Commerce Platform

> **A portfolio-grade e-commerce storefront engineered for a premier national creative agency selling branded collateral kits, executive apparel capsules, and keynote event systems to enterprise clients.**

![APEX MEDIA CO](https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1400&q=80)

---

## 1. Scope Statement & Intent

### 1.1 Project Purpose
Traditional promotional merchandise platforms suffer from low-contrast generic themes, sluggish multi-page reloads, template styling, and low perceived value. **APEX MEDIA CO** demonstrates an agency-grade direct-to-enterprise storefront. It allows CMOs, brand directors, and event producers to configure and acquire high-impact physical and digital collateral kits (such as weatherproof executive softshells, CNC-milled aluminum unboxing vaults, modular backlit keynote pylons, and Figma-synchronized digital systems) with white-glove logistics.

### 1.2 Non-Negotiable Design Direction
- **Dark-Mode-First Foundation:** Deep obsidian/charcoal `#0A0A0C` (`oklch(0.12 0.01 260)`) with layered radial ambient lighting.
- **Electric Cobalt Accent:** `#2D68FF` (`oklch(0.58 0.24 260)`) applied with high intentionality for sharp agency contrast.
- **Glassmorphism 2.0:** Frosted surfaces with 16–24px backdrop blur, 160–190% saturation, subtle noise texture, moving specular highlights on hero elements, and WCAG AA contrast scrims.
- **Bento-Grid Modular Architecture:** Asymmetrical spans, varied row/col layouts, and rich whitespace.
- **Kinetic Micro-Interactions:** Interactive 3D tilt centerpiece with live material switchers, spring drawer transitions, and full keyboard focus visibility.

---

## 2. Architecture & Technology Stack

| Layer | Technology | Rationale & Architectural Choice |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** + **React 19** + **TypeScript** | Unified full-stack architecture combining server components, streaming routes, zero-CORS internal API routes, and instant builds with Turbopack. |
| **Styling & Tokens** | **Tailwind CSS v4** + **Custom OKLCH Tokens** | Precise mathematical color curves (`oklch`), custom radius rhythm (`8px`, `14px`, `22px`, `32px`), and customized elevation shadows. |
| **Motion & Micro-interactions** | **Lenis Smooth Scroll** + **Framer Motion** + **GSAP** + **Canvas Physics** | Buttery smooth momentum scrolling, interactive hardware-accelerated particle constellation with cursor attraction, magnetic spring buttons, cursor spotlight border glows, and celebratory confetti. Full `prefers-reduced-motion` compliance. |
| **Database & Data Layer** | **MongoDB (Mongoose ODM)** with **Zero-Config Resilient In-Memory Fallback** | Flexible document modeling for nested product variants, customizable specifications, and complex order logs with zero reviewer setup friction (detailed below). |
| **Icons & Typography** | **Lucide React** + **Space Grotesk** + **Inter** | Punchy geometric headline typography paired with ultra-clean modern body type and sharp line iconography. |

---

## 3. Database Rationale: Why MongoDB?

For the APEX MEDIA CO collateral platform, **MongoDB** was selected over PostgreSQL for the following concrete architectural reasons:

1. **Polymorphic Collateral Schemas:** Physical merchandise kits (e.g. *Obsidian Softshell* with sizing, fabric weight, and water-resistance metrics) have vastly different attribute shapes than digital bundles (e.g. *Brand Identity System* with Figma component licenses and video resolutions) or event systems (e.g. *Keynote Pylons* with illumination temperatures and flight-case specs). MongoDB’s flexible document model natively accommodates varied variant matrices without requiring dozens of sparse relational join tables.
2. **Atomic Order Snapshots:** When an enterprise client places a collateral order, the pricing, variant options, and package specifications must be immutably recorded at the moment of authorization. Embedding the complete `items` array directly inside the `Order` document preserves the historical transaction integrity without risking retroactive catalog mutations.
3. **Seamless Reviewer Experience:** The application implements a dual-mode data layer:
   - When a `MONGODB_URI` environment variable is provided (local or MongoDB Atlas), Mongoose connects automatically.
   - When running offline or in an unconfigured test environment, the data layer automatically switches to a high-fidelity in-memory store pre-seeded with realistic APEX collateral kits. Reviewers can clone the repo and immediately run `npm run dev` with zero setup blockers.

---

## 4. Pages & User Flows Implemented

```
apex-media-co/
├── Global Transition & Scroll Layer
│   ├── Lenis Inertia Momentum Smooth Scrolling (touch and wheel normalized)
│   ├── Cinematic Route Transitions (src/app/template.tsx) with Glowing Cobalt Progress Sweep
│   └── Dynamic Cursor Spotlight Border Glow on frosted glass panels
│
├── / (Home / Landing)
│   ├── Floating Glassmorphic Header with Live Cart Badge
│   ├── Interactive Hardware-Accelerated Particle Constellation Background
│   ├── Kinetic Typography Headline + Ambient Backlight
│   ├── Magnetic CTA Buttons (Spring gravity toward cursor)
│   ├── Interactive 3D Hero Centerpiece (Live Tab Switcher & Specular Highlight)
│   ├── Partner Trust Ticker (Hyperion, Nexus, Aether, etc.)
│   ├── Bento-Grid Modular Capabilities Showcase
│   ├── Flagship Collateral Kits Grid with Instant Add & Quick Spec Inspection
│   ├── Scroll-Triggered Animated Stats Counters (140+ Campaigns, 99.8% On-Time)
│   ├── Client Testimonials & Summit Case Studies
│   ├── High-Conversion Closing CTA Banner
│   └── Multi-Column Agency Footer with Live Operational Hub Status
│
├── Inline Quick-Spec Inspection Drawer
│   ├── Instant Glassmorphic Slide-In Drawer from Catalog & Featured Grids
│   ├── Full Bill of Materials, Engineering Tolerances, and Certifications
│   └── Instant Quick-Add to Cart without leaving current browsing context
│   └── Multi-Column Agency Footer with Live Operational Hub Status
│
├── /products (Collateral Catalog)
│   ├── Real-Time Search Query Filter
│   ├── Category Tabs (All, Apparel, Event & Signage, VIP Kits, Digital Systems)
│   ├── Multi-Tier Sorting (Featured, Price Low-to-High, Price High-to-Low, Rating)
│   ├── Shimmer Skeleton Loading & Filter Reset State
│   └── Out-of-Stock Edge Case Handling (Waitlist pill & disabled state)
│
├── /products/[id] (Product Detail Page)
│   ├── Multi-Angle Gallery with Thumbnail Selector
│   ├── Dynamic Variant Matrix (Size, Colorway, Finishes)
│   ├── Real-Time Stock Status Badge (In Stock vs Low Stock vs Waitlist)
│   ├── Quantity Controls (+ / -) with Boundary Clamping
│   ├── Animated Add-to-Cart Feedback (Idle → Adding → Added ✓)
│   ├── "What's Included in This Kit" Bulleted Breakdown
│   └── Complementary Collateral Recommendations Row
│
├── Sliding Cart Drawer
│   ├── Slide-over Glassmorphic Panel (blur 24px, saturate 190%)
│   ├── Line-Item Quantity Controllers & Animated Removal
│   ├── Live Financial Summary (Subtotal, Insured Freight, Production Tax, Total)
│   └── Direct Link to Multi-Step Checkout
│
├── /checkout (Enterprise Checkout Flow)
│   ├── Step 1: Corporate Shipping & Contact Coordinates (with real-time inline validation)
│   ├── Step 2: White-Glove Logistics Selection (Standard vs 72h Keynote Courier)
│   ├── Step 3: Payment Method (Net-30 Corporate PO vs Corporate Purchasing Card)
│   ├── Sticky Order Summary Review Sidebar
│   └── Step 4: Authorized Order Confirmation (Order ID e.g. APX-200336, fulfillment milestones, print receipt, confetti)
│
└── /_not-found (Custom 404 Specification Route)
```

---

## 5. Testing & Edge-Case Log

| Scenario / Test Case | What Was Tested | What Broke / What Was Found | Resolution / Fix Applied |
| :--- | :--- | :--- | :--- |
| **npm Project Naming** | Initializing Next.js in folder `week 3` | `create-next-app` rejected the folder name due to space character in URL compliance rules. | Scaffolded in `apex-media-co` directory and relocated cleanly to workspace root. |
| **TypeScript Strict Checking** | Compiling Mongoose virtual JSON transforms | TS2790 error: `The operand of a 'delete' operator must be optional` when deleting `ret._id` and `ret.__v`. | Explicitly cast `ret` parameter as `Record<string, any>` in both `Product.ts` and `Order.ts`. |
| **Out-of-Stock Kit Handling** | Item `prod_monolith_desk_kit` configured with `stock: 0` | Need to prevent users from adding unavailable kits to the cart. | Rendered "Waitlist Only" amber badge, disabled the quick-add and PDP add buttons, and displayed "Allocation Exhausted" modal scrim. |
| **Empty Cart Checkout Guard** | Direct navigation to `/checkout` with 0 items | Need to prevent submitting empty orders or orphaned PO submissions. | Added guard view in `CheckoutFlow` that displays "Cannot Proceed with Empty Cart" and offers a one-click redirect to `/products`. |
| **Form Validation Safety** | Submitting Step 1 with missing contact coordinates | Form should not advance with invalid data. | Implemented real-time validation for email regex, missing company name, and postal codes with inline error messages and visual alert icons. |
| **API Order Processing** | Submitting mock order via `POST /api/orders` | Verified schema validation, order number generation (`APX-XXXXXX`), and status assignment. | Successfully returned HTTP 201 with generated order number and persistence in store. |

---

## 6. What to Improve with More Time

1. **Three.js / WebGL Custom Canvas Mesh:** While the current interactive 3D centerpiece leverages CSS 3D perspective transforms with mouse-tracking specular highlights, incorporating a dedicated Three.js/Spline interactive 3D model of the aluminum vault with open/close gestures would elevate the centerpiece even further.
2. **Stripe Webhook & Invoicing Engine:** Connect real Stripe Corporate Card payments and automated PDF invoice generation dispatched via SendGrid.
3. **Enterprise Client Portal:** Build an authenticated dashboard (`/portal`) where corporate brand managers can view past shipments, track pallet telemetry in real-time, and download tax receipts.

---

## 7. Local Development & Quick Start

### Prerequisites
- Node.js 18+ (tested on Node v20+)
- npm or pnpm

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

### Production Build
```bash
npm run build
npm run start
```
