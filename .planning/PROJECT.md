# APEX MEDIA CO — Brand Commerce Platform

## Executive Summary
APEX MEDIA CO is a premier national creative and marketing agency specializing in high-impact brand acceleration. This platform is a portfolio-grade, dark-mode-first e-commerce storefront where APEX clients (enterprise brands, tech startups, and campaign partners) purchase branded merchandise, event collateral kits, executive apparel, and digital presentation systems.

## Vision & Design Direction
- **Base Theme:** Dark-mode-first with deep obsidian/charcoal foundations (`#0A0A0C` / `oklch(0.14 0.01 260)`).
- **Signature Accent:** Electric Cobalt Blue (`#2D68FF` / `oklch(0.58 0.24 260)`) used with surgical precision for high-contrast agency energy.
- **Glassmorphism 2.0:** Frosted glass surfaces with 12–20px backdrop blur, 160% saturation, subtle noise texture, moving specular highlights on hero elements, and WCAG AA contrast scrims.
- **Bento Grid Architecture:** Asymmetrical modular layouts, fluid spans, rich whitespace, soft radial gradient underglows.
- **Kinetic Motion:** GSAP & ScrollTrigger for choreographed scroll reveals and parallax; Motion (`framer-motion` / `motion/react`) for fluid layout transitions, drawer mechanics, and micro-interactions. Full `prefers-reduced-motion` compliance.
- **Typography:** Display typography for punchy headlines paired with ultra-clean modern sans text, styled with fluid `clamp()` sizing.

## Technology Stack
- **Framework:** Next.js (App Router, React 18/19, TypeScript)
- **Styling:** Tailwind CSS with custom design tokens (OKLCH palette, custom radii, custom elevation shadows, fluid spacing)
- **Animation & Micro-interactions:** GSAP 3 + ScrollTrigger + Framer Motion (`motion`) + Canvas/CSS Specular effects
- **Icons:** Lucide React
- **Data & Backend:** Next.js API Routes + MongoDB (Mongoose ODM) with resilient local/in-memory fallback store for instant zero-configuration reviewer execution
- **Validation & Forms:** Zod + React Hook Form (or custom resilient client validation with real-time feedback)

## Target Audience & Products
- **Target Audience:** CMOs, Brand Directors, Event Producers, Enterprise Partners.
- **Product Catalog (Collateral Kits):**
  1. *APEX Obsidian Executive Apparel Kit* (Tailored softshell, heavyweight bamboo tee, titanium pin)
  2. *Keynote Event Stage & Signage System* (Modular backlit banners, architectural badge lanyards, stage podium wrap)
  3. *VIP Client Onboarding Vault* (Anodized matte aluminum unboxing kit, NFC smart agency card, bespoke leather journal)
  4. *Brand Identity Guidelines & Presentation System* (Figma/Keynote master template, design tokens handbook, hardbound print spec)
  5. *Field Marketing & Activation Pod* (Pop-up acoustic booth, tension-fabric media wall, branded tech accessories)
  6. *Hyper-Growth Swag Capsule* (Custom heavyweight hoodies, matte ceramic drinkware, embroidered caps)

## Deliverables & Acceptance Criteria
- Complete multi-page storefront (Landing, Catalog, Detail, Drawer Cart, Multi-step Checkout, 404, Navigation & Footer).
- Fully functional API endpoints for products and orders.
- Zero dead links, zero dummy button states, comprehensive loading/empty/error states.
- Full keyboard accessibility and focus rings.
- README.md with architecture decisions, MongoDB rationale, testing log, and roadmap.
