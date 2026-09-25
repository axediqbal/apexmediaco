'use client';

/**
 * @file HeroCenterpiece.tsx
 * @description Interactive 3D Spatial Visual & Physical Kit Showcase Chamber
 * 
 * KIYA HORAHA HAI:
 * - APEX Hero section ke right column mein interactive 3D spatial monolith render karta hai.
 * - Dynamic import (lazy loading) ke through WebGL Three.js 3D visual ya Spline scene load karta hai.
 * - User physical kits (Vault, Apparel, Stage) aur 3D Spatial Monolith ke beech seamlessly toggle kar sakta hai.
 * - Mouse perspective tilt aur ambient specular lighting maintain karta hai.
 */

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ShieldCheck, Sparkles, Box, Layers, Zap, CheckCircle2, Rotate3d, Compass } from 'lucide-react';

// Lazy-loaded 3D Element with static poster fallback
const Hero3DVisual = dynamic(() => import('./Hero3DVisual'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl bg-[#090A0F] border border-white/[0.08] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#2D68FF]/30 border-t-[#2D68FF] animate-spin" />
        <span className="text-xs font-mono text-[#858B9E]">Loading 3D Spatial Core...</span>
      </div>
    </div>
  ),
});

export const HeroCenterpiece: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<'3d-core' | 'vault' | 'apparel' | 'stage'>('3d-core');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const activeKitData = {
    '3d-core': {
      name: 'APEX Spatial Core & 3D Monolith',
      subtitle: 'Aerospace-Grade Obsidian Geometry with Resonant Gyroscope',
      price: 'Custom Spec',
      badge: 'Interactive 3D Engine',
      leadTime: 'Realtime WebGL',
      metric: '60 FPS Hardware Render',
      image: '/images/agency/ai-creative-lab.jpg',
    },
    vault: {
      name: 'APEX VIP Onboarding Vault',
      subtitle: 'Aerospace Grade 6061-T6 Aluminum Unboxing Chamber',
      price: '$620 USD',
      badge: 'Bespoke Milled',
      leadTime: '4-6 Days',
      metric: '0.05mm CNC Precision',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80',
    },
    apparel: {
      name: 'Obsidian Executive Softshell',
      subtitle: '3-Layer Storm Membrane with debossed coordinates',
      price: '$340 USD',
      badge: 'Weatherproof',
      leadTime: '3-5 Days',
      metric: '10,000mm Hydrostatic',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
    },
    stage: {
      name: 'Keynote Backlit Pylon System',
      subtitle: 'Tool-free modular acoustic dye-sub fabric towers',
      price: '$1,850 USD',
      badge: 'Enterprise Modular',
      leadTime: '7-10 Days',
      metric: '3000K Calibrated LED',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    },
  }[activeTab];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-xl mx-auto lg:max-w-none group"
      style={{ perspective: '1000px' }}
    >
      {/* Dynamic Specular Radial Glow behind the element */}
      <div
        className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#2D68FF]/30 via-transparent to-[#2D68FF]/10 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
        }}
      />

      {/* Main Glassmorphic 3D Card Shell */}
      <div
        className="relative rounded-3xl p-6 sm:p-8 bg-[#101016]/85 backdrop-blur-2xl border border-white/[0.12] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(45,104,255,0.15)] transition-transform duration-200 ease-out"
        style={{
          transform: `rotateY(${mousePos.x * 6}deg) rotateX(${-mousePos.y * 6}deg)`,
        }}
      >
        {/* Moving Specular Highlight Line */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
          style={{
            background: `radial-gradient(circle 300px at ${
              (mousePos.x + 0.5) * 100
            }% ${(mousePos.y + 0.5) * 100}%, rgba(255,255,255,0.18), transparent 60%)`,
          }}
        />

        {/* Top Floating Control Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2D68FF] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1B0]">
              {activeTab === '3d-core' ? '★ APEX 3D Spatial Visual' : 'Interactive Showcase'}
            </span>
          </div>

          {/* Interactive Switchers */}
          <div className="flex items-center gap-1 bg-[#0A0A0C]/80 border border-white/10 rounded-xl p-1">
            {(['3d-core', 'vault', 'apparel', 'stage'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[11px] font-mono uppercase px-2.5 sm:px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#2D68FF] text-white shadow-[0_0_12px_rgba(45,104,255,0.5)] font-semibold'
                    : 'text-[#71717A] hover:text-[#F5F5F8]'
                }`}
              >
                {tab === '3d-core' ? '★ 3D Shape' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Center Display Frame: 3D Visual OR Physical Kit Display */}
        {activeTab === '3d-core' ? (
          <div className="relative z-10 my-5">
            <Hero3DVisual
              posterFallback="/images/agency/ai-creative-lab.jpg"
              splineSceneUrl="https://my.spline.design/particlenebula-ca85860d5c8fa440a33e9d8924b12368/"
            />
          </div>
        ) : (
          <div className="relative z-10 my-5 rounded-2xl overflow-hidden aspect-[16/10] bg-[#070709] border border-white/[0.08] shadow-inner group/img">
            <img
              src={activeKitData.image}
              alt={activeKitData.name}
              className="w-full h-full object-cover transform group-hover/img:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Contrast protection scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent opacity-80" />

            {/* Floating badge inside image */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0A0A0C]/85 backdrop-blur-md border border-white/15 text-[11px] font-mono text-[#5A8BFF] flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3 h-3 text-[#2D68FF]" />
              {activeKitData.badge}
            </div>

            {/* Floating live metric chip */}
            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-[#0A0A0C]/90 backdrop-blur-md border border-[#2D68FF]/30 text-[11px] font-mono text-[#F5F5F8] flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-[#2D68FF]" />
              {activeKitData.metric}
            </div>
          </div>
        )}

        {/* Kit Info & Quick Metrics */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#F5F5F8] font-display">
                {activeKitData.name}
              </h3>
              <p className="text-xs text-[#71717A] mt-0.5">
                {activeKitData.subtitle}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-base sm:text-lg font-bold text-[#2D68FF] font-mono">
                {activeKitData.price}
              </span>
              <p className="text-[10px] text-[#71717A]">Fulfillment: {activeKitData.leadTime}</p>
            </div>
          </div>

          {/* Spec details row */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] text-center">
            <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="block text-[10px] uppercase font-mono text-[#71717A]">Quality</span>
              <span className="text-xs font-semibold text-[#F5F5F8]">Mil-Spec 99.8%</span>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="block text-[10px] uppercase font-mono text-[#71717A]">Fulfillment</span>
              <span className="text-xs font-semibold text-[#5A8BFF]">Guaranteed</span>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="block text-[10px] uppercase font-mono text-[#71717A]">Inspection</span>
              <span className="text-xs font-semibold text-white">White-Glove</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCenterpiece;
