'use client';

import React, { useRef, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Props for the GlassCard component.
 */
export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enables subtle lift and elevation shadow on hover */
  hoverEffect?: boolean;
  /** Renders a top hairline specular gradient mimicking physical glass bevel */
  specular?: boolean;
  /** Applies an ambient Electric Cobalt bloom shadow */
  glow?: boolean;
  /** Enables dynamic cursor-tracking radial spotlight along the card border */
  spotlight?: boolean;
}

/**
 * GlassCard — Glassmorphism 2.0 Surface Container
 * 
 * KIYA HORAHA HAI (WHAT IT DOES):
 * - Renders a frosted, dark-mode obsidian glass panel with an interactive Electric Cobalt border spotlight.
 * - Ensures high contrast text safety (WCAG AA) by preventing milky background wash-out.
 * 
 * KESE HORAHA HAI (HOW IT DOES IT):
 * 1. Uses a dual-layer structure: an outer 1px wrapper that exposes the spotlight gradient, and a nested obsidian container.
 * 2. On mouse movement, calculates the local (X, Y) pointer coordinates relative to the card's bounding box.
 * 3. Renders a radial gradient mask exclusively through the 1px perimeter gap.
 * 4. Optimizes performance by throttling pointer updates via requestAnimationFrame to avoid layout thrashing.
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverEffect = true,
  specular = true,
  glow = false,
  spotlight = true,
  onMouseMove,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });
  const rafId = useRef<number | null>(null);

  // Throttled mouse move handler using requestAnimationFrame for 60/120fps smoothness
  const handlePointerMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (spotlight && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (rafId.current) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        setMousePos({
          x: clientX - rect.left,
          y: clientY - rect.top,
          opacity: 1,
        });
      });
    }
    if (onMouseMove) onMouseMove(e);
  }, [spotlight, onMouseMove]);

  const handlePointerLeave = useCallback(() => {
    if (spotlight) {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      setMousePos((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [spotlight]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className={twMerge(
        clsx(
          'relative rounded-2xl p-[1px] overflow-hidden group/card',
          'transition-all duration-300 ease-out',
          hoverEffect && 'hover:-translate-y-1 hover:shadow-[0_24px_60px_-10px_rgba(0,0,0,0.85),0_0_35px_-5px_rgba(45,104,255,0.3)]',
          glow && 'shadow-[0_0_40px_-5px_rgba(45,104,255,0.35)]',
          className
        )
      )}
      {...props}
    >
      {/* Base border foundation */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl bg-white/[0.08] transition-colors group-hover/card:bg-white/[0.12] pointer-events-none" 
      />

      {/* Dynamic Cursor Spotlight Radial Border Glow (Dual-layer bevel illumination) */}
      {spotlight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: mousePos.opacity,
            background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(45, 104, 255, 0.65), transparent 60%)`,
          }}
        />
      )}

      {/* Deep Obsidian Inner Card Body (Protects text contrast) */}
      <div className="relative z-10 w-full h-full rounded-[15px] bg-gradient-to-b from-[#11131C] to-[#0A0B10] backdrop-blur-xl saturate-[160%] overflow-hidden">
        {/* Specular hairline highlight along top bevel */}
        {specular && (
          <div 
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" 
          />
        )}

        {/* Card Content Scrim */}
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default React.memo(GlassCard);
