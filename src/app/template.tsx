'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full flex-1 flex flex-col relative"
      >
        {/* Kinetic Glowing Cobalt Top Sweep Bar */}
        <motion.div
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#2D68FF] to-[#5A8BFF] origin-left z-50 shadow-[0_0_12px_#2D68FF] pointer-events-none"
        />

        {children}
      </motion.div>
    </AnimatePresence>
  );
}
