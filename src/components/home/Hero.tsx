'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import MagneticButton from '@/components/ui/MagneticButton';
import HeroCenterpiece from './HeroCenterpiece';
import PartnerMarquee from './PartnerMarquee';
import ParticleConstellation from '@/components/canvas/ParticleConstellation';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Interactive Hardware-Accelerated Particle Constellation */}
      <ParticleConstellation className="opacity-75" />

      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[400px] bg-[#2D68FF]/10 blur-[140px] pointer-events-none rounded-full" />

      <Container size="xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Kinetic Typography & Magnetic CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10 space-y-6">
            {/* Top Micro Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181822]/90 border border-[#2D68FF]/30 text-xs font-mono text-[#5A8BFF] shadow-[0_0_20px_rgba(45,104,255,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2D68FF]" />
              <span>APEX National Brand Commerce Platform</span>
            </motion.div>

            {/* Kinetic Display Headline with staggered word mask reveal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-display-hero text-[#F5F5F8]"
            >
              ENGINEERED <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#94B3FF] to-[#2D68FF]">
                COLLATERAL
              </span> <br />
              FOR LEADERS.
            </motion.h1>

            {/* Subtitle with contrast safety */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-[#A1A1B0] max-w-xl font-normal leading-relaxed"
            >
              We replace cheap throwaway promotional swag with precision-fabricated executive apparel kits, modular keynote event systems, and aerospace-grade client onboarding vaults.
            </motion.p>

            {/* Action Buttons with Magnetic Physics */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto"
            >
              <MagneticButton strength={0.25} className="w-full sm:w-auto">
                <Link href="/products" className="w-full sm:w-auto block">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto shadow-[0_0_35px_rgba(45,104,255,0.45)]"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Explore Collateral Kits
                  </Button>
                </Link>
              </MagneticButton>

              <MagneticButton strength={0.18} className="w-full sm:w-auto">
                <a href="#capabilities" className="w-full sm:w-auto block">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Agency Capabilities
                  </Button>
                </a>
              </MagneticButton>
            </motion.div>

            {/* Enterprise Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 border-t border-white/[0.08] flex items-center gap-6 text-xs text-[#71717A] w-full"
            >
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#5A8BFF]" />
                <span>NDA & White-Label Protected</span>
              </div>
              <span className="text-white/20">•</span>
              <div>
                <span>Standard Net-30 Invoicing</span>
              </div>
              <span className="text-white/20 hidden sm:inline">•</span>
              <div className="hidden sm:block">
                <span>Nationwide Express Logistics</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive 3D Centerpiece */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 w-full z-10"
          >
            <HeroCenterpiece />
          </motion.div>
        </div>
      </Container>

      {/* Partner Ticker Strip */}
      <div className="mt-16 sm:mt-24 relative z-10">
        <PartnerMarquee />
      </div>
    </section>
  );
};

export default Hero;
