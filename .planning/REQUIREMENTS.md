# APEX MEDIA CO — Requirements Specification

## 1. Functional Requirements

### 1.1 Landing / Home Page
- **Hero Section:**
  - Kinetic typography reveal (split/staggered mask reveal).
  - High-impact animated centerpiece (interactive 3D-styled glass prism / product showcase element with specular highlight).
  - Clear primary CTA ("Explore Collateral Kits") and secondary CTA ("Agency Capabilities").
  - Agency social proof ticker / partner marquee.
- **Bento-Grid Showcase:**
  - Asymmetric tiles highlighting Collateral Kits, Custom Production, Global Logistics, and Digital Brand Systems.
  - Interactive hover tilts and inner glowing borders.
- **Featured Kits Grid:**
  - Live data-bound product cards with quick-add to cart, category tags, price, and instant preview.
- **Live Metrics / Counter Section:**
  - Scroll-triggered animated stats counter (e.g. 140+ National Campaigns, 2.4M Branded Assets Delivered, 99.8% On-Time Deployment).
- **Testimonial & Case Study Carousel/Strip:**
  - Real client feedback quotes (VP of Brand, Creative Directors, CMOs).
- **Call-to-Action (CTA) Section:**
  - High-conversion agency collateral order banner with interactive specular glow.

### 1.2 Product Listing Page (PLP)
- Filterable by Category (Apparel, Event & Signage, VIP Kits, Digital Systems).
- Sortable by Price (Low to High, High to Low) and Popularity / Rating.
- Search input for real-time kit discovery.
- Realistic empty states when no items match active filters.
- Shimmer skeleton loading states while data resolves.

### 1.3 Product Detail Page (PDP)
- Dynamic route `/products/[id]`.
- Multi-angle visual gallery with thumbnail selector and zoom/active state.
- Variant selectors (Size, Kit Tier, Finishes) with active state indicators.
- Live stock availability badge (In Stock, Low Stock, or Sold Out).
- Animated Add to Cart with button state transitions (Idle → Adding → Added ✓) and cart drawer trigger.
- "What's Included in This Kit" breakdown section.
- Related products recommendation row.

### 1.4 Glassmorphic Shopping Cart Drawer
- Slide-over glassmorphic drawer (`backdrop-blur-xl`, semi-transparent obsidian scrim, specular border highlight).
- Real-time item count badge in top navigation.
- Quantity increment / decrement and animated remove-item actions.
- Running subtotal, estimated shipping, and calculated total with clean currency formatting (`$USD`).
- Empty cart state with "Browse Catalog" redirect button.
- Smooth transition to checkout flow.

### 1.5 Multi-Step Checkout Flow
- Step 1: Shipping & Agency Contact Information (Name, Company, Work Email, Address, City, State, Postal Code).
- Step 2: Shipping Method (Standard Agency Freight vs Priority White-Glove Courier).
- Step 3: Payment & PO Review (Purchase Order / Corporate Card simulation, Billing address, Order notes).
- Real-time client-side validation with inline error messages and green success checkmarks.
- Sticky glassmorphic order summary sidebar with items thumbnail list.
- Interactive "Place Order" button with loading spinner.
- Order Confirmation view with generated Mock Order ID (e.g. `APX-98214`), printable summary, and order timeline.

### 1.6 Navigation & Footer
- Fixed floating glass header with APEX logo, navigation links, search trigger, and cart toggle.
- Full animated mobile navigation overlay for small screens.
- Comprehensive footer with agency brand statement, quick links, legal/terms, contact info, and status indicator.
- Custom 404 page with return-home CTA.

## 2. Technical & Data Layer Requirements

### 2.1 Backend API Routes
- `GET /api/products` — Retrieve full product list with optional filtering query params.
- `GET /api/products/[id]` — Retrieve single product details with full variant data.
- `POST /api/orders` — Create new agency collateral order with validation and inventory verification.
- `POST /api/seed` — Seed or re-seed the product catalog with realistic agency merchandise kits.

### 2.2 Database Layer
- MongoDB via Mongoose connection.
- Schema definition:
  - `Product`: `name`, `slug`, `tagline`, `description`, `price`, `category`, `images`, `variants`, `features`, `stock`, `rating`, `featured`.
  - `Order`: `orderNumber`, `customer` (name, email, company, address), `items` (productId, name, price, quantity, variant), `subtotal`, `shipping`, `total`, `status`, `createdAt`.
- Zero-friction fallback: If `MONGODB_URI` is not present, auto-fallback to an in-memory/embedded persistent mock database so anyone can evaluate the project immediately with `npm run dev`.

## 3. Design System & Accessibility Requirements
- **Color Tokens:**
  - Base: `#0A0A0C` (Deep Obsidian), `#121217` (Surface Charcoal), `#1A1A22` (Card Surface)
  - Accent: `#2D68FF` (Electric Cobalt Blue), `#5A8BFF` (Cobalt Light), `#1A42AA` (Cobalt Deep)
  - Text: `#F5F5F7` (Primary High-Contrast), `#A1A1AA` (Muted), `#71717A` (Subtle)
- **Glass Tokens:**
  - Glass Panel: `background: rgba(18, 18, 23, 0.7)`, `backdrop-filter: blur(16px) saturate(180%)`, `border: 1px solid rgba(255, 255, 255, 0.08)`
  - Moving specular border highlight on active cards.
- **Accessibility:**
  - Contrast ratios meeting WCAG AA (4.5:1 for body text, 3:1 for large display text).
  - Explicit focus ring styles (`ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0A0A0C]`).
  - Screen reader friendly alt texts and ARIA attributes for modals and drawers.
  - `@media (prefers-reduced-motion)` overrides to disable heavy parallax/transforms.

## 4. Submission Deliverables
- `README.md` with:
  - Architecture overview & purpose
  - Technology justifications (why Next.js, why MongoDB)
  - Step-by-step setup guide
  - Testing & edge-case log
  - Retrospective ("What to improve with more time")
- Clean code architecture with TypeScript types, components, and hooks.
