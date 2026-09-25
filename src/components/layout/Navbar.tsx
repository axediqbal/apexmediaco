'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Container from '@/components/ui/Container';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Collateral Kits', href: '/products' },
    { label: 'Capabilities', href: '/#capabilities' },
    { label: 'Case Studies', href: '/#testimonials' },
    { label: 'Agency Logistics', href: '/#logistics' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A0A0C]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent border-b border-white/[0.04]'
      }`}
    >
      <div className="bg-[#2D68FF]/10 border-b border-[#2D68FF]/20 text-[11px] text-[#A1A1B0] py-1.5 px-4 text-center hidden md:flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#5A8BFF]" />
        <span>Enterprise Agency Portal: Custom White-Glove Collateral Kits & Rapid Deployment for 2026 Campaigns</span>
        <Link href="/products" className="text-[#5A8BFF] hover:underline font-semibold flex items-center gap-0.5 ml-1">
          Explore Kits <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <Container size="xl">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-[#2D68FF] rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D68FF] to-[#12338C] flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(45,104,255,0.4)] group-hover:scale-105 transition-transform duration-300">
              <span className="font-mono text-base tracking-tighter">▲X</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-[#F5F5F8] font-display flex items-center gap-1.5">
                APEX <span className="text-[#2D68FF] text-xs font-mono px-1.5 py-0.5 rounded bg-[#2D68FF]/15 border border-[#2D68FF]/30">MEDIA CO</span>
              </span>
              <span className="text-[10px] text-[#71717A] tracking-wider uppercase font-mono">
                National Collateral Systems
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 py-1 relative ${
                    isActive
                      ? 'text-[#2D68FF]'
                      : 'text-[#A1A1B0] hover:text-[#F5F5F8]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D68FF] shadow-[0_0_8px_#2D68FF]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Area: Cart & Portal */}
          <div className="flex items-center gap-3">
            <button
              id="cart-trigger-btn"
              onClick={openCart}
              aria-label={`Open shopping cart with ${totalItems} items`}
              className="relative p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#2D68FF]/50 hover:bg-[#2D68FF]/10 text-[#F5F5F8] transition-all duration-200 group cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2D68FF]"
            >
              <ShoppingBag className="w-5 h-5 text-[#F5F5F8] group-hover:text-[#5A8BFF] transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#2D68FF] text-white text-[11px] font-bold flex items-center justify-center shadow-[0_0_12px_rgba(45,104,255,0.7)] animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            <Link
              href="/products"
              className="hidden lg:inline-flex items-center justify-center text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-xl bg-[#2D68FF] text-white hover:bg-[#3D75FF] hover:shadow-[0_0_24px_rgba(45,104,255,0.4)] transition-all duration-200"
            >
              Order Collateral
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="md:hidden p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-[#F5F5F8] hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Animated Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bg-[#0A0A0C]/95 backdrop-blur-2xl border-b border-white/10 p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-base font-medium text-[#F5F5F8] hover:text-[#5A8BFF] p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <Link
              href="/products"
              className="w-full text-center py-3 rounded-xl bg-[#2D68FF] text-white font-semibold text-sm shadow-[0_0_20px_rgba(45,104,255,0.4)]"
            >
              Browse Catalog
            </Link>
            <div className="flex items-center justify-center gap-2 text-xs text-[#71717A]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5A8BFF]" />
              <span>SOC2 Type II Certified Agency Warehouse</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
