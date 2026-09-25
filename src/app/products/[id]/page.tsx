import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchProductById, fetchProducts } from '@/lib/dataStore';
import ProductDetailView from '@/components/products/ProductDetailView';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return {
      title: 'Collateral Kit Not Found — APEX MEDIA CO',
    };
  }

  return {
    title: `${product.name} — APEX MEDIA CO`,
    description: product.tagline || product.description.substring(0, 160),
    openGraph: {
      title: `${product.name} | APEX Collateral Kit`,
      description: product.tagline,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((p) => ({
    id: p.slug,
  }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  const allProducts = await fetchProducts();
  const relatedProducts = allProducts.filter((p) => p.id !== product.id);

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}
