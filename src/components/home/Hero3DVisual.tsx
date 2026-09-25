'use client';

/**
 * @file Hero3DVisual.tsx
 * @description Interactive 3D Abstract Monolith & Spatial Visual for APEX Hero Section
 * 
 * KIYA HORAHA HAI:
 * - Hero section ke liye ek next-level interactive 3D visual render karta hai.
 * - Floating iridescent obsidian monolith, electric cobalt gyroscope rings,
 *   levitating crystalline nucleus, aur cursor-reactive specular lighting provide karta hai.
 * - Spline embed scene support karta hai with toggle.
 * - Static poster image fallback provide karta hai with lazy loading.
 * - prefers-reduced-motion aur mobile battery optimization (pauses when offscreen) respect karta hai.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Sparkles, Rotate3d, Eye, Box, Sliders, ExternalLink } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface Hero3DVisualProps {
  posterFallback?: string;
  splineSceneUrl?: string;
}

export const Hero3DVisual: React.FC<Hero3DVisualProps> = ({
  posterFallback = '/images/agency/ai-creative-lab.jpg',
  splineSceneUrl = 'https://my.spline.design/particlenebula-ca85860d5c8fa440a33e9d8924b12368/',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<'three' | 'spline'>('three');
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  // Animation & Three.js references
  const animFrameRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false, prevX: 0, prevY: 0 });
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);

  // Toggle wireframe
  const toggleWireframe = useCallback(() => {
    setWireframeMode((prev) => {
      const next = !prev;
      materialsRef.current.forEach((mat) => {
        if ('wireframe' in mat) {
          (mat as THREE.MeshStandardMaterial).wireframe = next;
        }
      });
      return next;
    });
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (mode !== 'three' || prefersReduced) {
      setIsLoading(false);
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 500;
    let height = container.clientHeight || 450;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // 3. Renderer with Mobile Optimization
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x0e1220, 3.5);
    scene.add(ambientLight);

    // Main Electric Cobalt Key Light
    const keyLight = new THREE.DirectionalLight(0x2d68ff, 4.0);
    keyLight.position.set(5, 5, 4);
    scene.add(keyLight);

    // Secondary Cyan/White Specular Fill Light
    const fillLight = new THREE.DirectionalLight(0x7da4ff, 2.5);
    fillLight.position.set(-5, -3, 2);
    scene.add(fillLight);

    // Mouse-interactive dynamic point light
    const pointLight = new THREE.PointLight(0x5a8bff, 6, 12);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // 5. 3D Meshes & Geometry Group
    const rootGroup = new THREE.Group();
    meshGroupRef.current = rootGroup;
    scene.add(rootGroup);

    materialsRef.current = [];

    // Core Monolith: Faceted Octahedron / Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(1.65, isMobile ? 0 : 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x090a10,
      metalness: 0.9,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
      wireframe: wireframeMode,
    });
    materialsRef.current.push(coreMat);
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Outer Gyroscope Rings (Electric Cobalt Glow)
    const ringGeo1 = new THREE.TorusGeometry(2.35, 0.04, 16, 64);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x2d68ff,
      emissive: 0x2d68ff,
      emissiveIntensity: 1.2,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: wireframeMode,
    });
    materialsRef.current.push(ringMat1);
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    rootGroup.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(2.65, 0.03, 16, 64);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x5a8bff,
      emissive: 0x1f47bf,
      emissiveIntensity: 0.8,
      metalness: 0.8,
      roughness: 0.3,
      wireframe: wireframeMode,
    });
    materialsRef.current.push(ringMat2);
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = Math.PI / 3;
    ringMesh2.rotation.y = Math.PI / 4;
    rootGroup.add(ringMesh2);

    // Inner Floating Crystalline Nucleus
    const nucleusGeo = new THREE.OctahedronGeometry(0.65, 0);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x2d68ff,
      emissive: 0x3d78ff,
      emissiveIntensity: 1.8,
      metalness: 0.5,
      roughness: 0.1,
      wireframe: wireframeMode,
    });
    materialsRef.current.push(nucleusMat);
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    rootGroup.add(nucleusMesh);

    // Orbiting Particles Ring
    const particleCount = isMobile ? 35 : 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = (i / particleCount) * Math.PI * 2;
      const radius = 2.8 + (Math.random() - 0.5) * 0.8;
      particlePositions[i * 3] = Math.cos(theta) * radius;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      particlePositions[i * 3 + 2] = Math.sin(theta) * radius;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x8ab4f8,
      size: 0.055,
      transparent: true,
      opacity: 0.85,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particleSystem);

    setIsLoading(false);

    // 6. Intersection Observer for Mobile CPU/Battery Conservation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // 7. Mouse & Touch Interaction
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      mouseRef.current.isDown = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      mouseRef.current.prevX = clientX;
      mouseRef.current.prevY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      // Normalized coordinates [-1, 1]
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = nx;
      mouseRef.current.targetY = ny;

      // Drag rotation
      if (mouseRef.current.isDown && rootGroup) {
        const deltaX = clientX - mouseRef.current.prevX;
        const deltaY = clientY - mouseRef.current.prevY;
        rootGroup.rotation.y += deltaX * 0.008;
        rootGroup.rotation.x += deltaY * 0.008;
        mouseRef.current.prevX = clientX;
        mouseRef.current.prevY = clientY;
      }
    };

    const handlePointerUp = () => {
      mouseRef.current.isDown = false;
    };

    const canvasElem = canvas;
    canvasElem.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    canvasElem.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 8. Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const elapsed = clock.getElapsedTime();

      // Smooth mouse interpolation (Damping)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Update interactive point light position based on cursor
      if (pointLightRef.current) {
        pointLightRef.current.position.x = mouseRef.current.x * 3.5;
        pointLightRef.current.position.y = mouseRef.current.y * 3.5;
      }

      // Smooth auto-rotation & floating bob
      if (!mouseRef.current.isDown && rootGroup) {
        rootGroup.rotation.y += 0.006;
        rootGroup.position.y = Math.sin(elapsed * 1.5) * 0.12;

        // Subtle tilt toward cursor
        rootGroup.rotation.x = mouseRef.current.y * -0.3 + Math.cos(elapsed * 0.8) * 0.08;
        rootGroup.rotation.z = mouseRef.current.x * 0.25;
      }

      // Independent ring rotations
      ringMesh1.rotation.z = elapsed * 0.4;
      ringMesh2.rotation.x = elapsed * -0.35;
      nucleusMesh.rotation.y = elapsed * -0.9;
      particleSystem.rotation.y = elapsed * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      observer.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      canvasElem.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      canvasElem.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      // Dispose Three.js objects
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [mode, wireframeMode, prefersReduced]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl bg-[#090A0F]/90 border border-white/[0.12] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9),0_0_50px_rgba(45,104,255,0.18)] overflow-hidden group select-none"
    >
      {/* Dynamic ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#2D68FF]/15 via-transparent to-[#2D68FF]/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#2D68FF]/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Top Visual HUD Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A0B10]/85 backdrop-blur-md border border-white/10 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#2D68FF] animate-pulse" />
          <span className="text-[11px] font-mono text-[#F8F9FD] tracking-wider uppercase">
            {mode === 'three' ? 'APEX Spatial Core 3D' : 'Spline Interactive Canvas'}
          </span>
        </div>

        {/* Mode & Visual Switchers */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0A0B10]/85 backdrop-blur-md border border-white/10 shadow-lg">
          <button
            onClick={() => setMode('three')}
            title="Switch to Three.js Spatial Engine"
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
              mode === 'three'
                ? 'bg-[#2D68FF] text-white font-semibold shadow-[0_0_10px_rgba(45,104,255,0.5)]'
                : 'text-[#858B9E] hover:text-white'
            }`}
          >
            Three.js
          </button>
          <button
            onClick={() => setMode('spline')}
            title="Switch to Spline 3D Scene"
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
              mode === 'spline'
                ? 'bg-[#2D68FF] text-white font-semibold shadow-[0_0_10px_rgba(45,104,255,0.5)]'
                : 'text-[#858B9E] hover:text-white'
            }`}
          >
            Spline
          </button>
          {mode === 'three' && (
            <button
              onClick={toggleWireframe}
              title="Toggle Wireframe Architecture"
              className={`p-1.5 rounded-lg text-[10px] transition-colors cursor-pointer ${
                wireframeMode
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-[#858B9E] hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Reduced Motion OR Static Poster Fallback */}
      {prefersReduced ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#090A0F]">
          <img
            src={posterFallback}
            alt="APEX 3D Spatial Monolith Poster"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono text-[#F8F9FD]">
            <span>Reduced Motion Mode • Static Poster Active</span>
          </div>
        </div>
      ) : (
        <>
          {/* Mode 1: Three.js Interactive WebGL Canvas */}
          {mode === 'three' && (
            <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
              />
            </div>
          )}

          {/* Mode 2: Spline Interactive Embed */}
          {mode === 'spline' && (
            <div className="w-full h-full relative">
              <iframe
                src={splineSceneUrl}
                frameBorder="0"
                width="100%"
                height="100%"
                className="w-full h-full border-0 pointer-events-auto"
                title="Spline 3D Scene Embed"
                loading="lazy"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          )}
        </>
      )}

      {/* Loading Overlay */}
      {isLoading && !prefersReduced && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#090A0F] gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#2D68FF]/30 border-t-[#2D68FF] animate-spin" />
          <div className="text-xs font-mono text-[#858B9E] tracking-widest uppercase">
            Initializing Spatial Engine...
          </div>
        </div>
      )}

      {/* Bottom Telemetry HUD */}
      <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#858B9E] bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/[0.08]">
          <Rotate3d className="w-3.5 h-3.5 text-[#2D68FF]" />
          <span>Click + Drag to Rotate • Cursor Light Tracking</span>
        </div>
        <div className="text-[10px] font-mono text-[#2D68FF] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#2D68FF]/30 hidden sm:block">
          WebGL 60FPS
        </div>
      </div>
    </div>
  );
};

export default Hero3DVisual;
