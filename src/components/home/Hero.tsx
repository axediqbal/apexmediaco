'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, ChevronDown } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import HeroCenterpiece from './HeroCenterpiece';
import PartnerMarquee from './PartnerMarquee';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[400px] bg-[#2D68FF]/10 blur-[140px] pointer-events-none rounded-full" />

      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Kinetic Typography & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10 space-y-6">
            {/* Top Micro Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181822]/90 border border-[#2D68FF]/30 text-xs font-mono text-[#5A8BFF] shadow-[0_0_20px_rgba(45,104,255,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-[#2D68FF]" />
              <span>APEX National Brand Commerce Platform</span>
            </div>

            {/* Kinetic Display Headline */}
            <h1 className="text-display-hero text-[#F5F5F8]">
              ENGINEERED <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#94B3FF] to-[#2D68FF]">
                COLLATERAL
              </span> <br />
              FOR LEADERS.
            </h1>

            {/* Subtitle with contrast safety */}
            <p className="text-base sm:text-lg text-[#A1A1B0] max-w-xl font-normal leading-relaxed">
              We replace cheap throwaway promotional swag with precision-fabricated executive apparel kits, modular keynote event systems, and aerospace-grade client onboarding vaults.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <Link href="/products" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto shadow-[0_0_35px_rgba(45,104,255,0.45)]"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Collateral Kits
                </Button>
              </Link>

              <a href="#capabilities" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Agency Capabilities
                </Button>
              </a>
            </div>

            {/* Enterprise Trust Indicators */}
            <div className="pt-6 border-t border-white/[0.08] flex items-center gap-6 text-xs text-[#71717A] w-full">
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
            </div>
          </div>

          {/* Right Column: Interactive 3D Centerpiece */}
          <div className="lg:col-span-6 w-full z-10">
            <HeroCenterpiece />
          </div>
        </div>
      </Container>

      {/* Partner Ticker Strip */}
      <div className="mt-16 sm:mt-24">
        <PartnerMarquee />
      </div>
    </section>
  );
};

export default Hero;
