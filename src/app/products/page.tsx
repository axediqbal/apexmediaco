import React from 'react';
import type { Metadata } from 'next';
import { fetchProducts } from '@/lib/dataStore';
import ProductCatalog from '@/components/products/ProductCatalog';

export const metadata: Metadata = {
  title: 'Collateral Kits Catalog — APEX MEDIA CO',
  description: 'Filterable specifications and ordering portal for APEX branded merchandise, executive apparel kits, and keynote signage systems.',
};

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await fetchProducts();

  return <ProductCatalog initialProducts={products} />;
}
