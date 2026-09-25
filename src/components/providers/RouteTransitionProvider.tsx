'use client';

/**
 * @file RouteTransitionProvider.tsx
 * @description Direction-Aware Page Route Transitions with Framer Motion AnimatePresence
 * 
 * KIYA HORAHA HAI:
 * - Next.js App Router ke tamam page navigations (Landing → Products → Product Detail → Checkout)
 *   par direction-aware page slide + fade transitions implement karta hai.
 * - Forward navigation (e.g. Home to Products, Product to Checkout): Slide-left + Fade in.
 * - Back navigation (e.g. Checkout to Products, ya Browser Back button): Slide-right + Fade in.
 * - Frozen router context use karta hai taake outgoing page ka content exit animation ke doran
 *   suddenly disappear na ho.
 * - prefers-reduced-motion aur mobile screen dimensions ko detect karke transform distances
 *   aur animation costs ko automatically optimize karta hai.
 */

import React, { useContext, useRef, useEffect, useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// FrozenRoute retains the outgoing page subtree until AnimatePresence completes exit
function FrozenRoute({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext ?? {});
  const frozen = useRef(context).current;
  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

// Route depth mapping for forward/backward evaluation
function getRouteDepth(path: string): number {
  if (path === '/') return 0;
  if (path === '/products') return 1;
  if (path.startsWith('/products/')) return 2;
  if (path.startsWith('/checkout')) return 3;
  return 1;
}

export const RouteTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const prefersReduced = usePrefersReducedMotion();

  const prevPathRef = useRef<string>(pathname);
  const isPopStateRef = useRef<boolean>(false);
  const [direction, setDirection] = useState<number>(1);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect mobile device for lightweight animation distance
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen to browser popstate (Back/Forward button)
  useEffect(() => {
    const handlePopState = () => {
      isPopStateRef.current = true;
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Compute direction when pathname changes
  useEffect(() => {
    if (pathname === prevPathRef.current) return;

    const prevDepth = getRouteDepth(prevPathRef.current);
    const currDepth = getRouteDepth(pathname);

    let nextDir = 1;
    if (isPopStateRef.current) {
      // Browser back button was pressed
      nextDir = -1;
      isPopStateRef.current = false;
    } else if (currDepth < prevDepth) {
      nextDir = -1;
    } else {
      nextDir = 1;
    }

    setDirection(nextDir);
    prevPathRef.current = pathname;

    // Scroll to top on page navigation smoothly
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  // Animation variants
  const variants: Variants = useMemo(() => {
    if (prefersReduced) {
      return {
        enter: { opacity: 0 },
        center: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      };
    }

    const slideDistance = isMobile ? 24 : 50;

    return {
      enter: (dir: number) => ({
        x: dir > 0 ? slideDistance : -slideDistance,
        opacity: 0,
      }),
      center: {
        x: 0,
        opacity: 1,
        transition: {
          x: { type: 'spring', damping: 28, stiffness: 220 },
          opacity: { duration: isMobile ? 0.28 : 0.35, ease: [0.16, 1, 0.3, 1] as const },
        },
      },
      exit: (dir: number) => ({
        x: dir > 0 ? -slideDistance : slideDistance,
        opacity: 0,
        transition: {
          x: { duration: isMobile ? 0.2 : 0.26, ease: [0.16, 1, 0.3, 1] as const },
          opacity: { duration: isMobile ? 0.18 : 0.22, ease: [0.16, 1, 0.3, 1] as const },
        },
      }),
    };
  }, [prefersReduced, isMobile]);

  return (
    <div className="relative w-full flex-1 flex flex-col overflow-x-hidden">
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={pathname}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="flex-1 w-full flex flex-col will-change-[transform,opacity]"
        >
          <FrozenRoute>
            {children}
          </FrozenRoute>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RouteTransitionProvider;
