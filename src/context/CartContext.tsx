'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductItem, CartItem } from '@/types';

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

function getVariantKey(variants: Record<string, string> = {}): string {
  return Object.entries(variants)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('apex_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load cart from storage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('apex_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to storage:', e);
    }
  }, [cart, isHydrated]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (
    product: ProductItem,
    quantity: number = 1,
    selectedVariants: Record<string, string> = {}
  ) => {
    // If no variants specified, use default first options
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
  };

  const removeFromCart = (productId: string, selectedVariants: Record<string, string> = {}) => {
    const targetKey = getVariantKey(selectedVariants);
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && getVariantKey(item.selectedVariants) === targetKey)
      )
    );
  };

  const updateQuantity = (
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
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal > 1500 ? 0 : 45) : 0;
  const tax = Math.round(subtotal * 0.0825);
  const total = subtotal + shipping + tax;

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

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
