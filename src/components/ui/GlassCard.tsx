'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  specular?: boolean;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverEffect = true,
  specular = true,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'relative rounded-2xl overflow-hidden',
          'bg-gradient-to-b from-[#181822]/80 to-[#0E0E14]/90',
          'backdrop-blur-xl saturate-[165%]',
          'border border-white/[0.08]',
          hoverEffect &&
            'transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#2D68FF]/50 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8),0_0_30px_-5px_rgba(45,104,255,0.25)]',
          glow && 'shadow-[0_0_40px_-5px_rgba(45,104,255,0.35)] border-[#2D68FF]/40',
          className
        )
      )}
      {...props}
    >
      {/* Specular top highlight */}
      {specular && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      )}
      
      {/* Subtle safety contrast scrim */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
