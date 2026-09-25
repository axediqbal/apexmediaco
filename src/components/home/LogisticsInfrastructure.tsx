'use client';

/**
 * @file LogisticsInfrastructure.tsx
 * @description National Intermodal Logistics Showcase featuring uploaded photography
 * 
 * KIYA HORAHA HAI:
 * - Agency ke real national fulfillment infrastructure, high-bay warehouses,
 *   night dispatch terminals, and courier fleets ko visual photographic cards men display karta hai.
 * 
 * KESE HORAHA HAI:
 * - User ki provide ki gayi 5 authentic logistics photos ko dark-mode studio frames men map karta hai.
 * - Framer Motion ke scroll stagger reveals aur hover zoom physics use karta hai.
 * - Live telemetry status indicators aur GPS coordinates show karta hai.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, MapPin, ShieldCheck, Sparkles, ArrowUpRight, Maximize2, X } from 'lucide-react';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';

interface HubPhoto {
  id: string;
  title: string;
  location: string;
  hubCode: string;
  status: string;
  image: string;
  description: string;
  telemetry: string;
  spanClass: string;
}

const hubs: HubPhoto[] = [
  {
    id: 'nyc-night',
    title: 'NYC Metropolitan Night Terminal',
    location: 'Port of New York / New Jersey',
    hubCode: 'HUB-NYC-01',
    status: 'Active 24/7 Dispatch',
    image: '/images/logistics/terminal-night.jpg',
    description: 'High-throughput evening departures ensuring 72-hour guaranteed arrival at Fortune 500 corporate headquarters and keynote green rooms.',
    telemetry: '40.7128° N, 74.0060° W • 99.8% On-Time SLA',
    spanClass: 'md:col-span-2 lg:col-span-2',
  },
  {
    id: 'warehouse-vault',
    title: 'High-Bay Automated Kitting Vault',
    location: 'Austin Regional Logistics Hub',
    hubCode: 'HUB-ATX-02',
    status: 'Climate Controlled',
    image: '/images/logistics/warehouse-pallets.jpg',
    description: 'Automated high-density racking storing bespoke executive apparel, waterproof softshells, and waterjet-milled titanium onboarding boxes.',
    telemetry: '30.2672° N, 97.7431° W • 68°F Precision HVAC',
    spanClass: 'md:col-span-1 lg:col-span-1',
  },
  {
    id: 'fleet-dispatch',
    title: 'Dedicated White-Glove Fleet',
    location: 'Nationwide Courier Staging Yards',
    hubCode: 'FLEET-500',
    status: '50+ Dedicated Vehicles',
    image: '/images/logistics/fleet-trucks.jpg',
    description: 'Pre-loaded transport fleet equipped with tamper-evident electronic locks, real-time GPS telemetry, and white-glove driver crews.',
    telemetry: 'Multi-Region Staging • Direct Venue Handoff',
    spanClass: 'md:col-span-1 lg:col-span-1',
  },
  {
    id: 'terminal-aerial',
    title: 'Intermodal Rail & Container Grid',
    location: 'Midwest Freight Intermodal Junction',
    hubCode: 'RAIL-GRID-04',
    status: 'Direct Rail Transfer',
    image: '/images/logistics/terminal-aerial.jpg',
    description: 'Zero-delay trans-continental freight sorting connecting East and West coast production facilities with bulk delivery capacity.',
    telemetry: '41.8781° N, 87.6298° W • Rapid Sorting Rail',
    spanClass: 'md:col-span-1 lg:col-span-1',
  },
  {
    id: 'port-cranes',
    title: 'Deep-Water Pacific Sourcing Terminal',
    location: 'San Francisco Bay Maritime Port',
    hubCode: 'HUB-SFO-03',
    status: 'Raw Materials Inbound',
    image: '/images/logistics/port-cranes.jpg',
    description: 'Direct deep-water port processing specialized Japanese technical membranes, organic French terry, and certified aerospace aluminum ingots.',
    telemetry: '37.7749° N, 122.4194° W • Global Inbound Dock',
    spanClass: 'md:col-span-1 lg:col-span-1',
  },
];

export const LogisticsInfrastructure: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<HubPhoto | null>(null);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background ambient flare */}
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-[#2D68FF]/5 blur-[160px] pointer-events-none rounded-full" />

      <Container size="xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D68FF]/10 border border-[#2D68FF]/30 text-xs font-mono text-[#5A8BFF]">
              <Truck className="w-3.5 h-3.5" />
              <span>National Operations Network</span>
            </div>
            <h2 className="text-display-title text-[#F8F9FD]">
              NATIONWIDE INTERMODAL INFRASTRUCTURE.
            </h2>
            <p className="text-sm sm:text-base text-[#9FA5B9] max-w-xl">
              From automated high-bay fulfillment vaults to nocturnal maritime terminals — how APEX delivers enterprise collateral anywhere in North America within 72 hours.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-[#69708A]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
              5 Regional Hubs Online
            </span>
            <span>•</span>
            <span className="text-[#5A8BFF]">72h Delivery SLA</span>
          </div>
        </div>

        {/* Photography Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hubs.map((hub) => (
            <div
              key={hub.id}
              data-gsap-card="true"
              className={hub.spanClass}
            >
              <GlassCard 
                className="h-full p-6 flex flex-col justify-between group cursor-pointer hover:border-[#2D68FF]/50 transition-all duration-300"
                onClick={() => setSelectedPhoto(hub)}
              >
                {/* Photo Frame with Studio Vignette */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#0A0A0E] border border-white/[0.08] mb-5 group/img">
                  <img
                    src={hub.image}
                    alt={hub.title}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-transparent to-transparent opacity-75" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Badge variant="cobalt" size="sm">
                      {hub.hubCode}
                    </Badge>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {hub.status}
                    </span>
                  </div>

                  {/* Expand icon hover hint */}
                  <div className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white/70 opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#5A8BFF] font-mono mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{hub.location}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-[#F8F9FD] font-display group-hover:text-[#5A8BFF] transition-colors">
                      {hub.title}
                    </h3>

                    <p className="text-xs text-[#9FA5B9] mt-2 leading-relaxed line-clamp-2">
                      {hub.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#69708A]">
                    <span>{hub.telemetry}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#5A8BFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </Container>

      {/* Expanded Photo Inspection Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full rounded-3xl bg-[#0D0E15] border border-[#2D68FF]/40 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(45,104,255,0.3)] overflow-hidden"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="cobalt" size="md">
                    {selectedPhoto.hubCode}
                  </Badge>
                  <span className="text-xs font-mono text-emerald-400">
                    {selectedPhoto.status}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white font-display">
                  {selectedPhoto.title}
                </h3>

                <p className="text-sm text-[#A1A1B0] leading-relaxed">
                  {selectedPhoto.description}
                </p>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-[#69708A]">
                  <span>Telemetry: {selectedPhoto.telemetry}</span>
                  <span className="text-[#5A8BFF]">APEX National Logistics Division</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default LogisticsInfrastructure;
