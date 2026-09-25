import React from 'react';

/**
 * @file template.tsx
 * @description Next.js App Router Template pass-through.
 * Layout-level AnimatePresence in RouteTransitionProvider handles full page exit/enter
 * transitions cleanly without conflicting double-nested mode="wait" animations.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
