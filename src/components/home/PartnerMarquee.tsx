'use client';

import React from 'react';
import Container from '@/components/ui/Container';

export const PartnerMarquee: React.FC = () => {
  const partners = [
    'HYPERION CAPITAL',
    'NEXUS ROBOTICS',
    'AETHER CLOUD',
    'VANTAGE BIOSCIENCE',
    'KINETIC LABS',
    'SYNAPSE VENTURES',
    'ORBITAL DYNAMICS',
    'STRATA MEDIA',
  ];

  return (
    <div className="w-full border-y border-white/[0.06] bg-[#08080B]/60 backdrop-blur-md py-6 overflow-hidden">
      <Container size="xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#71717A] shrink-0">
            Trusted by brand directors at:
          </span>

          <div className="flex items-center gap-8 md:gap-12 flex-wrap justify-center opacity-70">
            {partners.map((partner, index) => (
              <span
                key={index}
                className="font-display font-bold text-sm tracking-wider text-[#A1A1B0] hover:text-[#5A8BFF] transition-colors cursor-default"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PartnerMarquee;
