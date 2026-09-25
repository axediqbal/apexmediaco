'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Shield, Truck, Zap, Mail } from 'lucide-react';
import Container from '@/components/ui/Container';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="w-full bg-[#08080A] border-t border-white/[0.08] pt-16 pb-12 relative overflow-hidden text-[#A1A1B0]">
      {/* Background radial accent glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#2D68FF]/5 blur-[120px] pointer-events-none rounded-full" />

      <Container size="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/[0.06]">
          {/* Column 1: Brand & Status */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2D68FF] to-[#12338C] flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(45,104,255,0.3)]">
                <span className="font-mono text-sm tracking-tighter">▲X</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-[#F5F5F8] font-display">
                APEX <span className="text-[#2D68FF]">MEDIA CO</span>
              </span>
            </Link>
            <p className="text-sm text-[#71717A] max-w-sm leading-relaxed">
              We design, fabricate, and distribute precision-grade branded merchandise, keynote event systems, and physical onboarding collateral for America's most ambitious brands.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium w-fit mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All 3 National Distribution Hubs Online (NYC, ATX, SFO)</span>
            </div>
          </div>

          {/* Column 2: Collateral Categories */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-[#F5F5F8] uppercase tracking-wider font-mono">
              Collateral Tiers
            </span>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/products?category=Apparel" className="hover:text-[#5A8BFF] transition-colors">
                  Executive Apparel
                </Link>
              </li>
              <li>
                <Link href="/products?category=Event+%26+Signage" className="hover:text-[#5A8BFF] transition-colors">
                  Event & Stage Systems
                </Link>
              </li>
              <li>
                <Link href="/products?category=VIP+Kits" className="hover:text-[#5A8BFF] transition-colors">
                  VIP Onboarding Vaults
                </Link>
              </li>
              <li>
                <Link href="/products?category=Digital+Systems" className="hover:text-[#5A8BFF] transition-colors">
                  Digital Brand Bundles
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Agency Capabilities */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-[#F5F5F8] uppercase tracking-wider font-mono">
              Agency Services
            </span>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/#capabilities" className="hover:text-[#5A8BFF] transition-colors">
                  Custom CNC Prototyping
                </Link>
              </li>
              <li>
                <Link href="/#logistics" className="hover:text-[#5A8BFF] transition-colors">
                  White-Glove Courier Logistics
                </Link>
              </li>
              <li>
                <Link href="/#capabilities" className="hover:text-[#5A8BFF] transition-colors">
                  Warehousing & Kitting
                </Link>
              </li>
              <li>
                <Link href="/#capabilities" className="hover:text-[#5A8BFF] transition-colors">
                  Figma Design System Sync
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Agency Dispatch Newsletter */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-[#F5F5F8] uppercase tracking-wider font-mono">
              Agency Dispatch
            </span>
            <p className="text-xs text-[#71717A] leading-relaxed">
              Receive quarterly production insights, material innovations, and prototype invitations.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Subscribed to Agency Dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-[#71717A]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter corporate email"
                    className="w-full text-xs bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-[#F5F5F8] placeholder-[#71717A] focus:border-[#2D68FF] outline-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-xs font-semibold uppercase tracking-wider py-2 rounded-xl bg-[#2D68FF] text-white hover:bg-[#3D75FF] transition-all shadow-[0_0_15px_rgba(45,104,255,0.3)]"
                >
                  Join Dispatch
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <div className="flex items-center gap-6">
            <span>© {new Date().getFullYear()} APEX MEDIA CO LLC. All rights reserved.</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">National Creative Brand Engineering</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-[#F5F5F8] transition-colors">
              Privacy Shield
            </a>
            <a href="#terms" className="hover:text-[#F5F5F8] transition-colors">
              Production Terms
            </a>
            <a href="#soc2" className="hover:text-[#F5F5F8] transition-colors flex items-center gap-1">
              SOC2 Type II <ArrowUpRight className="w-3 h-3 text-[#2D68FF]" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
