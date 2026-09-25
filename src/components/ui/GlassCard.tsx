'use client';

import React, { useRef, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  specular?: boolean;
  glow?: boolean;
  spotlight?: boolean;
}

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

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (spotlight && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        opacity: 1,
      });
    }
    if (onMouseMove) onMouseMove(e);
  };

  const handlePointerLeave = () => {
    if (spotlight) {
      setMousePos((prev) => ({ ...prev, opacity: 0 }));
    }
  };

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
      {/* Background Static Border Foundation */}
      <div className="absolute inset-0 rounded-2xl bg-white/[0.08] transition-colors group-hover/card:bg-white/[0.12] pointer-events-none" />

      {/* Dynamic Cursor Spotlight Radial Border Glow (No Milky Interior Haze) */}
      {spotlight && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: mousePos.opacity,
            background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(45, 104, 255, 0.65), transparent 60%)`,
          }}
        />
      )}

      {/* Deep Obsidian Inner Card Body */}
      <div className="relative z-10 w-full h-full rounded-[15px] bg-gradient-to-b from-[#11131C] to-[#0A0B10] backdrop-blur-xl saturate-[160%] overflow-hidden">
        {/* Specular top hairline highlight */}
        {specular && (
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
        )}

        {/* Card Content with Contrast Scrim */}
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GlassCard;
