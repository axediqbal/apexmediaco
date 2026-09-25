'use client';

import React, { useEffect, useRef, useState } from 'react';
import Container from '@/components/ui/Container';

interface StatItem {
  label: string;
  numericValue: number;
  suffix: string;
  decimals?: number;
  description: string;
}

export const StatsCounter: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const stats: StatItem[] = [
    {
      label: 'National Campaigns',
      numericValue: 140,
      suffix: '+',
      description: 'Executed for high-profile tech and enterprise summits',
    },
    {
      label: 'Branded Assets Distributed',
      numericValue: 2.4,
      suffix: 'M',
      decimals: 1,
      description: 'Zero quality defects reported across all hubs',
    },
    {
      label: 'On-Time Venue Delivery',
      numericValue: 99.8,
      suffix: '%',
      decimals: 1,
      description: 'Direct courier handoff to keynote green rooms',
    },
    {
      label: 'Client Satisfaction Index',
      numericValue: 4.96,
      suffix: ' / 5',
      decimals: 2,
      description: 'Rated by CMOs and Enterprise Brand Leads',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="py-20 border-y border-white/[0.08] bg-[#070709] relative overflow-hidden">
      {/* Background soft cobalt gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2D68FF]/5 to-transparent pointer-events-none" />

      <Container size="xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#2D68FF]/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#71717A]">
                  {stat.label}
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-[#F5F5F8] font-display mt-2 flex items-baseline tracking-tight">
                  <AnimatedNumber
                    target={stat.numericValue}
                    decimals={stat.decimals || 0}
                    trigger={isVisible}
                  />
                  <span className="text-[#2D68FF] ml-1">{stat.suffix}</span>
                </div>
              </div>

              <p className="text-xs text-[#A1A1B0] mt-4 pt-3 border-t border-white/[0.04] leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

const AnimatedNumber: React.FC<{
  target: number;
  decimals: number;
  trigger: boolean;
}> = ({ target, decimals, trigger }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let start = 0;
    const duration = 1800;
    const startTime = performance.now();

    const updateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const val = easeOut * target;
      setCurrent(val);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCurrent(target);
      }
    };

    requestAnimationFrame(updateCount);
  }, [trigger, target]);

  return <span>{current.toFixed(decimals)}</span>;
};

export default StatsCounter;
