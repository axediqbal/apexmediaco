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
  /** Enables dynamic cursor-tracking radial spotlight */
  spotlight?: boolean;
}

/**
 * GlassCard — Glassmorphism 2.0 Surface Container
 * 
 * KIYA HORAHA HAI (WHAT IT DOES):
 * - Renders a frosted, dark-mode obsidian glass panel with generous padding,
 *   subtle specular bevel, and interactive Electric Cobalt spotlight tracking.
 * - Guarantees that text never collapses against the container edges.
 * 
 * KESE HORAHA HAI (HOW IT DOES IT):
 * - Single-layer unified container with backdrop-blur, subtle 1px border, and
 *   direct padding preservation from className.
 * - Absolute positioned specular and spotlight overlays do not interfere with flexbox children.
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

  // Throttled mouse move handler using requestAnimationFrame
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
          'relative rounded-2xl overflow-hidden group/card',
          'bg-gradient-to-b from-[#11131C]/95 to-[#0A0B10]/98',
          'backdrop-blur-xl saturate-[165%]',
          'border border-white/[0.08]',
          'transition-all duration-300 ease-out',
          hoverEffect && 'hover:-translate-y-1 hover:border-[#2D68FF]/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(45,104,255,0.22)]',
          glow && 'shadow-[0_0_40px_-5px_rgba(45,104,255,0.35)]',
          className
        )
      )}
      {...props}
    >
      {/* Specular hairline highlight along top bevel */}
      {specular && (
        <div 
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10" 
        />
      )}

      {/* Dynamic Cursor Spotlight Radial Glow (Absolute, doesn't interfere with flex children) */}
      {spotlight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-0"
          style={{
            opacity: mousePos.opacity,
            background: `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, rgba(45, 104, 255, 0.12), transparent 70%)`,
          }}
        />
      )}

      {children}
    </div>
  );
};

export default React.memo(GlassCard);
