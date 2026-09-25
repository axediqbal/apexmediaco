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
        initial={{ opacity: 0, y: 20, scale: 0.99, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -16, scale: 0.99, filter: 'blur(8px)' }}
        transition={{
          duration: 0.45,
          ease: [0.16, 1, 0.3, 1], // Luxury cubic bezier spring
        }}
        className="w-full flex-1 flex flex-col relative"
      >
        {/* Kinetic Cobalt Shutter Blade Sweep */}
        <motion.div
          key={`sweep-${pathname}`}
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }}
          transition={{ duration: 0.7, times: [0, 0.6, 1], ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#2D68FF] to-[#94B3FF] origin-left z-50 shadow-[0_0_20px_#2D68FF,0_0_40px_rgba(45,104,255,0.6)] pointer-events-none"
        />

        {children}
      </motion.div>
    </AnimatePresence>
  );
}
