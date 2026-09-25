'use client';

/**
 * @file FeaturedKits.tsx
 * @description Flagship Collateral Kits Section with Staggered Cascading Animation
 * 
 * KIYA HORAHA HAI:
 * - Agency ke top 4 flagship kits display karta hai.
 * - Quick Spec inspection drawer aur instant Add-to-Cart trigger provide karta hai.
 * 
 * KESE HORAHA HAI:
 * - Framer Motion ke `containerVariants` aur `cardVariants` ke zariye scroll-triggered cascading animation.
 * - Har product card viewport men aate waqt subtle rise aur fade animation karta hai, aur hover karne par -6px smooth elevation lift deta hai.
 */

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Star, Sparkles, Check, Eye } from 'lucide-react';
import { ProductItem } from '@/types';
import { useCart } from '@/context/CartContext';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import QuickSpecDrawer from '@/components/products/QuickSpecDrawer';

interface FeaturedKitsProps {
  products: ProductItem[];
}

export const FeaturedKits: React.FC<FeaturedKitsProps> = ({ products }) => {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = React.useState<string | null>(null);
  const [specProduct, setSpecProduct] = React.useState<ProductItem | null>(null);

  const handleQuickAdd = (product: ProductItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;

    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const featuredList = products.slice(0, 4);

  return (
    <section className="py-20 md:py-28 relative">
      {/* Background glow accent */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#2D68FF]/5 blur-[140px] pointer-events-none rounded-full" />

      <Container size="xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D68FF]/10 border border-[#2D68FF]/30 text-xs font-mono text-[#5A8BFF]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Agency Merchandise Showcase</span>
            </div>
            <h2 className="text-display-title text-[#F5F5F8]">
              FLAGSHIP COLLATERAL KITS.
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1B0] max-w-xl">
              Curated physical and digital packages engineered for executive gifting, keynote events, and high-growth launches.
            </p>
          </div>

          <Link href="/products">
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Full Catalog ({products.length})
            </Button>
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredList.map((product) => {
            const isOutOfStock = product.stock === 0;
            const isJustAdded = addedId === product.id;

            return (
              <div
                key={product.id}
                data-gsap-card="true"
                className="group/card-wrapper"
              >
                <Link
                  href={`/products/${product.slug || product.id}`}
                  className="group block h-full"
                >
                  <GlassCard className="h-full flex flex-col justify-between p-4 group-hover:border-[#2D68FF]/50 transition-all duration-300">
                    {/* Image thumbnail frame */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#0A0A0E] border border-white/[0.08] mb-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />

                      {/* Category tag */}
                      <div className="absolute top-2.5 left-2.5">
                        <Badge variant="cobalt" size="sm">
                          {product.category}
                        </Badge>
                      </div>

                      {/* Stock badge */}
                      {isOutOfStock && (
                        <div className="absolute top-2.5 right-2.5">
                          <Badge variant="amber" size="sm">
                            Waitlist Only
                          </Badge>
                        </div>
                      )}

                      {product.badge && !isOutOfStock && (
                        <div className="absolute bottom-2.5 left-2.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A0A0C]/85 border border-white/15 text-[#F5F5F8]">
                            {product.badge}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Body Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1 text-amber-400 text-xs mb-1.5">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-semibold text-[#F5F5F8]">{product.rating}</span>
                          <span className="text-[#71717A]">({product.reviewsCount})</span>
                        </div>

                        <h3 className="text-sm font-bold text-[#F5F5F8] group-hover:text-[#5A8BFF] transition-colors line-clamp-2">
                          {product.name}
                        </h3>

                        <p className="text-xs text-[#71717A] mt-1.5 line-clamp-2 leading-relaxed">
                          {product.tagline}
                        </p>
                      </div>

                      {/* Price and Add button */}
                      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                        <div>
                          <span className="text-base font-bold text-[#F5F5F8] font-mono">
                            ${product.price.toLocaleString()}
                          </span>
                          <span className="block text-[10px] text-[#71717A] font-mono">
                            {product.leadTime}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSpecProduct(product);
                            }}
                            title="Inspect Technical Specs"
                            aria-label={`Inspect ${product.name} specs`}
                            className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-[#A1A1B0] hover:text-white hover:border-[#2D68FF]/50 hover:bg-[#2D68FF]/10 transition-all cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => handleQuickAdd(product, e)}
                            disabled={isOutOfStock}
                            aria-label={`Quick add ${product.name} to cart`}
                            className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                              isOutOfStock
                                ? 'bg-white/[0.02] border-white/10 text-[#71717A] cursor-not-allowed opacity-50'
                                : isJustAdded
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                : 'bg-[#2D68FF]/15 border-[#2D68FF]/40 text-[#5A8BFF] hover:bg-[#2D68FF] hover:text-white hover:shadow-[0_0_20px_rgba(45,104,255,0.4)]'
                            }`}
                          >
                            {isJustAdded ? (
                              <Check className="w-4 h-4 animate-in zoom-in" />
                            ) : (
                              <ShoppingBag className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </div>
            );
          })}
        </div>
      </Container>

      {/* Inline Quick Spec Inspection Drawer */}
      <QuickSpecDrawer
        product={specProduct}
        onClose={() => setSpecProduct(null)}
      />
    </section>
  );
};

export default FeaturedKits;
