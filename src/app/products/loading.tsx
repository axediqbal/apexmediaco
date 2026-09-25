import React from 'react';
import Container from '@/components/ui/Container';

export default function ProductsLoading() {
  return (
    <div className="py-12 md:py-20 relative">
      <Container size="xl">
        {/* Header Skeleton */}
        <div className="space-y-4 mb-10">
          <div className="w-32 h-6 rounded-full bg-white/[0.04] animate-pulse" />
          <div className="w-80 h-10 rounded-xl bg-white/[0.06] animate-pulse" />
          <div className="w-full max-w-lg h-4 rounded bg-white/[0.04] animate-pulse" />
        </div>

        {/* Search & Filters Bar Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          <div className="md:col-span-6 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] animate-pulse" />
          <div className="md:col-span-3 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] animate-pulse" />
          <div className="md:col-span-3 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] animate-pulse" />
        </div>

        {/* Product Cards Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[#111219] border border-white/[0.06] flex flex-col justify-between space-y-4"
            >
              <div className="relative aspect-[4/3] rounded-xl bg-white/[0.03] animate-pulse overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>

              <div className="space-y-2">
                <div className="w-20 h-4 rounded bg-white/[0.04] animate-pulse" />
                <div className="w-full h-5 rounded bg-white/[0.06] animate-pulse" />
                <div className="w-3/4 h-3 rounded bg-white/[0.03] animate-pulse" />
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <div className="w-16 h-6 rounded bg-white/[0.05] animate-pulse" />
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
