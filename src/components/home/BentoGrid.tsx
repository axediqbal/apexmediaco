'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, ShieldCheck, Cpu, Truck, Sparkles, ArrowRight, Box } from 'lucide-react';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';

export const BentoGrid: React.FC = () => {
  return (
    <section id="capabilities" className="py-20 md:py-32 relative">
      <Container size="xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
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
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Tile 1: Large Span (Col-span 2, Row-span 2) */}
          <GlassCard className="md:col-span-2 lg:col-span-2 p-8 flex flex-col justify-between group">
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

          {/* Tile 2: Event & Stage Systems (Col-span 1) */}
          <GlassCard className="p-8 flex flex-col justify-between group">
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

          {/* Tile 3: Digital-Physical Synchronization (Col-span 1) */}
          <GlassCard className="p-8 flex flex-col justify-between group">
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

          {/* Tile 4: 72-Hour Rapid Logistics (Col-span 2) */}
          <GlassCard id="logistics" className="md:col-span-2 lg:col-span-2 p-8 flex flex-col justify-between group">
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

          {/* Tile 5: Enterprise Security & White-Label NDA (Col-span 2) */}
          <GlassCard className="md:col-span-2 lg:col-span-2 p-8 flex flex-col justify-between group">
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
        </div>
      </Container>
    </section>
  );
};

export default BentoGrid;
