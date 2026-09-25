import React from 'react';
import Container from '@/components/ui/Container';
import Skeleton from '@/components/ui/Skeleton';

export default function ProductsLoading() {
  return (
    <div className="py-12 md:py-20 relative">
      <Container size="xl">
        {/* Header Skeleton */}
        <div className="space-y-4 mb-10">
          <Skeleton className="w-32 h-6 rounded-full" />
          <Skeleton className="w-80 h-10 rounded-xl" />
          <Skeleton className="w-full max-w-lg h-4 rounded" />
        </div>

        {/* Search & Filters Bar Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          <Skeleton className="md:col-span-6 h-12 rounded-xl" />
          <Skeleton className="md:col-span-3 h-12 rounded-xl" />
          <Skeleton className="md:col-span-3 h-12 rounded-xl" />
        </div>

        {/* Product Cards Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[#111219] border border-white/[0.06] flex flex-col justify-between space-y-4"
            >
              <Skeleton className="aspect-[4/3] rounded-xl w-full" />

              <div className="space-y-2">
                <Skeleton className="w-20 h-4 rounded" />
                <Skeleton className="w-full h-5 rounded" />
                <Skeleton className="w-3/4 h-3 rounded" />
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <Skeleton className="w-16 h-6 rounded" />
                <Skeleton className="w-9 h-9 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
