'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ProductItem, CartItem } from '@/types';

/**
 * Interface defining the Cart Context shape.
 */
interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: ProductItem, quantity?: number, selectedVariants?: Record<string, string>) => void;
  removeFromCart: (productId: string, selectedVariants?: Record<string, string>) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariants?: Record<string, string>) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Generates a deterministic string key from a variant dictionary.
 * Ensures items with different options (e.g. Size M vs Size L) are treated as distinct cart rows.
 */
function getVariantKey(variants: Record<string, string> = {}): string {
  return Object.entries(variants)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
}

/**
 * CartProvider — Global Cart State & Storage Engine
 * 
 * KIYA HORAHA HAI (WHAT IT DOES):
 * - Manages shopping cart line-items, quantities, and selected variant configurations.
 * - Controls the slide-in visibility of the glassmorphic cart drawer.
 * - Automatically computes financial totals (subtotal, insured freight rules, production tax).
 * - Syncs cart items to browser localStorage so items persist on refresh.
 * 
 * KESE HORAHA HAI (HOW IT DOES IT):
 * 1. Initializes with an empty cart and hydrates from localStorage only after mount (prevents SSR mismatch).
 * 2. Provides memoized financial calculations to prevent redundant re-renders.
 * 3. Encapsulates atomic add/update/remove methods with boundary guards (min 1 quantity).
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Hydrate state from localStorage safely after client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('apex_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('[APEX Cart] Failed to read cart from localStorage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Persist state changes back to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('apex_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('[APEX Cart] Failed to save cart to localStorage:', e);
    }
  }, [cart, isHydrated]);

  // Drawer visibility toggles
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  // Add product to cart with chosen or default variants
  const addToCart = useCallback((
    product: ProductItem,
    quantity: number = 1,
    selectedVariants: Record<string, string> = {}
  ) => {
    const finalVariants = { ...selectedVariants };
    if (Object.keys(finalVariants).length === 0 && product.variants?.length) {
      product.variants.forEach((v) => {
        if (v.options?.length) {
          finalVariants[v.id] = v.options[0];
        }
      });
    }

    setCart((prev) => {
      const targetKey = getVariantKey(finalVariants);
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && getVariantKey(item.selectedVariants) === targetKey
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      }

      return [...prev, { product, quantity, selectedVariants: finalVariants }];
    });

    setIsOpen(true);
  }, []);

  // Remove specific variant line-item from cart
  const removeFromCart = useCallback((productId: string, selectedVariants: Record<string, string> = {}) => {
    const targetKey = getVariantKey(selectedVariants);
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && getVariantKey(item.selectedVariants) === targetKey)
      )
    );
  }, []);

  // Adjust item quantity with automatic removal at 0
  const updateQuantity = useCallback((
    productId: string,
    quantity: number,
    selectedVariants: Record<string, string> = {}
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariants);
      return;
    }

    const targetKey = getVariantKey(selectedVariants);
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && getVariantKey(item.selectedVariants) === targetKey) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  }, [removeFromCart]);

  // Clear all items (e.g. on successful checkout authorization)
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Financial calculations memoized for performance
  const totalItems = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0), [cart]);
  const shipping = useMemo(() => (subtotal > 0 ? (subtotal >= 1500 ? 0 : 45) : 0), [subtotal]);
  const tax = useMemo(() => Math.round(subtotal * 0.0825), [subtotal]);
  const total = useMemo(() => subtotal + shipping + tax, [subtotal, shipping, tax]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shipping,
        tax,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * Hook to consume CartContext with safety error boundary.
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
