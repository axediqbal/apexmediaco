'use client';

import React from 'react';

/**
 * PartnerMarquee — infinite client-logo ticker.
 * Renders the partner list twice inside a w-max track and slides it
 * -50% on a linear loop, so the scroll is seamless. Edge fade masks
 * soften the entry/exit, and the ticker pauses on hover.
 */
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

  const row = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center"
    >
      {partners.map((partner) => (
        <span
          key={`${ariaHidden ? 'b' : 'a'}-${partner}`}
          className="font-display font-bold text-sm tracking-wider text-[#A1A1B0] hover:text-[#5A8BFF] transition-colors cursor-default whitespace-nowrap px-8 md:px-12 select-none"
        >
          {partner}
        </span>
      ))}
    </div>
  );

  return (
    <div className="w-full border-y border-white/[0.06] bg-[#08080B]/60 backdrop-blur-md py-6 overflow-hidden marquee-paused">
      <p className="text-center text-[11px] font-mono uppercase tracking-widest text-[#71717A] mb-5">
        Trusted by brand directors at
      </p>

      <div className="marquee-mask overflow-hidden">
        <div className="animate-marquee flex w-max opacity-70">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  );
};

export default PartnerMarquee;
