'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, helperText, leftIcon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-[#A1A1B0]">
            {label}
            {props.required && <span className="text-[#2D68FF] ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-[#A1A1B0] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={twMerge(
              clsx(
                'w-full bg-[#121218]/90 text-[#F5F5F8] placeholder-[#71717A] text-sm rounded-xl px-4 py-3',
                'border transition-all duration-200 outline-none backdrop-blur-md',
                leftIcon ? 'pl-11' : 'pl-4',
                error
                  ? 'border-red-500/60 focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                  : success
                  ? 'border-emerald-500/60 focus:border-emerald-500'
                  : 'border-white/10 hover:border-white/20 focus:border-[#2D68FF] focus:shadow-[0_0_20px_rgba(45,104,255,0.25)]',
                props.disabled && 'opacity-50 cursor-not-allowed bg-[#0E0E14]',
                className
              )
            )}
            {...props}
          />
          {error && (
            <div className="absolute right-3 text-red-400 pointer-events-none">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          {!error && success && (
            <div className="absolute right-3 text-emerald-400 pointer-events-none">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
        </div>
        {error && <span className="text-xs text-red-400 mt-0.5">{error}</span>}
        {!error && helperText && <span className="text-xs text-[#71717A] mt-0.5">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
