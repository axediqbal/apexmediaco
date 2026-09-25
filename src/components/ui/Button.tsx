'use client';

import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer rounded-xl disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]';

    const sizeStyles = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-5 py-2.5 gap-2 h-11',
      lg: 'text-base px-7 py-3.5 gap-2.5 h-13 font-semibold',
    };

    const variantStyles = {
      primary:
        'bg-[#2D68FF] text-white hover:bg-[#3D75FF] hover:shadow-[0_0_28px_rgba(45,104,255,0.45)] border border-[#5A8BFF]/40 active:bg-[#1A42AA]',
      secondary:
        'bg-[#181822]/80 text-[#F5F5F8] backdrop-blur-md border border-white/10 hover:border-white/25 hover:bg-[#20202E] hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]',
      outline:
        'bg-transparent text-[#F5F5F8] border border-[#2D68FF]/50 hover:border-[#2D68FF] hover:bg-[#2D68FF]/10 hover:shadow-[0_0_20px_rgba(45,104,255,0.2)]',
      ghost:
        'bg-transparent text-[#A1A1B0] hover:text-[#F5F5F8] hover:bg-white/5 active:bg-white/10',
      danger:
        'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/60',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(
            baseStyles,
            sizeStyles[size],
            variantStyles[variant],
            className
          )
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
