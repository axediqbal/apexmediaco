# APEX MEDIA CO — Execution Roadmap

This roadmap breaks down the construction of the APEX MEDIA CO e-commerce storefront into 9 sequential, verified phases.

---

### Phase 1: Project Setup & Data Modeling
- **Goal:** Initialize Next.js project with TypeScript, Tailwind CSS, Lucide icons, Framer Motion, and GSAP. Establish the MongoDB/Mongoose schemas and seed script.
- **Tasks:**
  - Initialize Next.js App Router project.
  - Install dependencies (`gsap`, `framer-motion`, `lucide-react`, `mongoose`, `clsx`, `tailwind-merge`).
  - Configure TypeScript and path aliases (`@/*`).
  - Implement Product and Order Mongoose schemas.
  - Create database connection utility with automatic in-memory fallback.
  - Create seed script with realistic collateral kit items.
- **Verification:** Database seeds successfully and API routes respond with mock/real data.

---

### Phase 2: Design Tokens & Glassmorphism System
- **Goal:** Build the custom design system: OKLCH/Obsidian dark palette, Electric Cobalt Blue accent, typography scale, custom shadows, and Glassmorphism 2.0 primitives.
- **Tasks:**
  - Configure `tailwind.config.ts` with custom color scales, container metrics, and glow effects.
  - Configure `globals.css` with fluid clamp typography, noise overlay, glassmorphism utilities, and focus-visible rings.
  - Build reusable UI primitives: `GlassCard`, `Button`, `Badge`, `Input`, `Container`, `Skeleton`.
  - Add `prefers-reduced-motion` safety hooks.
- **Verification:** Visual verification of token classes and UI components in isolated test/preview state.

---

### Phase 3: Global Layout & Landing Page
- **Goal:** Construct the flagship agency landing page with hero kinetic headline, interactive 3D centerpiece, Bento-grid showcase, live metrics counter, and testimonials.
- **Tasks:**
  - Build floating glass header (`Navbar`) with animated mobile drawer and cart counter.
  - Build Hero section with kinetic split-text entrance and animated glass centerpiece with specular highlight.
  - Build Bento Grid services & capabilities showcase with tilt/glow effects.
  - Build Featured Collateral Kits grid with quick-actions.
  - Build animated live stats counter on scroll (GSAP ScrollTrigger).
  - Build Client Testimonial & Case Study strip.
  - Build conversion-oriented CTA section and comprehensive agency Footer.
- **Verification:** Smooth scroll performance, no layout shifts, responsive across viewport sizes.

---

### Phase 4: Product Listing & Detail Pages
- **Goal:** Develop the full catalog exploration experience with live filtering, sorting, search, and the interactive product detail view.
- **Tasks:**
  - Build `/products` catalog page with category tabs, price range filters, search, and sort dropdown.
  - Implement loading skeleton cards and empty filter state.
  - Build dynamic `/products/[id]` page with image gallery thumbnails.
  - Implement variant pickers (sizes, tiers, package finishes).
  - Implement stock status indicator and interactive "What's in the Kit" breakdown.
  - Add related kits recommendation carousel.
- **Verification:** Filter and search update the product list accurately without reloads; PDP loads correct product parameters.

---

### Phase 5: Shopping Cart Drawer & State Management
- **Goal:** Build the sliding glassmorphic shopping cart with persistent client state and fluid motion transitions.
- **Tasks:**
  - Create cart state context (add, update quantity, remove, clear, persistent in `localStorage`).
  - Build slide-over glass drawer with backdrop blur and specular border.
  - Implement quantity adjustment buttons with bounds checking.
  - Implement animated item removal (exit animation via Motion).
  - Display currency-formatted subtotal, shipping calculation, and taxes.
  - Empty cart state with link to catalog.
- **Verification:** Adding from Home or PDP increments cart count badge; drawer opens smoothly; quantities recalculate totals accurately.

---

### Phase 6: Multi-Step Checkout Flow
- **Goal:** Implement the client-side checkout experience with step navigation, validation, order summary, and simulated confirmation.
- **Tasks:**
  - Build `/checkout` multi-step layout with progress tracker.
  - Step 1: Shipping and Contact details form with real-time validation.
  - Step 2: Delivery speed and white-glove logistics selection.
  - Step 3: Purchase order / Corporate payment method simulation.
  - Sticky glassmorphic order review sidebar.
  - API submission to `/api/orders` and simulated order placement state.
  - Order confirmation screen with generated APEX Order ID, itemized breakdown, and print option.
- **Verification:** Submitting with empty/invalid fields displays inline errors; successful submit clears cart and displays confirmation view.

---

### Phase 7: Backend API Wiring & Data Resilience
- **Goal:** Wire all client pages to real Next.js API endpoints (`/api/products`, `/api/products/[id]`, `/api/orders`) with dual MongoDB / Fallback data handling.
- **Tasks:**
  - Implement Next.js App Router handlers in `app/api/products/route.ts` and `app/api/products/[id]/route.ts`.
  - Implement `app/api/orders/route.ts` to validate payload and save orders.
  - Implement auto-seeding endpoint `/api/seed` for instant reset.
  - Verify error handling for 404s, invalid IDs, and database outages.
- **Verification:** API test requests return structured JSON responses; frontend gracefully handles network latency.

---

### Phase 8: Polish, Responsive Design & Edge-Case Audit
- **Goal:** Eliminate all dead links, test out-of-stock items, empty cart checkout attempts, keyboard navigation, and mobile viewports.
- **Tasks:**
  - Implement custom 404 page (`app/not-found.tsx`).
  - Configure favicon, metadata, and Open Graph tags.
  - Audit all buttons and navigation links across desktop and mobile.
  - Test out-of-stock product state (disabled add-to-cart button and badge).
  - Verify keyboard focus states (`outline`/`ring`) on all interactive controls.
  - Audit mobile navigation drawer and mobile cart drawer blur limits (capped 8-16px).
- **Verification:** Zero console errors; 100% responsive without horizontal overflow; accessibility pass.

---

### Phase 9: Documentation & Deliverables Packaging
- **Goal:** Write comprehensive project documentation for internship evaluation.
- **Tasks:**
  - Write `README.md` with executive summary, tech stack justifications (Next.js + MongoDB), architecture diagrams, and setup instructions.
  - Write pre-build Scope Statement.
  - Write Testing & Edge-Case Log (what broke, how it was resolved).
  - Document "What to improve with more time" (e.g. Stripe webhook integration, 3D Canvas Spline model, admin analytics dashboard).
- **Verification:** Documentation is clear, professional, well-formatted, and completely standalone.
