'use client';

/**
 * @file GsapScrollTriggerProvider.tsx
 * @description Master GSAP ScrollTrigger Section Stagger-Reveal Engine
 * 
 * KIYA HORAHA HAI:
 * - Har section jab viewport mein enter hota hai:
 *   1. Headings word-by-word stagger-reveal hoti hain (mask-reveal out of overflow-hidden).
 *   2. Cards ek-ek karke fade + translateY stagger ke sath reveal hote hain.
 * - Sirf initial load par nahi, balki HAR BAAR jab user scroll karke us section tak
 *   pahunche (scrolling down ya scrolling up - onEnter aur onEnterBack dono pe).
 * - Outgoing scroll (onLeave, onLeaveBack) par reset karta hai taake re-entry par
 *   fresh stagger play ho.
 * - prefers-reduced-motion respect karta hai (instant reveal, no transforms).
 * - Mobile screens (< 768px) par animation distance, duration aur stagger delays
 *   ko drastically optimize karta hai aur blur/filter overhead zero rakhta hai.
 */

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// Register plugin safely in browser
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Safely wraps every word in a text node in an overflow-hidden wrapper
 * while strictly preserving child elements, spans, gradient classes, and SVG icons.
 */
function splitWordsPreservingFormatting(element: HTMLElement): HTMLElement[] {
  const words: HTMLElement[] = [];

  function processNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (!text.trim()) return;

      const parts = text.split(/(\s+)/);
      const fragment = document.createDocumentFragment();

      parts.forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
        } else {
          const wrapper = document.createElement('span');
          wrapper.className = 'inline-block overflow-hidden align-top mr-[0.2em]';

          const inner = document.createElement('span');
          inner.className = 'gsap-word inline-block will-change-transform';
          inner.textContent = part;

          wrapper.appendChild(inner);
          fragment.appendChild(wrapper);
          words.push(inner);
        }
      });

      node.parentNode?.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const elem = node as HTMLElement;
      // Do not re-split if already processed
      if (elem.classList.contains('gsap-word')) {
        words.push(elem);
        return;
      }
      // If element has bg-clip-text or text-transparent, treat it atomically
      // to prevent inner inline-block wrapper from breaking background-clip: text
      if (
        elem.classList.contains('bg-clip-text') ||
        elem.classList.contains('text-transparent') ||
        elem.style.webkitBackgroundClip === 'text'
      ) {
        const wrapper = document.createElement('span');
        wrapper.className = 'inline-block overflow-hidden align-top mr-[0.2em]';
        elem.parentNode?.insertBefore(wrapper, elem);
        wrapper.appendChild(elem);
        elem.classList.add('gsap-word', 'will-change-transform');
        words.push(elem);
        return;
      }
      Array.from(elem.childNodes).forEach(processNode);
    }
  }

  Array.from(element.childNodes).forEach(processNode);
  return words;
}

export const GsapScrollTriggerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const prefersReduced = usePrefersReducedMotion();
  const cleanupRefs = useRef<Array<() => void>>([]);

  useEffect(() => {
    // If reduced motion is requested, show everything immediately
    if (prefersReduced) {
      document.querySelectorAll<HTMLElement>('.gsap-word, [data-gsap-card], .glass-card').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const isMobile = window.innerWidth < 768;

    // Small delay to allow Next.js route components to mount in DOM
    const timer = setTimeout(() => {
      // Clean up previous triggers
      cleanupRefs.current.forEach((fn) => fn());
      cleanupRefs.current = [];

      // Query all sections on the current page
      const sections = document.querySelectorAll<HTMLElement>('section, [data-gsap-section]');
      if (!sections || sections.length === 0) return;

      sections.forEach((section) => {
        // Skip hero top bar or sections explicitly marked to skip
        if (section.getAttribute('data-gsap-skip') === 'true') return;

        // 1. Headings to split word-by-word
        const headingElements = section.querySelectorAll<HTMLElement>(
          'h1, h2, h3, [data-gsap-heading]'
        );
        const allWords: HTMLElement[] = [];
        headingElements.forEach((h) => {
          // Skip small card headings if section has major title
          if (h.closest('.glass-card') || h.closest('[data-gsap-card]')) return;
          const words = splitWordsPreservingFormatting(h);
          allWords.push(...words);
        });

        // 2. Badges and subtitles
        const badges = section.querySelectorAll<HTMLElement>(
          '[data-gsap-badge], .badge-pill, [class*="rounded-full"][class*="bg-[#2D68FF]"]'
        );
        const subtitles = section.querySelectorAll<HTMLElement>(
          'p.text-sm, p.text-base, p.text-lg, [data-gsap-sub]'
        );
        const filteredSubtitles = Array.from(subtitles).filter(
          (p) => !p.closest('.glass-card') && !p.closest('[data-gsap-card]')
        );

        // 3. Cards to reveal one-by-one (stagger fade + translateY)
        let cards = Array.from(
          section.querySelectorAll<HTMLElement>(
            '[data-gsap-card], .glass-card, .grid > div, .grid > a'
          )
        );

        // Deduplicate cards (don't animate both child and parent)
        cards = cards.filter((c, idx, arr) => {
          return !arr.some((other) => other !== c && other.contains(c));
        });

        // Build GSAP Timeline
        const tl = gsap.timeline({ paused: true });

        // A. Badges reveal
        if (badges.length > 0) {
          tl.fromTo(
            badges,
            { opacity: 0, y: isMobile ? 8 : 12 },
            {
              opacity: 1,
              y: 0,
              duration: isMobile ? 0.35 : 0.45,
              ease: 'power2.out',
            },
            0
          );
        }

        // B. Word-by-word heading reveal (mask rise)
        if (allWords.length > 0) {
          tl.fromTo(
            allWords,
            { y: '115%', opacity: 0 },
            {
              y: '0%',
              opacity: 1,
              duration: isMobile ? 0.45 : 0.6,
              stagger: isMobile ? 0.025 : 0.035,
              ease: 'power3.out',
            },
            0.05
          );
        }

        // C. Subtitle reveal
        if (filteredSubtitles.length > 0) {
          tl.fromTo(
            filteredSubtitles,
            { opacity: 0, y: isMobile ? 10 : 18 },
            {
              opacity: 1,
              y: 0,
              duration: isMobile ? 0.4 : 0.5,
              ease: 'power2.out',
            },
            0.15
          );
        }

        // D. Cards ek-ek fade + translateY reveal
        if (cards.length > 0) {
          tl.fromTo(
            cards,
            { opacity: 0, y: isMobile ? 18 : 38 },
            {
              opacity: 1,
              y: 0,
              duration: isMobile ? 0.4 : 0.55,
              stagger: isMobile ? 0.05 : 0.08,
              ease: 'power3.out',
            },
            0.22
          );
        }

        // Create ScrollTrigger for re-triggering on EVERY scroll entry
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: isMobile ? 'top 90%' : 'top 85%',
          end: 'bottom top',
          onEnter: () => {
            tl.restart();
          },
          onEnterBack: () => {
            // Re-trigger stagger when scrolling back UP into the section
            tl.restart();
          },
          onLeave: () => {
            // Reset when section has completely scrolled above the viewport
            tl.pause(0);
          },
          onLeaveBack: () => {
            // Reset when section has completely scrolled below the viewport
            tl.pause(0);
          },
        });

        cleanupRefs.current.push(() => {
          trigger.kill();
          tl.kill();
        });
      });

      // Refresh ScrollTrigger to measure all elements accurately
      ScrollTrigger.refresh();
    }, 120);

    return () => {
      clearTimeout(timer);
      cleanupRefs.current.forEach((fn) => fn());
      cleanupRefs.current = [];
    };
  }, [pathname, prefersReduced]);

  return <>{children}</>;
};

export default GsapScrollTriggerProvider;
