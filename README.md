# APEX MEDIA CO — Brand Commerce Platform

> **A portfolio-grade e-commerce storefront engineered for a premier national creative agency selling branded collateral kits, executive apparel capsules, and keynote event systems to enterprise clients.**

![APEX MEDIA CO Platform Banner](https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1400&q=80)

---

## 1. Executive Summary & Intent

### 1.1 Project Purpose
Traditional promotional merchandise platforms suffer from low-contrast generic themes, sluggish multi-page reloads, template styling, and low perceived value. **APEX MEDIA CO** demonstrates an agency-grade direct-to-enterprise storefront. It enables CMOs, brand directors, and event producers to configure and acquire high-impact physical and digital collateral kits (such as weatherproof executive softshells, CNC-milled aluminum unboxing vaults, modular backlit keynote pylons, and Figma-synchronized digital systems) with white-glove logistics.

### 1.2 Design Philosophy & Aesthetics
- **Dark-Mode-First Foundation:** Deep obsidian/charcoal `#0A0A0C` (`oklch(0.12 0.01 260)`) with layered radial ambient lighting.
- **Electric Cobalt Accent:** `#2D68FF` (`oklch(0.58 0.24 260)`) applied with high intentionality for sharp agency contrast.
- **Glassmorphism 2.0:** Frosted surfaces with 16–24px backdrop blur, 160–190% saturation, subtle noise texture, moving specular highlights on hero elements, and WCAG AA contrast scrims.
- **Bento-Grid Modular Architecture:** Asymmetrical spans, varied row/col layouts, and rich whitespace.
- **Kinetic Micro-Interactions:** Interactive 3D tilt centerpiece with live material switchers, spring drawer transitions, and full keyboard focus visibility.

---

## 2. Architecture & Technology Stack

| Layer | Technology | Architectural Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** + **React 19** + **TypeScript** | Unified full-stack architecture combining server components, streaming routes, zero-CORS internal API routes, and instant builds with Turbopack. |
| **Styling & Tokens** | **Tailwind CSS v4** + **Custom OKLCH Tokens** | Precise mathematical color curves (`oklch`), custom radius rhythm (`8px`, `14px`, `22px`, `32px`), and customized elevation shadows. |
| **Motion & Dynamics** | **Lenis Smooth Scroll** + **Framer Motion** + **GSAP** + **Canvas Physics** | Smooth momentum scrolling, interactive hardware-accelerated particle constellation with cursor repulsion, magnetic spring buttons, cursor spotlight border glows, and celebratory confetti. Full `prefers-reduced-motion` compliance. |
| **Database & Data Layer** | **MongoDB (Mongoose ODM)** with **Zero-Config Resilient In-Memory Fallback** | Flexible document modeling for nested product variants, customizable specifications, and complex order logs with zero reviewer setup friction. |
| **Icons & Typography** | **Lucide React** + **Space Grotesk** + **Inter** | Punchy geometric headline typography paired with ultra-clean modern body type and sharp line iconography. |

---

## 3. Database Architecture & Dual-Mode Fallback

For the APEX MEDIA CO collateral platform, **MongoDB** was selected over relational databases for concrete architectural reasons:

1. **Polymorphic Collateral Schemas:** Physical merchandise kits (e.g. *Obsidian Softshell* with sizing, fabric weight, and water-resistance metrics) have vastly different attribute shapes than digital bundles (e.g. *Brand Identity System* with Figma component licenses and video resolutions) or event systems (e.g. *Keynote Pylons* with illumination temperatures and flight-case specs). MongoDB’s flexible document model natively accommodates varied variant matrices without requiring dozens of sparse relational join tables.
2. **Atomic Order Snapshots:** When an enterprise client places a collateral order, the pricing, variant options, and package specifications must be immutably recorded at the moment of authorization. Embedding the complete `items` array directly inside the `Order` document preserves historical transaction integrity without risking retroactive catalog mutations.
3. **Seamless Zero-Config Reviewer Experience:** The application implements a dual-mode data layer:
   - When a `MONGODB_URI` environment variable is provided (local MongoDB or Atlas cluster), Mongoose connects automatically.
   - When running offline or in an unconfigured test environment, the data layer automatically switches to a high-fidelity in-memory store pre-seeded with realistic APEX collateral kits. Reviewers can clone the repo and immediately run `npm run dev` with zero setup blockers.

---

## 4. Pages & User Flows

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

## 5. API Endpoints Reference

| Route | Method | Description |
| :--- | :--- | :--- |
| `/api/products` | `GET` | Fetches full product catalog with category, search, and sort support. |
| `/api/products/[id]` | `GET` | Retrieves a single collateral item by slug or unique ID. |
| `/api/orders` | `POST` | Validates and creates a new authorized enterprise order with generated `APX-XXXXXX` reference. |
| `/api/seed` | `POST` | Re-seeds database with baseline luxury collateral catalog dataset. |

---

## 6. Directory Structure

```
├── public/
│   ├── images/
│   │   ├── agency/          # Creative lab & design sprint imagery
│   │   └── logistics/       # Port, fleet, and warehouse imagery
│   └── safe_vault.glb       # 3D binary asset for hero visualization
├── src/
│   ├── app/                 # Next.js App Router (pages, templates, layout, api)
│   ├── components/
│   │   ├── canvas/          # ParticleConstellation canvas animation
│   │   ├── cart/            # CartDrawer slide-over panel
│   │   ├── checkout/        # Multi-step enterprise checkout workflow
│   │   ├── home/            # Hero, 3D Centerpiece, BentoGrid, Stats, Testimonials
│   │   ├── layout/          # Navbar and Footer components
│   │   ├── products/        # Catalog, DetailView, QuickSpecDrawer
│   │   ├── providers/       # SmoothScroll, GsapScrollTrigger, RouteTransitions
│   │   └── ui/              # Reusable Button, GlassCard, Badge, Input, Skeleton
│   ├── context/             # CartContext state provider
│   ├── data/                # Initial seed dataset with high-fidelity kits
│   ├── hooks/               # Custom hooks (e.g. usePrefersReducedMotion)
│   ├── lib/                 # DataStore dual-mode persistence & db connection
│   ├── models/              # Mongoose schemas for Product & Order
│   └── types/               # TypeScript interfaces & domain models
├── package.json
├── tsconfig.json
└── README.md
```

---

## 7. Testing & Verification Summary

| Test Area | Validation Check | Result |
| :--- | :--- | :--- |
| **TypeScript Strict Checking** | `npx tsc --noEmit` | **0 Errors** — Fully type-safe models, props, and API handlers. |
| **Production Build** | `npm run build` | **0 Errors** — Turbopack compiled and SSG/Dynamic pages generated cleanly. |
| **Out-of-Stock Kit Handling** | Items with `stock: 0` | Rendered "Waitlist Only" badge, disabled checkout add, modal alert. |
| **Empty Cart Checkout Guard** | Direct navigation to `/checkout` | Displays empty cart warning screen with direct return button. |
| **Form Validation Safety** | Submitting incomplete PO forms | Real-time inline field validation prevents submission. |
| **In-Memory Fallback** | Operating without MongoDB URI | In-memory store automatically hydrates seed dataset with full CRUD. |

---

## 8. Environment Variables & Database Setup

The application features a resilient dual-mode data layer:

| Variable | Required | Description | Default / Fallback |
| :--- | :--- | :--- | :--- |
| `MONGODB_URI` | No | MongoDB connection string (Local or MongoDB Atlas) | If omitted or unreachable, automatically activates high-fidelity **in-memory fallback mode** with zero configuration required. |

To connect to a live MongoDB instance, create a `.env.local` file:
```bash
# .env.local
MONGODB_URI=mongodb://localhost:27017/apex-media-co
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/apex-media-co?retryWrites=true&w=majority
```

---

## 9. Local Development & Quick Start

### Prerequisites
- Node.js 18+ (tested on Node v20+)
- npm or pnpm

### Quick Start Commands
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

### Verification & Quality Checks
```bash
# Type-check TypeScript codebase
npx tsc --noEmit

# Lint code
npm run lint

# Build optimized production bundle
npm run build

# Start production server
npm run start
```
