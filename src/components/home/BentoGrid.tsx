'use client';

/**
 * @file BentoGrid.tsx
 * @description APEX Bento Grid Capabilities Section
 * 
 * KIYA HORAHA HAI:
 * - Agency capabilities ko modular Bento-Grid layout men present karta hai.
 * - Hardware specifications, aerospace fabrication, digital sync, aur multi-hub logistics show karta hai.
 * 
 * KESE HORAHA HAI:
 * - Framer Motion ke `containerVariants` aur `tileVariants` use karke viewport scroll-reveal stagger animation di gayi hai.
 * - `whileInView` aur `viewport={{ once: true, margin: '-60px' }}` trigger hota hai jab user scroll karta hai, smooth spring physics ke sath har tile cascade hoti hai.
 * - Har tile ko `GlassCard` ke 1px perimeter lighting border aur micro hover physics ke sath style kiya gaya hai.
 */

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Layers, ShieldCheck, Cpu, Truck, Sparkles, ArrowRight, Box } from 'lucide-react';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const tileVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export const BentoGrid: React.FC = () => {
  return (
    <section id="capabilities" className="py-20 md:py-32 relative">
      <Container size="xl">
        {/* Section Header with Fluid Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D68FF]/10 border border-[#2D68FF]/30 text-xs font-mono text-[#5A8BFF]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Agency Capabilities</span>
            </div>
            <h2 className="text-display-title text-[#F8F9FD]">
              MODULAR BENTO ARCHITECTURE.
            </h2>
            <p className="text-sm sm:text-base text-[#9FA5B9] max-w-xl">
              Every collateral kit engineered by APEX is backed by industrial manufacturing standards, digital sync, and multi-hub logistics.
            </p>
          </div>

          <Link
            href="/products"
            className="text-sm font-semibold text-[#5A8BFF] hover:text-white flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Collateral Specifications</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Bento Grid Layout with Cascading Stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {/* Tile 1: Large Span (Col-span 2, Row-span 2) */}
          <motion.div variants={tileVariants} className="md:col-span-2 lg:col-span-2">
            <GlassCard className="h-full p-8 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2D68FF]/15 border border-[#2D68FF]/30 flex items-center justify-center text-[#5A8BFF] shadow-[0_0_20px_rgba(45,104,255,0.3)]">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#69708A]">
                  Material Craftsmanship
                </span>
                <h3 className="text-2xl font-bold text-[#F8F9FD] font-display">
                  Precision Techwear & Aerospace Milling
                </h3>
                <p className="text-sm text-[#9FA5B9] leading-relaxed">
                  We engineer merchandise using 10,000mm hydrostatic weatherproof membranes, 450GSM organic French terry, and CNC waterjet-milled 6061-T6 aluminum. Every piece reflects the caliber of a top-tier national agency.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.08] grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-lg font-bold text-[#F8F9FD] block font-mono">10K</span>
                  <span className="text-[10px] text-[#69708A] uppercase font-mono">Stormproof</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-lg font-bold text-[#5A8BFF] block font-mono">0.05mm</span>
                  <span className="text-[10px] text-[#69708A] uppercase font-mono">Tolerance</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-lg font-bold text-white block font-mono">100%</span>
                  <span className="text-[10px] text-[#69708A] uppercase font-mono">Organic Fibers</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Tile 2: Event & Stage Systems (Col-span 1) */}
          <motion.div variants={tileVariants} className="col-span-1">
            <GlassCard className="h-full p-8 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2D68FF]/15 border border-[#2D68FF]/30 flex items-center justify-center text-[#5A8BFF] shadow-[0_0_20px_rgba(45,104,255,0.25)]">
                  <Box className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#69708A]">
                  Keynote Infrastructure
                </span>
                <h3 className="text-xl font-bold text-[#F8F9FD] font-display">
                  15-Minute Modular Stage Systems
                </h3>
                <p className="text-xs text-[#9FA5B9] leading-relaxed">
                  Turnkey monolithic tension-fabric LED pylons with military-grade wheeled transit flight trunks.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.08]">
                <span className="text-xs font-mono text-[#5A8BFF] flex items-center gap-1">
                  Airline Luggage Certified <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </GlassCard>
          </motion.div>

          {/* Tile 3: Digital-Physical Synchronization (Col-span 1) */}
          <motion.div variants={tileVariants} className="col-span-1">
            <GlassCard className="h-full p-8 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2D68FF]/15 border border-[#2D68FF]/30 flex items-center justify-center text-[#5A8BFF] shadow-[0_0_20px_rgba(45,104,255,0.25)]">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#69708A]">
                  System Fidelity
                </span>
                <h3 className="text-xl font-bold text-[#F8F9FD] font-display">
                  Figma Token & NFC Integration
                </h3>
                <p className="text-xs text-[#9FA5B9] leading-relaxed">
                  Synchronize PMS Pantone color codes directly with client design tokens, accompanied by tap-to-verify smart NFC tags.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.08]">
                <span className="text-xs font-mono text-[#5A8BFF] flex items-center gap-1">
                  Zero Hex Deviation <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </GlassCard>
          </motion.div>

          {/* Tile 4: 72-Hour Rapid Logistics (Col-span 2) */}
          <motion.div variants={tileVariants} className="md:col-span-2 lg:col-span-2">
            <GlassCard id="logistics" className="h-full p-8 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2D68FF]/15 border border-[#2D68FF]/30 flex items-center justify-center text-[#5A8BFF] shadow-[0_0_20px_rgba(45,104,255,0.25)]">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#69708A]">
                  Fulfillment Logistics
                </span>
                <h3 className="text-2xl font-bold text-[#F8F9FD] font-display">
                  72-Hour White-Glove Venue Delivery
                </h3>
                <p className="text-sm text-[#9FA5B9] leading-relaxed">
                  Operating out of 3 regional logistics hubs (New York, Austin, San Francisco). We deliver directly to conference green rooms, hotel holding suites, or global remote teams with real-time temperature and location telemetry.
                </p>

                {/* Logistics Photography Window */}
                <div className="relative aspect-[16/7] rounded-xl overflow-hidden my-3 border border-white/[0.08] group/img">
                  <img
                    src="/images/logistics/terminal-night.jpg"
                    alt="APEX National Logistics Hub at Night"
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-transparent to-transparent opacity-70" />
                  <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono text-[#F8F9FD] bg-black/70 px-2 py-0.5 rounded backdrop-blur-md border border-white/10">
                      NYC Metro Hub • Direct Intermodal Connection
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center gap-6 text-xs text-[#69708A]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#5A8BFF] shadow-[0_0_8px_#2D68FF]" />
                  <span className="text-[#F8F9FD]">NYC Hub: Live</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#5A8BFF] shadow-[0_0_8px_#2D68FF]" />
                  <span className="text-[#F8F9FD]">Austin Hub: Live</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#5A8BFF] shadow-[0_0_8px_#2D68FF]" />
                  <span className="text-[#F8F9FD]">SF Hub: Live</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Tile 5: Enterprise Security & White-Label NDA (Col-span 2) */}
          <motion.div variants={tileVariants} className="md:col-span-2 lg:col-span-2">
            <GlassCard className="h-full p-8 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2D68FF]/15 border border-[#2D68FF]/30 flex items-center justify-center text-[#5A8BFF] shadow-[0_0_20px_rgba(45,104,255,0.3)]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#69708A]">
                  Enterprise Security
                </span>
                <h3 className="text-2xl font-bold text-[#F8F9FD] font-display">
                  Strict White-Label & Confidential NDA
                </h3>
                <p className="text-sm text-[#9FA5B9] leading-relaxed">
                  Unreleased product launches and confidential brand guidelines remain completely guarded. Our production facility features biometric access controls, clean-room kitting, and strict embargo compliance.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-mono text-[#5A8BFF]">
                  SOC2 Type II Certified Facility
                </span>
                <span className="text-xs text-[#69708A]">
                  Net-30 Corporate Terms Available
                </span>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

export default BentoGrid;
