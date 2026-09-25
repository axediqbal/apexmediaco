'use client';

/**
 * @file Hero3DVisual.tsx
 * @description Authentic 3D APEX Safe Vault (safe_vault.glb) with PBR Metallic Theming
 * 
 * KIYA HORAHA HAI:
 * - Public folder mein mojud user ke 3D model 'safe_vault.glb' ko load karta hai via Three.js GLTFLoader.
 * - Model ko auto-center aur auto-scale karta hai taake camera viewport mein perfectly fit ho.
 * - REALISTIC APEX LUXURY THEME:
 *   1. Outer Chassis: Deep Anodized Titanium Gunmetal with blue pearlescence.
 *   2. Vault Door Panel: Saturated APEX Electric Cobalt Blue (#2264FF).
 *   3. Combination Lock Wheel: 24K Polished Imperial Gold (#FFD700) with specular glint.
 *   4. Heavy Locking Bolts & Hinges: Mirror-polished Chrome Platinum Steel (#EEF4FF).
 *   5. Biometric Center Hub: Luminous Cyan Laser Core (#00F0FF, emissive intensity 3.8).
 * - Interactive Dial Spin: User click kare ya lock dial rotate ho with realistic inertia.
 * - Drag-to-Rotate, Studio Multi-point Lighting, Holographic Pedestal, Colorway Theme Switcher.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Rotate3d, Box, Lock, Unlock, Palette, Sparkles, RefreshCw } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type Colorway = 'cobalt' | 'gold' | 'cyber';

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
  const [colorway, setColorway] = useState<Colorway>('cobalt');
  const [isLoading, setIsLoading] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [isDialSpinning, setIsDialSpinning] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  // Animation & Three.js references
  const animFrameRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false, prevX: 0, prevY: 0 });
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const vaultModelRef = useRef<THREE.Group | null>(null);
  const wheelNodesRef = useRef<THREE.Object3D[]>([]);
  const stageRing1Ref = useRef<THREE.Mesh | null>(null);
  const stageRing2Ref = useRef<THREE.Mesh | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const materialsMapRef = useRef<{
    chassisMat?: THREE.MeshPhysicalMaterial;
    doorMat?: THREE.MeshPhysicalMaterial;
    wheelMat?: THREE.MeshStandardMaterial;
    boltsMat?: THREE.MeshStandardMaterial;
    coreMat?: THREE.MeshStandardMaterial;
    stage1Mat?: THREE.MeshStandardMaterial;
    stage2Mat?: THREE.MeshStandardMaterial;
  }>({});

  // Trigger combination wheel spin animation
  const handleSpinDial = () => {
    setIsDialSpinning(true);
    setTimeout(() => setIsDialSpinning(false), 2400);
  };

  // Update materials when colorway changes
  useEffect(() => {
    const mats = materialsMapRef.current;
    if (!mats.chassisMat || !mats.doorMat) return;

    if (colorway === 'cobalt') {
      // Cobalt Signature: Gunmetal Chassis + Electric Cobalt Door + 24K Gold Wheel + Cyan Laser
      mats.chassisMat.color.setHex(0x1a2336);
      mats.doorMat.color.setHex(0x2264ff);
      if (mats.wheelMat) {
        mats.wheelMat.color.setHex(0xffd700);
        mats.wheelMat.emissive.setHex(0x4a3600);
      }
      if (mats.boltsMat) mats.boltsMat.color.setHex(0xeef4ff);
      if (mats.coreMat) {
        mats.coreMat.color.setHex(0x00f0ff);
        mats.coreMat.emissive.setHex(0x00f0ff);
      }
      if (mats.stage1Mat) {
        mats.stage1Mat.color.setHex(0x2d68ff);
        mats.stage1Mat.emissive.setHex(0x2d68ff);
      }
      if (mats.stage2Mat) {
        mats.stage2Mat.color.setHex(0x00f0ff);
        mats.stage2Mat.emissive.setHex(0x00f0ff);
      }
    } else if (colorway === 'gold') {
      // Gold Luxury: Obsidian Chassis + 24K Imperial Gold Door + Platinum Wheel + Amber Laser
      mats.chassisMat.color.setHex(0x0f1420);
      mats.doorMat.color.setHex(0xefb810);
      if (mats.wheelMat) {
        mats.wheelMat.color.setHex(0xffffff);
        mats.wheelMat.emissive.setHex(0x555555);
      }
      if (mats.boltsMat) mats.boltsMat.color.setHex(0xffd700);
      if (mats.coreMat) {
        mats.coreMat.color.setHex(0xff9500);
        mats.coreMat.emissive.setHex(0xff9500);
      }
      if (mats.stage1Mat) {
        mats.stage1Mat.color.setHex(0xff9500);
        mats.stage1Mat.emissive.setHex(0xff9500);
      }
      if (mats.stage2Mat) {
        mats.stage2Mat.color.setHex(0xffd700);
        mats.stage2Mat.emissive.setHex(0xffd700);
      }
    } else if (colorway === 'cyber') {
      // Cyber Neo: Cyber Indigo Chassis + Neon Violet Door + Electric Cyan Wheel + Hot Pink Laser
      mats.chassisMat.color.setHex(0x190833);
      mats.doorMat.color.setHex(0x791ae5);
      if (mats.wheelMat) {
        mats.wheelMat.color.setHex(0x00f0ff);
        mats.wheelMat.emissive.setHex(0x006688);
      }
      if (mats.boltsMat) mats.boltsMat.color.setHex(0xff007f);
      if (mats.coreMat) {
        mats.coreMat.color.setHex(0x00ffff);
        mats.coreMat.emissive.setHex(0x00ffff);
      }
      if (mats.stage1Mat) {
        mats.stage1Mat.color.setHex(0xff007f);
        mats.stage1Mat.emissive.setHex(0xff007f);
      }
      if (mats.stage2Mat) {
        mats.stage2Mat.color.setHex(0x00f0ff);
        mats.stage2Mat.emissive.setHex(0x00f0ff);
      }
    }
  }, [colorway]);

  // Toggle wireframe
  const toggleWireframe = useCallback(() => {
    setWireframeMode((prev) => {
      const next = !prev;
      Object.values(materialsMapRef.current).forEach((mat) => {
        if (mat && 'wireframe' in mat) {
          mat.wireframe = next;
        }
      });
      return next;
    });
  }, []);

  // Initialize Three.js Scene & Load safe_vault.glb
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

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 6.4);
    camera.lookAt(0, 0, 0);

    // 3. Renderer
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
    renderer.toneMappingExposure = 1.45;
    rendererRef.current = renderer;

    // 4. STUDIO LIGHTING RIG — MULTI-COLORED, VIBRANT PBR
    // Luminous Ambient Light so NO face is ever dark
    const ambientLight = new THREE.AmbientLight(0x3a4f78, 4.2);
    scene.add(ambientLight);

    // Studio Key Light (Pure White Top-Right Specular)
    const keyLight = new THREE.DirectionalLight(0xffffff, 5.8);
    keyLight.position.set(6, 8, 6);
    scene.add(keyLight);

    // Saturated Electric Cobalt Light (Left Front)
    const cobaltLight = new THREE.DirectionalLight(0x2d68ff, 6.8);
    cobaltLight.position.set(-6, 4, 4);
    scene.add(cobaltLight);

    // Cyan Rim Light (Back Side)
    const rimLight = new THREE.DirectionalLight(0x00e5ff, 4.8);
    rimLight.position.set(4, 5, -5);
    scene.add(rimLight);

    // Upward Stage Light (From underneath)
    const upLight = new THREE.DirectionalLight(0x3872ff, 4.8);
    upLight.position.set(0, -6, 2);
    scene.add(upLight);

    // Mouse-interactive dynamic point light
    const pointLight = new THREE.PointLight(0x60a5fa, 8, 14);
    pointLight.position.set(0, 2, 4);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // 5. Root Group
    const rootGroup = new THREE.Group();
    // Default initial rotation showing front-three-quarter view
    rootGroup.rotation.x = 0.22;
    rootGroup.rotation.y = -0.42;
    rootGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // --- REALISTIC APEX PBR MATERIALS ---
    // A. Outer Chassis: Deep Anodized Titanium Gunmetal
    const chassisMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a2336,
      metalness: 0.72,
      roughness: 0.22,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      reflectivity: 0.9,
      wireframe: wireframeMode,
    });

    // B. Vault Door Panel: Saturated APEX Electric Cobalt Blue
    const doorMat = new THREE.MeshPhysicalMaterial({
      color: 0x2264ff,
      metalness: 0.52,
      roughness: 0.18,
      clearcoat: 0.95,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
      wireframe: wireframeMode,
    });

    // C. Combination Lock Wheel: 24K Polished Imperial Gold
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.92,
      roughness: 0.14,
      emissive: 0x4a3600,
      emissiveIntensity: 0.2,
      wireframe: wireframeMode,
    });

    // D. Heavy Locking Bolts & Hinge Pins: Mirror Chrome Steel
    const boltsMat = new THREE.MeshStandardMaterial({
      color: 0xeef4ff,
      metalness: 0.96,
      roughness: 0.08,
      wireframe: wireframeMode,
    });

    // E. Biometric Center Hub: Luminous Cyan Laser Core
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 3.8,
      roughness: 0.05,
      metalness: 0.3,
      wireframe: wireframeMode,
    });

    // F. Holographic Stage Pedestal Rings
    const stage1Mat = new THREE.MeshStandardMaterial({
      color: 0x2d68ff,
      emissive: 0x2d68ff,
      emissiveIntensity: 3.5,
    });
    const stage2Mat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 3.0,
    });

    materialsMapRef.current = {
      chassisMat,
      doorMat,
      wheelMat,
      boltsMat,
      coreMat,
      stage1Mat,
      stage2Mat,
    };

    // --- HOLOGRAPHIC PROJECTION STAGE PEDESTAL ---
    const stageGroup = new THREE.Group();
    stageGroup.position.y = -1.25;
    rootGroup.add(stageGroup);

    const stageRing1Geo = new THREE.TorusGeometry(2.45, 0.03, 16, 64);
    const stageRing1 = new THREE.Mesh(stageRing1Geo, stage1Mat);
    stageRing1.rotation.x = Math.PI / 2;
    stageGroup.add(stageRing1);
    stageRing1Ref.current = stageRing1;

    const stageRing2Geo = new THREE.TorusGeometry(1.75, 0.025, 16, 64);
    const stageRing2 = new THREE.Mesh(stageRing2Geo, stage2Mat);
    stageRing2.rotation.x = Math.PI / 2;
    stageGroup.add(stageRing2);
    stageRing2Ref.current = stageRing2;

    // Ambient floating particles
    const particleCount = isMobile ? 35 : 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 6.5;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 5.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.04,
      transparent: true,
      opacity: 0.75,
    });
    const dustParticles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(dustParticles);

    // 6. LOAD safe_vault.glb AND ASSIGN MATERIALS
    const loader = new GLTFLoader();
    loader.load(
      '/safe_vault.glb',
      (gltf) => {
        const vaultGroup = new THREE.Group();
        vaultModelRef.current = vaultGroup;

        // Traverse and apply thematic realistic PBR materials
        wheelNodesRef.current = [];
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const name = mesh.name.toLowerCase();
            const origMatName = (mesh.material as THREE.Material)?.name || '';

            // Wheel / Dial Spokes & Turning Knob
            if (
              name.includes('cylinder001') ||
              name.includes('cylinder002') ||
              name.includes('cylinder003') ||
              name.includes('cylinder004') ||
              name.includes('cylinder005') ||
              origMatName.includes('20')
            ) {
              mesh.material = wheelMat;
              wheelNodesRef.current.push(mesh);
            }
            // Biometric Center Hub / Tumbler Indicator
            else if (
              name.includes('cylinder007') ||
              origMatName.includes('38') ||
              origMatName.includes('37')
            ) {
              mesh.material = coreMat;
              wheelNodesRef.current.push(mesh);
            }
            // Locking Bolts & Hinge Pins
            else if (
              name.includes('cylinder006') ||
              name.includes('cylinder008') ||
              name.includes('cylinder009') ||
              name.includes('cylinder010') ||
              name.includes('cylinder011') ||
              name.includes('cylinder012') ||
              name.includes('cylinder013')
            ) {
              mesh.material = boltsMat;
            }
            // Door Face Plate & Reinforced Insets
            else if (
              name.includes('box009') ||
              name.includes('box010') ||
              name.includes('box011') ||
              name.includes('box012') ||
              name.includes('box013') ||
              name.includes('box014') ||
              name.includes('box017') ||
              name.includes('box018') ||
              name.includes('box019') ||
              name.includes('box020') ||
              origMatName.includes('03')
            ) {
              mesh.material = doorMat;
            }
            // Outer Heavy Armor Chassis & Frame
            else {
              mesh.material = chassisMat;
            }
          }
        });

        // Compute Bounding Box, perfectly center, and auto-scale
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Center the geometry
        gltf.scene.position.x = -center.x;
        gltf.scene.position.y = -center.y;
        gltf.scene.position.z = -center.z;

        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 3.5 / (maxDim || 1);
        vaultGroup.scale.setScalar(scaleFactor);

        vaultGroup.add(gltf.scene);
        rootGroup.add(vaultGroup);

        setIsLoading(false);
      },
      undefined,
      (err) => {
        console.error('Failed to load /safe_vault.glb', err);
        setIsLoading(false);
      }
    );

    // 7. Intersection Observer for Mobile Battery Conservation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // 8. Mouse & Touch Interaction
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

    // 9. Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 10. Animation Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const elapsed = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Update point light position
      if (pointLightRef.current) {
        pointLightRef.current.position.x = mouseRef.current.x * 4;
        pointLightRef.current.position.y = mouseRef.current.y * 3 + 2;
      }

      // Smooth idle floating bobbing & turntable rotation
      if (!mouseRef.current.isDown && rootGroup) {
        rootGroup.position.y = Math.sin(elapsed * 1.3) * 0.07;
        rootGroup.rotation.y += 0.0025;
      }

      // Interactive combination wheel spin
      if (wheelNodesRef.current.length > 0) {
        const spinSpeed = isDialSpinning ? 0.08 : 0.003;
        wheelNodesRef.current.forEach((node) => {
          node.rotation.z += spinSpeed;
        });
      }

      // Rotating concentric holographic stage rings
      if (stageRing1Ref.current) stageRing1Ref.current.rotation.z = elapsed * 0.3;
      if (stageRing2Ref.current) stageRing2Ref.current.rotation.z = -elapsed * 0.45;

      // Dust particles drift
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

      renderer.dispose();
      stageRing1Geo.dispose();
      stageRing2Geo.dispose();
      particleGeo.dispose();
      Object.values(materialsMapRef.current).forEach((m) => m?.dispose());
    };
  }, [mode, wireframeMode, prefersReduced]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl bg-gradient-to-b from-[#0F1424] via-[#090D18] to-[#060810] border border-[#2D68FF]/30 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95),0_0_60px_rgba(45,104,255,0.25)] overflow-hidden group select-none"
    >
      {/* Dynamic colorful ambient background aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#2D68FF]/30 via-transparent to-[#00F0FF]/20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2D68FF]/30 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#2D68FF]/15 to-transparent pointer-events-none" />

      {/* Top Visual HUD Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#070A14]/90 backdrop-blur-md border border-[#2D68FF]/40 shadow-[0_0_15px_rgba(45,104,255,0.3)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_8px_#00F0FF]" />
          <span className="text-[11px] font-mono text-[#F8F9FD] tracking-wider uppercase font-semibold">
            {mode === 'three' ? 'APEX Executive Vault (safe_vault.glb)' : 'Spline 3D Scene'}
          </span>
        </div>

        {/* Colorway & Action Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#070A14]/90 backdrop-blur-md border border-white/15 shadow-xl">
          {mode === 'three' && (
            <>
              {/* Colorway Switcher */}
              <div className="flex items-center gap-1 pr-1 mr-1 border-r border-white/10">
                <button
                  onClick={() => setColorway('cobalt')}
                  title="Cobalt Signature Colorway"
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                    colorway === 'cobalt'
                      ? 'bg-[#2D68FF] text-white shadow-[0_0_10px_#2D68FF] font-bold'
                      : 'text-[#858B9E] hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
                  <span>Cobalt</span>
                </button>

                <button
                  onClick={() => setColorway('gold')}
                  title="24K Gold Luxury Colorway"
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                    colorway === 'gold'
                      ? 'bg-[#EFB810] text-black shadow-[0_0_10px_#EFB810] font-bold'
                      : 'text-[#858B9E] hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#FFD700]" />
                  <span>Gold</span>
                </button>

                <button
                  onClick={() => setColorway('cyber')}
                  title="Cyber Violet Colorway"
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                    colorway === 'cyber'
                      ? 'bg-[#FF007F] text-white shadow-[0_0_10px_#FF007F] font-bold'
                      : 'text-[#858B9E] hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
                  <span>Cyber</span>
                </button>
              </div>

              {/* Spin Dial / Unlock Wheel Action */}
              <button
                onClick={handleSpinDial}
                title="Click to Spin Vault Combination Wheel"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  isDialSpinning
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'bg-[#2D68FF] text-white font-semibold shadow-[0_0_10px_rgba(45,104,255,0.5)]'
                }`}
              >
                <RefreshCw className={`w-3 h-3 ${isDialSpinning ? 'animate-spin' : ''}`} />
                <span>Spin Dial</span>
              </button>
            </>
          )}

          <button
            onClick={() => setMode('three')}
            title="Switch to 3D Safe Vault"
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
              mode === 'three'
                ? 'bg-white/20 text-white font-semibold'
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
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#070A14]">
          <img
            src={posterFallback}
            alt="APEX 3D Safe Vault Poster"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono text-[#F8F9FD]">
            <span>Reduced Motion Mode • Static Poster Active</span>
          </div>
        </div>
      ) : (
        <>
          {/* Mode 1: Three.js Interactive WebGL 3D Safe Vault */}
          {mode === 'three' && (
            <div
              className="w-full h-full relative cursor-grab active:cursor-grabbing"
              onClick={handleSpinDial}
              title="Click and drag to rotate vault • Click to spin combination dial"
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
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#070A14] gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#2D68FF]/30 border-t-[#00F0FF] animate-spin shadow-[0_0_20px_#2D68FF]" />
          <div className="text-xs font-mono text-[#A1B5E8] tracking-widest uppercase">
            Loading 3D Safe Vault Model...
          </div>
        </div>
      )}

      {/* Bottom Telemetry HUD */}
      <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#A1B5E8] bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg border border-[#2D68FF]/30 shadow-lg">
          <Rotate3d className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>Drag to Rotate 360° • Click to Spin Lock Dial</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#00F0FF] bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#00F0FF]/40 shadow-[0_0_12px_rgba(0,240,255,0.3)] hidden sm:flex">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
          <span>safe_vault.glb • 24K Gold & Electric Cobalt PBR</span>
        </div>
      </div>
    </div>
  );
};

export default Hero3DVisual;
