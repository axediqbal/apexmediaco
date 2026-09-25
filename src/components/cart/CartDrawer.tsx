'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    totalItems,
    subtotal,
    shipping,
    tax,
    total
  } = useCart();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckoutClick = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
      {/* Frosted Dark Backdrop Scrim */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Slide-over Glassmorphic Drawer Panel */}
      <div className="relative z-10 w-full max-w-md h-full glass-drawer flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#2D68FF]/15 border border-[#2D68FF]/30 text-[#5A8BFF]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F5F5F8] font-display">
                Collateral Cart
              </h2>
              <p className="text-xs text-[#71717A]">
                {totalItems} {totalItems === 1 ? 'kit selected' : 'kits selected'}
              </p>
            </div>
          </div>

          <button
            onClick={closeCart}
            aria-label="Close cart drawer"
            className="p-2 rounded-xl text-[#A1A1B0] hover:text-[#F5F5F8] hover:bg-white/[0.06] transition-colors focus-visible:ring-2 focus-visible:ring-[#2D68FF]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#71717A] mb-4 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
                <ShoppingBag className="w-8 h-8 opacity-40" />
              </div>
              <h3 className="text-base font-semibold text-[#F5F5F8] font-display mb-1">
                Your cart is empty
              </h3>
              <p className="text-xs text-[#71717A] max-w-xs mb-6">
                Explore our catalog of executive apparel kits, keynote signage systems, and VIP unboxing vaults.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  closeCart();
                  router.push('/products');
                }}
              >
                Browse Collateral Kits
              </Button>
            </div>
          ) : (
            cart.map((item, index) => {
              const variantLabels = Object.entries(item.selectedVariants || {})
                .map(([k, v]) => `${k}: ${v}`)
                .join(' • ');

              return (
                <div
                  key={`${item.product.id}-${index}`}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors flex gap-4"
                >
                  {/* Thumbnail */}
                  <div className="relative w-18 h-18 rounded-lg overflow-hidden bg-[#181822] shrink-0 border border-white/10">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-[#F5F5F8] truncate leading-tight">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariants)}
                          aria-label={`Remove ${item.product.name}`}
                          className="text-[#71717A] hover:text-red-400 transition-colors p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {variantLabels && (
                        <p className="text-[10px] text-[#A1A1B0] mt-0.5 truncate">
                          {variantLabels}
                        </p>
                      )}
                    </div>

                    {/* Price and Quantity Controller */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
                      <span className="text-xs font-bold text-[#F5F5F8]">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </span>

                      <div className="flex items-center gap-1.5 bg-[#0E0E14] border border-white/10 rounded-lg p-0.5">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1, item.selectedVariants)
                          }
                          aria-label="Decrease quantity"
                          className="w-6 h-6 flex items-center justify-center text-[#A1A1B0] hover:text-[#F5F5F8] hover:bg-white/10 rounded transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-medium text-[#F5F5F8]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1, item.selectedVariants)
                          }
                          aria-label="Increase quantity"
                          className="w-6 h-6 flex items-center justify-center text-[#A1A1B0] hover:text-[#F5F5F8] hover:bg-white/10 rounded transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout Trigger */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-white/[0.08] bg-[#0A0A0C]/90 space-y-4">
            <div className="space-y-1.5 text-xs text-[#A1A1B0]">
              <div className="flex justify-between">
                <span>Kit Subtotal</span>
                <span className="text-[#F5F5F8]">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Insured Freight</span>
                <span className="text-[#F5F5F8]">
                  {shipping === 0 ? <span className="text-emerald-400">Complimentary ($1500+)</span> : `$${shipping}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Production Tax</span>
                <span className="text-[#F5F5F8]">${tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#F5F5F8] pt-2 border-t border-white/[0.06]">
                <span>Total Estimated</span>
                <span className="text-[#2D68FF]">${total.toLocaleString()}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-[0_0_30px_rgba(45,104,255,0.4)]"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleCheckoutClick}
            >
              Proceed to Agency Checkout
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#71717A]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5A8BFF]" />
              <span>Simulated Payment • Corporate Invoicing Supported</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
