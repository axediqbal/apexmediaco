'use client';

/**
 * @file Hero3DVisual.tsx
 * @description Interactive 3D APEX VIP Client Onboarding Vault for Hero Section
 * 
 * KIYA HORAHA HAI:
 * - Abstract black shape ki jagah APEX ka flagship physical product
 *   "VIP Onboarding Vault ($620)" 3D mein render hota hai.
 * - Anodized 6061-T6 titanium/aluminum finish with visible metallic specular highlights (no flat black blob!).
 * - Glowing Electric Cobalt laser parting seam, biometric lock scanner pad, aur APEX emblem plate.
 * - Interactive Pneumatic Damper: User click karke lid ko open/close kar sakta hai,
 *   jis se andar ka velvet foam nest aur encrypted brand recovery key reveal hoti hai!
 * - Cursor-reactive 3D lighting, drag-to-rotate controls, Spline scene toggle,
 *   aur prefers-reduced-motion / battery conservation support karta hai.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Rotate3d, Box, Lock, Unlock, Sparkles, Layers, Sliders } from 'lucide-react';
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
  const [wireframeMode, setWireframeMode] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  // Animation & Three.js references
  const animFrameRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false, prevX: 0, prevY: 0 });
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const lidHingeGroupRef = useRef<THREE.Group | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);
  const isVaultOpenRef = useRef<boolean>(false);

  // Sync ref with state for animation loop
  useEffect(() => {
    isVaultOpenRef.current = isVaultOpen;
  }, [isVaultOpen]);

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

    // 2. Camera: Positioned with gentle isometric perspective
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.4, 6.2);
    camera.lookAt(0, 0, 0);

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
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    // 4. Studio Lighting Rig (Ensures rich metallic reflections without flat black spots)
    // Ambient fill
    const ambientLight = new THREE.AmbientLight(0x242b3d, 2.5);
    scene.add(ambientLight);

    // Main Studio Key Light (Pure White Specular)
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.5);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    // Secondary Electric Cobalt Rim Light (Back-Side Glow)
    const rimLight = new THREE.DirectionalLight(0x2d68ff, 5.0);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // Underside Cool Fill Light
    const fillLight = new THREE.DirectionalLight(0x6b8afd, 2.2);
    fillLight.position.set(0, -5, 4);
    scene.add(fillLight);

    // Mouse-interactive dynamic point light
    const pointLight = new THREE.PointLight(0x5a8bff, 7, 12);
    pointLight.position.set(0, 2, 4);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // 5. 3D Model: APEX VIP Onboarding Vault Chest
    const rootGroup = new THREE.Group();
    // Default initial rotation showing front-three-quarter view
    rootGroup.rotation.x = 0.28;
    rootGroup.rotation.y = -0.45;
    rootGroupRef.current = rootGroup;
    scene.add(rootGroup);

    materialsRef.current = [];

    // --- MATERIALS ---
    // A. Brushed Anodized Titanium (Metallic slate with smooth specular)
    const titaniumMat = new THREE.MeshPhysicalMaterial({
      color: 0x464e62,
      metalness: 0.88,
      roughness: 0.22,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      reflectivity: 0.9,
      wireframe: wireframeMode,
    });
    materialsRef.current.push(titaniumMat);

    // B. Stealth Obsidian Armor Corners
    const stealthArmorMat = new THREE.MeshStandardMaterial({
      color: 0x181a24,
      metalness: 0.92,
      roughness: 0.18,
      wireframe: wireframeMode,
    });
    materialsRef.current.push(stealthArmorMat);

    // C. Glowing Electric Cobalt LED Laser Seam
    const cobaltLedMat = new THREE.MeshStandardMaterial({
      color: 0x2d68ff,
      emissive: 0x2d68ff,
      emissiveIntensity: 3.5,
      roughness: 0.1,
      metalness: 0.3,
      wireframe: wireframeMode,
    });
    materialsRef.current.push(cobaltLedMat);

    // D. Biometric Cyan Scanner Glass
    const scannerGlassMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 2.8,
      roughness: 0.05,
      metalness: 0.5,
      wireframe: wireframeMode,
    });
    materialsRef.current.push(scannerGlassMat);

    // E. Velvet Interior Foam Nest
    const velvetMat = new THREE.MeshStandardMaterial({
      color: 0x0c0e14,
      roughness: 0.95,
      metalness: 0.05,
      wireframe: wireframeMode,
    });
    materialsRef.current.push(velvetMat);

    // F. Polished Chrome Hinges
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xd0d8e8,
      metalness: 0.98,
      roughness: 0.08,
      wireframe: wireframeMode,
    });
    materialsRef.current.push(chromeMat);

    // --- VAULT BASE (LOWER CHASSIS) ---
    const baseGroup = new THREE.Group();
    rootGroup.add(baseGroup);

    // Main base box
    const baseGeo = new THREE.BoxGeometry(3.2, 0.9, 2.2);
    const baseMesh = new THREE.Mesh(baseGeo, titaniumMat);
    baseMesh.position.y = -0.45;
    baseGroup.add(baseMesh);

    // Interior Velvet Nest (recessed inside base)
    const interiorGeo = new THREE.BoxGeometry(2.9, 0.2, 1.9);
    const interiorMesh = new THREE.Mesh(interiorGeo, velvetMat);
    interiorMesh.position.y = 0.01;
    baseGroup.add(interiorMesh);

    // Inside Vault: Encrypted APEX Recovery Key (Gold/Cobalt VIP Artifact)
    const keyGeo = new THREE.BoxGeometry(0.85, 0.06, 0.35);
    const keyMat = new THREE.MeshStandardMaterial({
      color: 0x2d68ff,
      emissive: 0x1f47bf,
      emissiveIntensity: 1.2,
      metalness: 0.95,
      roughness: 0.15,
    });
    const keyMesh = new THREE.Mesh(keyGeo, keyMat);
    keyMesh.position.set(0, 0.05, 0);
    keyMesh.rotation.y = 0.25;
    baseGroup.add(keyMesh);

    // Base Chamfered Armor Corner Pillars (4 corners)
    const cornerPositions = [
      [-1.61, -0.45, -1.11],
      [1.61, -0.45, -1.11],
      [-1.61, -0.45, 1.11],
      [1.61, -0.45, 1.11],
    ];
    cornerPositions.forEach(([cx, cy, cz]) => {
      const cornerGeo = new THREE.BoxGeometry(0.2, 0.92, 0.2);
      const cornerMesh = new THREE.Mesh(cornerGeo, stealthArmorMat);
      cornerMesh.position.set(cx, cy, cz);
      baseGroup.add(cornerMesh);
    });

    // Glowing Cobalt Perimeter Seam (Base Top Rim)
    const seamGeo = new THREE.BoxGeometry(3.24, 0.035, 2.24);
    const seamMesh = new THREE.Mesh(seamGeo, cobaltLedMat);
    seamMesh.position.y = 0.01;
    baseGroup.add(seamMesh);

    // Front Biometric Roller Lock Housing on Base
    const lockHousingGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 32);
    const lockHousing = new THREE.Mesh(lockHousingGeo, stealthArmorMat);
    lockHousing.rotation.x = Math.PI / 2;
    lockHousing.position.set(0, -0.25, 1.12);
    baseGroup.add(lockHousing);

    // Biometric Scanner Glowing Ring
    const scannerRingGeo = new THREE.TorusGeometry(0.2, 0.025, 16, 32);
    const scannerRing = new THREE.Mesh(scannerRingGeo, scannerGlassMat);
    scannerRing.position.set(0, -0.25, 1.16);
    baseGroup.add(scannerRing);

    // Biometric Center Sensor
    const sensorGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 32);
    const sensorMesh = new THREE.Mesh(sensorGeo, cobaltLedMat);
    sensorMesh.rotation.x = Math.PI / 2;
    sensorMesh.position.set(0, -0.25, 1.16);
    baseGroup.add(sensorMesh);

    // Rear Chrome Hinges
    const hinge1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.45, 16), chromeMat);
    hinge1.rotation.z = Math.PI / 2;
    hinge1.position.set(-0.9, 0.02, -1.12);
    baseGroup.add(hinge1);

    const hinge2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.45, 16), chromeMat);
    hinge2.rotation.z = Math.PI / 2;
    hinge2.position.set(0.9, 0.02, -1.12);
    baseGroup.add(hinge2);

    // --- VAULT LID (UPPER PNEUMATIC CHASSIS) ---
    // The hinge pivot is located at the top rear edge: y = 0.02, z = -1.1
    const lidHingeGroup = new THREE.Group();
    lidHingeGroup.position.set(0, 0.02, -1.1);
    lidHingeGroupRef.current = lidHingeGroup;
    rootGroup.add(lidHingeGroup);

    // Container for lid geometry relative to the hinge pivot
    const lidContent = new THREE.Group();
    lidContent.position.set(0, 0, 1.1); // Offset back to center
    lidHingeGroup.add(lidContent);

    // Lid Main Box
    const lidGeo = new THREE.BoxGeometry(3.2, 0.65, 2.2);
    const lidMesh = new THREE.Mesh(lidGeo, titaniumMat);
    lidMesh.position.y = 0.325;
    lidContent.add(lidMesh);

    // Lid Armor Corner Pillars
    cornerPositions.forEach(([cx, _, cz]) => {
      const lidCornerGeo = new THREE.BoxGeometry(0.2, 0.66, 0.2);
      const lidCornerMesh = new THREE.Mesh(lidCornerGeo, stealthArmorMat);
      lidCornerMesh.position.set(cx, 0.325, cz);
      lidContent.add(lidCornerMesh);
    });

    // Top APEX Monogram Inlay Plate
    const emblemPlateGeo = new THREE.BoxGeometry(1.5, 0.03, 1.0);
    const emblemPlate = new THREE.Mesh(emblemPlateGeo, stealthArmorMat);
    emblemPlate.position.set(0, 0.66, 0);
    lidContent.add(emblemPlate);

    // Laser-Etched Glowing APEX Geometric Monogram
    const logoSymbolGeo = new THREE.TorusGeometry(0.28, 0.03, 16, 3);
    const logoSymbol = new THREE.Mesh(logoSymbolGeo, cobaltLedMat);
    logoSymbol.rotation.x = Math.PI / 2;
    logoSymbol.rotation.z = Math.PI;
    logoSymbol.position.set(0, 0.68, 0);
    lidContent.add(logoSymbol);

    // Top Chamfer Accent Lines (Electric Cobalt)
    const accentLine1 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.02, 0.03), cobaltLedMat);
    accentLine1.position.set(0, 0.66, -0.65);
    lidContent.add(accentLine1);

    const accentLine2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.02, 0.03), cobaltLedMat);
    accentLine2.position.set(0, 0.66, 0.65);
    lidContent.add(accentLine2);

    // Subtle Ambient Floating Dust Particles around Vault
    const particleCount = isMobile ? 30 : 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x5a8bff,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
    });
    const dustParticles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(dustParticles);

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
        rootGroup.rotation.y += deltaX * 0.007;
        rootGroup.rotation.x += deltaY * 0.007;
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
        pointLightRef.current.position.x = mouseRef.current.x * 4;
        pointLightRef.current.position.y = mouseRef.current.y * 3 + 2;
      }

      // Smooth subtle floating bobbing motion (when not actively dragging)
      if (!mouseRef.current.isDown && rootGroup) {
        rootGroup.position.y = Math.sin(elapsed * 1.4) * 0.08;
        // Slow idle turntable rotation
        rootGroup.rotation.y += 0.0025;
      }

      // Pneumatic Damper Lid Open / Close interpolation
      if (lidHingeGroupRef.current) {
        const targetAngle = isVaultOpenRef.current ? -Math.PI * 0.45 : 0;
        lidHingeGroupRef.current.rotation.x += (targetAngle - lidHingeGroupRef.current.rotation.x) * 0.08;
      }

      // Floating dust particles drift
      dustParticles.rotation.y = elapsed * 0.05;

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
      baseGeo.dispose();
      interiorGeo.dispose();
      keyGeo.dispose();
      lidGeo.dispose();
      particleGeo.dispose();
      materialsRef.current.forEach((m) => m.dispose());
    };
  }, [mode, wireframeMode, prefersReduced]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl bg-[#090A0F]/90 border border-white/[0.12] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9),0_0_50px_rgba(45,104,255,0.18)] overflow-hidden group select-none"
    >
      {/* Dynamic ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#2D68FF]/15 via-transparent to-[#2D68FF]/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#2D68FF]/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Top Visual HUD Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A0B10]/85 backdrop-blur-md border border-white/10 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#2D68FF] animate-pulse" />
          <span className="text-[11px] font-mono text-[#F8F9FD] tracking-wider uppercase">
            {mode === 'three' ? 'APEX VIP Onboarding Vault (3D Model)' : 'Spline 3D Scene'}
          </span>
        </div>

        {/* Mode & Action Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0A0B10]/85 backdrop-blur-md border border-white/10 shadow-lg">
          {mode === 'three' && (
            <button
              onClick={() => setIsVaultOpen((prev) => !prev)}
              title="Click to Open/Close Vault Lid"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                isVaultOpen
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-[#2D68FF] text-white font-semibold shadow-[0_0_10px_rgba(45,104,255,0.5)]'
              }`}
            >
              {isVaultOpen ? (
                <>
                  <Unlock className="w-3 h-3 text-emerald-400" />
                  <span>Vault Open</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-white" />
                  <span>Open Vault</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setMode('three')}
            title="Switch to Three.js Vault Model"
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
              mode === 'three'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-[#858B9E] hover:text-white'
            }`}
          >
            3D Vault
          </button>
          <button
            onClick={() => setMode('spline')}
            title="Switch to Spline Scene"
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
            alt="APEX 3D Vault Poster"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono text-[#F8F9FD]">
            <span>Reduced Motion Mode • Static Poster Active</span>
          </div>
        </div>
      ) : (
        <>
          {/* Mode 1: Three.js Interactive WebGL 3D Vault */}
          {mode === 'three' && (
            <div
              className="w-full h-full relative cursor-grab active:cursor-grabbing"
              onClick={() => setIsVaultOpen((prev) => !prev)}
              title="Click to toggle vault lid open/closed"
            >
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
            Fabricating 3D Vault Chassis...
          </div>
        </div>
      )}

      {/* Bottom Telemetry HUD */}
      <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#858B9E] bg-black/65 backdrop-blur-md px-3 py-1 rounded-lg border border-white/[0.08]">
          <Rotate3d className="w-3.5 h-3.5 text-[#2D68FF]" />
          <span>Drag to Rotate • Click Vault to Open Lid</span>
        </div>
        <div className="text-[10px] font-mono text-[#5A8BFF] bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#2D68FF]/30 hidden sm:block">
          6061-T6 Anodized Milled Spec
        </div>
      </div>
    </div>
  );
};

export default Hero3DVisual;
