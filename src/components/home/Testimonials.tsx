'use client';

/**
 * @file Testimonials.tsx
 * @description Client Case Studies & Impact with Cascading Stagger Motion
 * 
 * KIYA HORAHA HAI:
 * - Enterprise brand leaders ke quotes, company roles, aur deployed kits showcase karta hai.
 * 
 * KESE HORAHA HAI:
 * - Framer Motion viewport reveal ke sath testimonial cards sequence men animate hoti hain.
 * - Interactive hover par border spotlight aur subtle card tilt physics activate hoti hai.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles, Star } from 'lucide-react';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote:
        'APEX transformed our annual developer summit from standard conference clutter into an architectural brand statement. The monolithic backlit pylons and titanium VIP boxes set an unprecedented agency benchmark.',
      author: 'Marcus Vance',
      role: 'VP of Brand Strategy',
      company: 'HYPERION SYSTEMS',
      rating: 5,
      kitUsed: 'Keynote Architectural Stage System',
    },
    {
      quote:
        'The Obsidian Executive Softshell kit was such a success with our leadership board that we commissioned 500 bespoke units for our Series B expansion. The 10K weatherproof membrane and debossed coordinates are exquisite.',
      author: 'Elena Rostova',
      role: 'Chief Marketing Officer',
      company: 'NEXUS ROBOTICS',
      rating: 5,
      kitUsed: 'Obsidian Executive Apparel Kit',
    },
    {
      quote:
        'Our design tokens in Figma synced effortlessly with APEX PMS fabric formulations. Zero color drift between our digital mobile interface and our physical stadium activation pod.',
      author: 'David Chen',
      role: 'Head of Creative Engineering',
      company: 'AETHER CLOUD PLATFORM',
      rating: 5,
      kitUsed: 'Brand Guidelines & Presentation System',
    },
  ];

  return (
    <section id="testimonials" className="py-20 md:py-32 relative">
      <Container size="xl">
        {/* Section Header with Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto space-y-3 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D68FF]/10 border border-[#2D68FF]/30 text-xs font-mono text-[#5A8BFF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Case Studies & Client Impact</span>
          </div>
          <h2 className="text-display-title text-[#F5F5F8]">
            TRUSTED BY NATIONAL CAMPAIGN DIRECTORS.
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1B0]">
            How tier-one brands leverage APEX collateral to drive executive retention and unforgettable summit experiences.
          </p>
        </motion.div>

        {/* Testimonial Cards Grid with Stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <GlassCard className="h-full p-8 flex flex-col justify-between hover:border-[#2D68FF]/40 transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-[#2D68FF]/15 text-[#5A8BFF]">
                      <Quote className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-[#A1A1B0] leading-relaxed italic">
                    "{item.quote}"
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.08] space-y-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F5F8]">
                      {item.author}
                    </h4>
                    <p className="text-xs text-[#71717A]">
                      {item.role}, <span className="text-[#5A8BFF] font-medium">{item.company}</span>
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-[#A1A1B0]">
                      Deployed: {item.kitUsed}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default Testimonials;
