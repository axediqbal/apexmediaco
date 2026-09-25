import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cobalt' | 'emerald' | 'amber' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'cobalt',
  size = 'md',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-wide uppercase select-none';

  const sizeStyles = {
    sm: 'text-[10px] px-2.5 py-0.5 font-semibold',
    md: 'text-xs px-3 py-1 font-medium',
  };

  const variantStyles = {
    cobalt: 'bg-[#2D68FF]/15 text-[#5A8BFF] border border-[#2D68FF]/40 shadow-[0_0_12px_rgba(45,104,255,0.2)]',
    emerald: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    neutral: 'bg-white/10 text-[#F5F5F8] border border-white/15',
    outline: 'bg-transparent text-[#A1A1B0] border border-white/20',
  };

  return (
    <span
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
