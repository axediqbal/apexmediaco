'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass } from 'lucide-react';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="py-24 md:py-36 relative flex items-center justify-center">
      <Container size="sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <GlassCard className="p-10 sm:p-14 text-center space-y-6" glow>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-3xl bg-[#2D68FF]/15 border border-[#2D68FF]/30 text-[#5A8BFF] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(45,104,255,0.3)]"
            >
              <Compass className="w-10 h-10" />
            </motion.div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2D68FF]">
                404 — Specification Coordinates Not Found
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5F8] font-display">
                COLLATERAL OUT OF BOUNDS
              </h1>
              <p className="text-sm text-[#A1A1B0] max-w-sm mx-auto leading-relaxed">
                The requested agency resource, collateral manifest, or product specification does not exist in our active deployment index.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link href="/">
                <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Return to Headquarters
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline">
                  Browse Active Catalog
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </Container>
    </div>
  );
}
