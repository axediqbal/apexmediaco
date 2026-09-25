'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Star, ShoppingBag, Check, RotateCcw, Sparkles } from 'lucide-react';
import { ProductItem } from '@/types';
import { useCart } from '@/context/CartContext';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface ProductCatalogProps {
  initialProducts: ProductItem[];
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ initialProducts }) => {
  const { addToCart } = useCart();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories = ['All', 'Apparel', 'Event & Signage', 'VIP Kits', 'Digital Systems'];

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search query filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [initialProducts, selectedCategory, search, sortBy]);

  const handleQuickAdd = (product: ProductItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;

    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSortBy('featured');
  };

  return (
    <div className="py-12 md:py-20 relative">
      <Container size="xl">
        {/* Page Header */}
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D68FF]/10 border border-[#2D68FF]/30 text-xs font-mono text-[#5A8BFF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Agency Inventory</span>
          </div>
          <h1 className="text-display-title text-[#F5F5F8]">
            COLLATERAL CATALOG & SPECIFICATIONS.
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1B0] max-w-2xl">
            Explore our precision-crafted branded merchandise and deployment kits. Filter by campaign category or search for specific asset specifications.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="p-4 sm:p-6 rounded-2xl bg-[#101016]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="w-full md:max-w-md">
              <Input
                placeholder="Search by kit name, material, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                className="bg-[#0A0A0E] py-2.5"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3">
              <span className="text-xs font-mono uppercase text-[#71717A] flex items-center gap-1.5 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#0A0A0E] text-xs text-[#F5F5F8] border border-white/10 rounded-xl px-3 py-2.5 outline-none focus:border-[#2D68FF] cursor-pointer"
              >
                <option value="featured">Featured & Priority</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-white/[0.06]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-mono uppercase px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#2D68FF] text-white shadow-[0_0_15px_rgba(45,104,255,0.4)] font-semibold'
                    : 'bg-white/[0.03] text-[#A1A1B0] hover:text-[#F5F5F8] hover:bg-white/[0.06] border border-white/[0.04]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#71717A]">
          <span>
            Showing <strong className="text-[#F5F5F8]">{filteredProducts.length}</strong> collateral kits
          </span>
          {(search || selectedCategory !== 'All' || sortBy !== 'featured') && (
            <button
              onClick={handleResetFilters}
              className="text-[#5A8BFF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Product Grid / Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-[#101016]/50 border border-white/[0.06] p-8">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#71717A] mx-auto mb-4">
              <Search className="w-8 h-8 opacity-40" />
            </div>
            <h3 className="text-lg font-bold text-[#F5F5F8] font-display mb-1">
              No matching collateral kits found
            </h3>
            <p className="text-sm text-[#71717A] max-w-sm mx-auto mb-6">
              We couldn't find any kits matching "{search}". Try searching for apparel, keynote, or aluminum.
            </p>
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Clear Active Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock === 0;
              const isJustAdded = addedId === product.id;

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug || product.id}`}
                  className="group block"
                >
                  <GlassCard className="h-full flex flex-col justify-between p-4 group-hover:border-[#2D68FF]/40 transition-all duration-300">
                    {/* Thumbnail */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#0A0A0E] border border-white/[0.08] mb-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />

                      {/* Category Badge */}
                      <div className="absolute top-2.5 left-2.5">
                        <Badge variant="cobalt" size="sm">
                          {product.category}
                        </Badge>
                      </div>

                      {/* Out of Stock Edge Case Badge */}
                      {isOutOfStock && (
                        <div className="absolute top-2.5 right-2.5">
                          <Badge variant="amber" size="sm">
                            Waitlist Only
                          </Badge>
                        </div>
                      )}

                      {product.badge && !isOutOfStock && (
                        <div className="absolute bottom-2.5 left-2.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A0A0C]/85 border border-white/15 text-[#F5F5F8]">
                            {product.badge}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1 text-amber-400 text-xs mb-1.5">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-semibold text-[#F5F5F8]">{product.rating}</span>
                          <span className="text-[#71717A]">({product.reviewsCount})</span>
                        </div>

                        <h3 className="text-sm font-bold text-[#F5F5F8] group-hover:text-[#5A8BFF] transition-colors line-clamp-2">
                          {product.name}
                        </h3>

                        <p className="text-xs text-[#71717A] mt-1.5 line-clamp-2 leading-relaxed">
                          {product.tagline}
                        </p>
                      </div>

                      {/* Price & Action */}
                      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                        <div>
                          <span className="text-base font-bold text-[#F5F5F8] font-mono">
                            ${product.price.toLocaleString()}
                          </span>
                          <span className="block text-[10px] text-[#71717A] font-mono">
                            {product.leadTime}
                          </span>
                        </div>

                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          disabled={isOutOfStock}
                          aria-label={`Quick add ${product.name} to cart`}
                          className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                            isOutOfStock
                              ? 'bg-white/[0.02] border-white/10 text-[#71717A] cursor-not-allowed opacity-50'
                              : isJustAdded
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                              : 'bg-[#2D68FF]/15 border-[#2D68FF]/40 text-[#5A8BFF] hover:bg-[#2D68FF] hover:text-white hover:shadow-[0_0_20px_rgba(45,104,255,0.4)]'
                          }`}
                        >
                          {isJustAdded ? (
                            <Check className="w-4 h-4 animate-in zoom-in" />
                          ) : (
                            <ShoppingBag className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
};

export default ProductCatalog;
