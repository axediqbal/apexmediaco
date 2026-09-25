'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { X, Check, ShoppingBag, ShieldCheck, Star, Layers, Cpu } from 'lucide-react';
import { ProductItem } from '@/types';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface QuickSpecDrawerProps {
  product: ProductItem | null;
  onClose: () => void;
}

/**
 * QuickSpecDrawer — Inline Engineering Inspection Drawer
 * 
 * KIYA HORAHA HAI (WHAT IT DOES):
 * - Renders a slide-in technical specification inspector when clicking 'Quick Spec' on any card.
 * - Displays bill of materials, engineering tolerances (0.05mm), lead times, and quality certifications.
 * - Provides an instant 'Quick Add Kit' action without navigating away from the catalog or homepage.
 * 
 * KESE HORAHA HAI (HOW IT DOES IT):
 * 1. Conditionally renders when product !== null.
 * 2. Locks body scroll when open and supports ESC key dismiss.
 * 3. Triggers Add-to-Cart with visual checkmark feedback and automatically closes drawer after 1.2s.
 */
export const QuickSpecDrawer: React.FC<QuickSpecDrawerProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && product) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product]);

  if (!product) return null;

  const isOutOfStock = product.stock === 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in glassmorphic drawer */}
      <div className="relative z-10 w-full max-w-lg h-full glass-drawer flex flex-col justify-between animate-in slide-in-from-right duration-300 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[#0C0C10]/90 backdrop-blur-xl z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2D68FF] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#A1A1B0]">
              Technical Spec Inspection
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close technical spec inspection"
            className="p-2 rounded-xl text-[#A1A1B0] hover:text-[#F5F5F8] hover:bg-white/[0.06] transition-colors focus-visible:ring-2 focus-visible:ring-[#2D68FF]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Main Visual */}
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#0A0A0E] border border-white/10">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3">
              <Badge variant="cobalt" size="sm">
                {product.category}
              </Badge>
            </div>
            {product.badge && (
              <div className="absolute bottom-3 left-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A0A0C]/85 border border-white/15 text-[#F5F5F8]">
                  {product.badge}
                </span>
              </div>
            )}
          </div>

          {/* Title & Price */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#71717A] font-mono">
              <span>SKU: {product.sku}</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-[#F5F5F8]">{product.rating}</span>
                <span>({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-[#F5F5F8] font-display">
              {product.name}
            </h3>

            <p className="text-xs text-[#A1A1B0] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing & Stock Card */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-[#F5F5F8] font-mono">
                ${product.price.toLocaleString()}
              </span>
              <span className="block text-[10px] text-[#71717A] font-mono">
                Includes Insured Packaging
              </span>
            </div>

            <div>
              {isOutOfStock ? (
                <Badge variant="amber" size="sm">Waitlist Only</Badge>
              ) : (
                <Badge variant="emerald" size="sm">In Stock ({product.stock} available)</Badge>
              )}
            </div>
          </div>

          {/* Technical Specifications Matrix */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#A1A1B0] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#5A8BFF]" />
              Engineering Specifications
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-[#09090C] border border-white/[0.04]">
                <span className="text-[10px] uppercase font-mono text-[#71717A] block">Lead Time</span>
                <span className="font-semibold text-[#F5F5F8]">{product.leadTime}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#09090C] border border-white/[0.04]">
                <span className="text-[10px] uppercase font-mono text-[#71717A] block">Quality Grade</span>
                <span className="font-semibold text-emerald-400">Mil-Spec 99.8%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#09090C] border border-white/[0.04]">
                <span className="text-[10px] uppercase font-mono text-[#71717A] block">Fulfillment</span>
                <span className="font-semibold text-[#5A8BFF]">White-Glove Insured</span>
              </div>
              <div className="p-3 rounded-xl bg-[#09090C] border border-white/[0.04]">
                <span className="text-[10px] uppercase font-mono text-[#71717A] block">White-Label NDA</span>
                <span className="font-semibold text-[#F5F5F8]">Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Included Features */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#A1A1B0] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#5A8BFF]" />
              Package Bill of Materials
            </h4>
            <ul className="space-y-2 text-xs text-[#A1A1B0]">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.02]">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/[0.08] bg-[#0A0A0C]/90 sticky bottom-0 z-20 space-y-3">
          <Button
            variant="primary"
            size="lg"
            disabled={isOutOfStock}
            onClick={handleAdd}
            className="w-full text-sm font-bold shadow-[0_0_25px_rgba(45,104,255,0.4)]"
            leftIcon={isAdded ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4" />}
          >
            {isOutOfStock
              ? 'Waitlist Allocation Full'
              : isAdded
              ? 'Added to Collateral Cart ✓'
              : `Quick Add Kit — $${product.price.toLocaleString()}`}
          </Button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#71717A]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5A8BFF]" />
            <span>Pre-approved Net-30 Corporate Terms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSpecDrawer;
