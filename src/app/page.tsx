import React from 'react';
import Hero from '@/components/home/Hero';
import BentoGrid from '@/components/home/BentoGrid';
import AgencyStudio from '@/components/home/AgencyStudio';
import LogisticsInfrastructure from '@/components/home/LogisticsInfrastructure';
import FeaturedKits from '@/components/home/FeaturedKits';
import StatsCounter from '@/components/home/StatsCounter';
import Testimonials from '@/components/home/Testimonials';
import CtaBanner from '@/components/home/CtaBanner';
import { fetchProducts } from '@/lib/dataStore';

export const revalidate = 60;

export default async function HomePage() {
  const products = await fetchProducts();

  return (
    <div className="flex flex-col w-full">
      <Hero />
      <BentoGrid />
      <AgencyStudio />
      <LogisticsInfrastructure />
      <FeaturedKits products={products} />
      <StatsCounter />
      <Testimonials />
      <CtaBanner />
    </div>
  );
}
