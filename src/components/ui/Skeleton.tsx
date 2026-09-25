import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'relative overflow-hidden rounded-xl bg-white/[0.04]',
          'before:absolute before:inset-0 before:-translate-x-full',
          'before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r',
          'before:from-transparent before:via-white/[0.08] before:to-transparent',
          className
        )
      )}
      {...props}
    />
  );
};

export default Skeleton;
