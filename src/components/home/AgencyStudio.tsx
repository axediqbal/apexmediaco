'use client';

/**
 * @file AgencyStudio.tsx
 * @description Inside the APEX Creative Engineering & Production Lab
 * 
 * KIYA HORAHA HAI:
 * - APEX MEDIA CO ke creative design studio, whiteboard design sprints,
 *   executive boardrooms, aur AI creative labs ko showcase karta hai.
 * 
 * KESE HORAHA HAI:
 * - User ki provide ki gayi 4 studio photos ko editorial glassmorphic cards men render karta hai.
 * - Framer Motion ke scroll cascade, hover expansion, aur high-res zoom modal provide karta hai.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, Cpu, Shield, ArrowUpRight, Maximize2, X, Lightbulb } from 'lucide-react';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';

interface StudioPhoto {
  id: string;
  title: string;
  division: string;
  badge: string;
  image: string;
  description: string;
  highlights: string[];
}

const studioFeatures: StudioPhoto[] = [
  {
    id: 'ai-lab',
    title: 'AI Creative Engineering & Rapid Prototyping Lab',
    division: 'Digital Systems & Generative Tools',
    badge: 'Neural Engine 4.0',
    image: '/images/agency/ai-creative-lab.jpg',
    description: 'Our proprietary creative synthesis suite converts brand DNA into multi-channel campaign collateral, digital ad variations, and interactive mockups in real time.',
    highlights: ['Multi-Device Previewing', 'Automated Token Sync', 'Sub-Second Ad Variations'],
  },
  {
    id: 'creative-team',
    title: 'Brand Architecture & Design Synthesis Team',
    division: 'Creative Direction & Typography',
    badge: 'Master Craftsmen',
    image: '/images/agency/creative-designers.jpg',
    description: 'Senior art directors and token engineers formulating harmonious OKLCH palettes, custom typefaces, and precision tactile packaging specs.',
    highlights: ['Dual-Screen Figma Workstations', 'Pantone Fabric Swatches', 'Iterative Print Proofing'],
  },
  {
    id: 'boardroom',
    title: 'Confidential Client Strategy War-Room',
    division: 'Executive Boardroom & Embargo Staging',
    badge: 'Confidential NDA Protected',
    image: '/images/agency/executive-boardroom.jpg',
    description: 'Acoustically isolated presentation suite where Fortune 500 leadership reviews unreleased brand identities, keynote collateral, and nationwide launch timelines.',
    highlights: ['Biometric Studio Access', 'High-Lumen Presentation Display', 'NDA Embargo Clean-Room'],
  },
  {
    id: 'whiteboard-sprint',
    title: 'Rapid Ideation & Design Sprint Canvas',
    division: 'Socratic Architecture & Strategy',
    badge: 'Design Sprint Hub',
    image: '/images/agency/design-sprint-whiteboard.jpg',
    description: 'Glass-wall whiteboard workshops exploring trade-offs between speed, cost, and craftsmanship — creating bulletproof roadmaps before manufacturing.',
    highlights: ['Venn Trade-Off Matrices', 'Physical Mockup Staging', 'Cross-Disciplinary Teams'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export const AgencyStudio: React.FC = () => {
  const [activePhoto, setActivePhoto] = useState<StudioPhoto | null>(null);

  return (
    <section id="studio" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#2D68FF]/5 blur-[150px] pointer-events-none rounded-full" />

      <Container size="xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D68FF]/10 border border-[#2D68FF]/30 text-xs font-mono text-[#5A8BFF]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Creative Engineering Studio</span>
            </div>
            <h2 className="text-display-title text-[#F8F9FD]">
              INSIDE THE APEX CREATIVE LAB.
            </h2>
            <p className="text-sm sm:text-base text-[#9FA5B9] max-w-xl">
              Where national brand identities, software design tokens, and aerospace-grade physical fabrication are brought to life by our multidisciplinary team.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#5A8BFF]">
            <Users className="w-4 h-4" />
            <span>45+ In-House Creative Engineers</span>
          </div>
        </motion.div>

        {/* Studio Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {studioFeatures.map((item) => (
            <motion.div key={item.id} variants={cardVariants}>
              <GlassCard
                className="h-full p-6 sm:p-8 flex flex-col justify-between group cursor-pointer hover:border-[#2D68FF]/50 transition-all duration-300"
                onClick={() => setActivePhoto(item)}
              >
                {/* Photo Frame */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#0A0A0E] border border-white/[0.08] mb-6 group/img">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-transparent to-transparent opacity-75" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="cobalt" size="sm">
                      {item.badge}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white/70 opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#69708A] block">
                      {item.division}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#F8F9FD] font-display group-hover:text-[#5A8BFF] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#9FA5B9] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center gap-2">
                    {item.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#A1A1B0]"
                      >
                        • {h}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </Container>

      {/* High-Res Photo Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full rounded-3xl bg-[#0D0E15] border border-[#2D68FF]/40 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(45,104,255,0.3)] overflow-hidden"
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all cursor-pointer"
                aria-label="Close studio preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                <img
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="cobalt" size="md">
                    {activePhoto.badge}
                  </Badge>
                  <span className="text-xs font-mono text-[#5A8BFF]">
                    {activePhoto.division}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white font-display">
                  {activePhoto.title}
                </h3>

                <p className="text-sm text-[#A1A1B0] leading-relaxed">
                  {activePhoto.description}
                </p>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-[#69708A]">
                  <span>APEX Creative Engineering Studio • New York & Austin</span>
                  <span className="text-[#5A8BFF]">In-House Design Team</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AgencyStudio;
