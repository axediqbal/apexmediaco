'use client';

import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
}

/**
 * ParticleConstellation — Hardware-Accelerated Interactive Canvas
 * 
 * KIYA HORAHA HAI (WHAT IT DOES):
 * - Renders a background constellation of floating particles in deep obsidian space.
 * - When particles approach one another, draws glowing Electric Cobalt link filaments.
 * - Responds to the user's cursor: particles gently repel from the pointer to create an organic, reactive wave.
 * 
 * KESE HORAHA HAI (HOW IT DOES IT):
 * 1. Initializes an HTML5 <canvas> element sized to the full container bounding rect.
 * 2. Spawns particle objects with random (X, Y) positions, subtle velocity vectors, and base opacities.
 * 3. On every requestAnimationFrame tick:
 *    - Updates particle coordinates and wraps them seamlessly around window bounds.
 *    - Calculates Euclidean distance to cursor; applies a proportional repulsion vector force.
 *    - Calculates pairwise Euclidean distances between particles; draws connecting filaments if distance < 110px.
 * 4. Checks `usePrefersReducedMotion()`: automatically unmounts and disables canvas rendering if user prefers reduced motion for accessibility.
 */
export const ParticleConstellation: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    // Accessibility guard: respect user's system preferences
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Dynamic particle density tuned for performance (~1 particle per 14k pixels)
    const particleCount = Math.min(80, Math.floor((width * height) / 14000));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.5 + 0.8,
        baseAlpha: Math.random() * 0.4 + 0.2,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const maxDistance = 110;
    const mouseRadius = 140;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Update and draw individual particle nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Kinematic position update
        p.x += p.vx;
        p.y += p.vy;

        // Torus wrap-around boundary logic
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Pointer repulsion physics
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius) {
            const force = (mouseRadius - dist) / mouseRadius;
            p.x -= (dx / dist) * force * 1.8;
            p.y -= (dy / dist) * force * 1.8;
          }
        }

        // Render point with soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(90, 139, 255, ${p.baseAlpha})`;
        ctx.shadowColor = '#2D68FF';
        ctx.shadowBlur = 6;
        ctx.fill();

        // 2. Pairwise link filaments
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(45, 104, 255, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className || ''}`}
    />
  );
};

export default React.memo(ParticleConstellation);
