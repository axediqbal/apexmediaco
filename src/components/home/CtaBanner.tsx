'use client';

/**
 * @file CtaBanner.tsx
 * @description High-Impact Agency CTA Banner with Specular Glow & Motion
 * 
 * KIYA HORAHA HAI:
 * - Page ke bottom par conversion CTA banner display karta hai.
 * - Online order aur direct Purchase Order checkout options provide karta hai.
 * 
 * KESE HORAHA HAI:
 * - Framer Motion ke spring zoom aur vertical slide animation ke sath scroll reveal hota hai.
 * - Ambient radial glow pulse karta hai taake dark theme men futuristic neon depth create ho.
 */

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export const CtaBanner: React.FC = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <Container size="xl">
        <div
          data-gsap-card="true"
          className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-[#12121A] via-[#101018] to-[#0A0A0C] border border-[#2D68FF]/30 shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(45,104,255,0.2)] overflow-hidden"
        >
          {/* Moving Specular Highlight & Radial Glow */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.12, 0.22, 0.12],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2D68FF]/15 blur-[120px] rounded-full pointer-events-none"
          />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5A8BFF]/40 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D68FF]/15 border border-[#2D68FF]/40 text-xs font-mono text-[#5A8BFF]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Priority Campaign Allocation • 2026 Season</span>
            </div>

            <h2 className="text-display-title text-[#F5F5F8]">
              READY TO ELEVATE YOUR BRAND'S PHYSICAL ARTIFACTS?
            </h2>

            <p className="text-sm sm:text-base text-[#A1A1B0] leading-relaxed">
              Order verified collateral kits directly from our curated inventory or collaborate with an APEX production architect for custom aerospace-grade kitting.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/products">
                <Button
                  variant="primary"
                  size="lg"
                  className="shadow-[0_0_30px_rgba(45,104,255,0.45)] hover:shadow-[0_0_45px_rgba(45,104,255,0.6)] transition-all"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Order Collateral Online
                </Button>
              </Link>

              <Link href="/checkout">
                <Button
                  variant="secondary"
                  size="lg"
                >
                  Direct Agency PO Checkout
                </Button>
              </Link>
            </div>

            <div className="pt-6 border-t border-white/[0.08] flex items-center gap-6 text-xs text-[#71717A]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Pre-Approved Net-30 Terms for Fortune 500</span>
              </div>
              <span className="text-white/20">•</span>
              <div>
                <span>Standard 72-Hour Rapid Fulfillment</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CtaBanner;
