'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  Clock, 
  Layers, 
  Plus, 
  Minus,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { ProductItem } from '@/types';
import { useCart } from '@/context/CartContext';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface ProductDetailViewProps {
  product: ProductItem;
  relatedProducts: ProductItem[];
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  relatedProducts,
}) => {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Initialize selected variants with first option of each
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.variants?.forEach((v) => {
      if (v.options?.length) {
        initial[v.id] = v.options[0];
      }
    });
    return initial;
  });

  const isOutOfStock = product.stock === 0;

  const handleVariantSelect = (variantId: string, option: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantId]: option,
    }));
  };

  const handleAddToCart = () => {
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    setTimeout(() => {
      addToCart(product, quantity, selectedVariants);
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }, 400);
  };

  return (
    <div className="py-10 md:py-16 relative">
      <Container size="xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1B0] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collateral Catalog</span>
          </Link>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Image Gallery (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Active Image */}
            <div className="relative aspect-[16/11] rounded-3xl overflow-hidden bg-[#0D0D12] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Badge variant="cobalt" size="md">
                  {product.category}
                </Badge>
                {product.badge && (
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#0A0A0C]/85 backdrop-blur-md border border-white/20 text-[#F5F5F8]">
                    {product.badge}
                  </span>
                )}
              </div>

              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                  <div className="p-4 rounded-2xl bg-[#121218]/90 border border-amber-500/40 text-center max-w-xs shadow-2xl">
                    <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                    <span className="text-sm font-bold text-white block">Allocation Exhausted</span>
                    <span className="text-xs text-[#A1A1B0]">Currently available for pre-order waitlist</span>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === index
                        ? 'border-[#2D68FF] shadow-[0_0_15px_rgba(45,104,255,0.5)] scale-[1.02]'
                        : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} angle ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Features Breakdown */}
            <div className="pt-6 border-t border-white/[0.08] space-y-4">
              <h3 className="text-base font-bold text-[#F5F5F8] font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5A8BFF]" />
                What's Included in This Kit
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#A1A1B0]">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Kit Purchase Configuration (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-6 sm:p-8 space-y-6">
              {/* Header Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#71717A] font-mono">
                  <span>SKU: {product.sku}</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-[#F5F5F8] font-semibold">{product.rating}</span>
                    <span>({product.reviewsCount} enterprise reviews)</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F5F8] font-display leading-tight">
                  {product.name}
                </h1>

                <p className="text-xs sm:text-sm text-[#A1A1B0] leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price & Stock Line */}
              <div className="py-4 border-y border-white/[0.08] flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-[#F5F5F8] font-mono tracking-tight">
                    ${product.price.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-[#71717A]">
                    Billed per package kit (USD)
                  </span>
                </div>

                <div className="text-right">
                  {isOutOfStock ? (
                    <Badge variant="amber" size="md">
                      Sold Out / Waitlist
                    </Badge>
                  ) : product.stock <= 10 ? (
                    <Badge variant="amber" size="md">
                      Low Allocation: {product.stock} Left
                    </Badge>
                  ) : (
                    <Badge variant="emerald" size="md">
                      In Stock ({product.stock} Available)
                    </Badge>
                  )}
                  <span className="block text-[11px] text-[#71717A] mt-1 font-mono">
                    Lead time: {product.leadTime}
                  </span>
                </div>
              </div>

              {/* Variant Selectors */}
              {product.variants?.map((variant) => (
                <div key={variant.id} className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#A1A1B0] uppercase font-mono">
                      {variant.name}
                    </span>
                    <span className="text-[#5A8BFF] font-medium font-mono">
                      {selectedVariants[variant.id]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {variant.options.map((option) => {
                      const isSelected = selectedVariants[variant.id] === option;
                      return (
                        <button
                          key={option}
                          onClick={() => handleVariantSelect(variant.id, option)}
                          className={`text-xs py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer font-medium truncate ${
                            isSelected
                              ? 'bg-[#2D68FF]/20 border-[#2D68FF] text-white shadow-[0_0_15px_rgba(45,104,255,0.3)]'
                              : 'bg-white/[0.03] border-white/10 text-[#A1A1B0] hover:text-white hover:border-white/20'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity Selector */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold uppercase text-[#A1A1B0] font-mono">
                  Order Quantity
                </span>
                <div className="flex items-center gap-2 bg-[#0E0E14] border border-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 flex items-center justify-center text-[#A1A1B0] hover:text-[#F5F5F8] hover:bg-white/10 rounded-lg transition-colors disabled:opacity-40"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-[#F5F5F8] font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isOutOfStock}
                    aria-label="Increase quantity"
                    className="w-8 h-8 flex items-center justify-center text-[#A1A1B0] hover:text-[#F5F5F8] hover:bg-white/10 rounded-lg transition-colors disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <div className="pt-4 space-y-3">
                <Button
                  id="add-to-cart-btn"
                  variant="primary"
                  size="lg"
                  disabled={isOutOfStock}
                  isLoading={isAdding}
                  onClick={handleAddToCart}
                  className="w-full text-sm font-bold shadow-[0_0_35px_rgba(45,104,255,0.45)]"
                  leftIcon={isAdded ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4" />}
                >
                  {isOutOfStock
                    ? 'Waitlist Allocation Full'
                    : isAdded
                    ? 'Added to Collateral Cart ✓'
                    : `Add to Collateral Cart — $${(product.price * quantity).toLocaleString()}`}
                </Button>

                <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-[#71717A]">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                    <Truck className="w-3.5 h-3.5 text-[#5A8BFF]" />
                    <span>White-Glove Courier</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>NDA White-Label</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Related Products Recommendation */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-white/[0.08]">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F5F5F8] font-display mb-8">
              Complementary Agency Collateral
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.slice(0, 3).map((item) => (
                <Link key={item.id} href={`/products/${item.slug || item.id}`} className="group block">
                  <GlassCard className="p-4 h-full flex flex-col justify-between hover:border-[#2D68FF]/40 transition-all">
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#0A0A0E] mb-3 border border-white/10">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div>
                      <Badge variant="cobalt" size="sm" className="mb-2">
                        {item.category}
                      </Badge>
                      <h4 className="text-sm font-bold text-[#F5F5F8] group-hover:text-[#5A8BFF] transition-colors truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#71717A] mt-1 line-clamp-2">
                        {item.tagline}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-sm font-bold text-[#F5F5F8] font-mono">
                        ${item.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#5A8BFF] font-medium group-hover:underline">
                        View Spec →
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default ProductDetailView;
