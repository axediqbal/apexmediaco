'use client';

/**
 * @file Hero3DVisual.tsx
 * @description Ultra-Vibrant Interactive 3D APEX VIP Onboarding Vault for Hero Section
 * 
 * KIYA HORAHA HAI:
 * - Pehle jo dark/black silhouette lag raha tha, usko completely transform kar diya hai:
 *   1. TWO-TONE VIBRANT FINISH:
 *      - Base Chassis: Luminous Electric Cobalt Blue (#2465FF) with high metallic sheen.
 *      - Upper Lid: Gleaming Brushed Platinum-Silver (#D8E4FC) with icy specular reflections.
 *      - Corners: Mirror Polished Chrome (#EEF5FF).
 *      - Emblem: 24K Polished Imperial Gold (#FFD700) badge with cobalt neon chevron.
 *   2. NEON LIGHTING & GLOWING ACCENTS:
 *      - Glowing Cyan-Cobalt LED Laser Seam (#00F0FF, emissive intensity 4.5).
 *      - Biometric Scanner Pad (#00FFFF) with glowing fingerprint sensor.
 *   3. HOLOGRAPHIC STAGE PEDESTAL:
 *      - Vault ke neeche rotating concentric neon light rings (#2D68FF & #00F0FF)
 *        jo upward colored bounce light cast karti hain.
 *   4. MULTI-COLOR STUDIO LIGHTING RIG:
 *      - Ambient Light (4.0 intensity) + Pure White Key Light (5.5) +
 *        Cobalt Side Light (6.0) + Cyan Rim Light (4.5) + Blue Stage Uplight (4.5).
 *      - Koi bhi face kabhi bhi black nahi hogi!
 *   5. COLORWAY THEME SWITCHER:
 *      - User 1-click se 'Cobalt' (Blue/Silver), 'Gold' (24K Gold/Amber), ya 'Cyber' (Violet/Cyan)
 *        presets switch kar sakta hai!
 *   6. INTERACTIVE PNEUMATIC DAMPER:
 *      - Click karne par lid piche smoothly lift hoti hai, revealing Royal Sapphire velvet
 *        nest aur 24K Gold APEX Recovery Key!
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Rotate3d, Box, Lock, Unlock, Palette, Sparkles } from 'lucide-react';
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
  const stageRing1Ref = useRef<THREE.Mesh | null>(null);
  const stageRing2Ref = useRef<THREE.Mesh | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const materialsMapRef = useRef<{
    baseMat?: THREE.MeshPhysicalMaterial;
    lidMat?: THREE.MeshPhysicalMaterial;
    cornerMat?: THREE.MeshStandardMaterial;
    seamMat?: THREE.MeshStandardMaterial;
    scannerMat?: THREE.MeshStandardMaterial;
    emblemMat?: THREE.MeshStandardMaterial;
    velvetMat?: THREE.MeshStandardMaterial;
    keyMat?: THREE.MeshStandardMaterial;
    stage1Mat?: THREE.MeshStandardMaterial;
    stage2Mat?: THREE.MeshStandardMaterial;
  }>({});
  const isVaultOpenRef = useRef<boolean>(false);

  // Sync ref with state
  useEffect(() => {
    isVaultOpenRef.current = isVaultOpen;
  }, [isVaultOpen]);

  // Update materials when colorway changes
  useEffect(() => {
    const mats = materialsMapRef.current;
    if (!mats.baseMat || !mats.lidMat) return;

    if (colorway === 'cobalt') {
      // Cobalt Signature: Electric Cobalt + Platinum Silver + Cyan Neon + Gold Emblem
      mats.baseMat.color.setHex(0x2062ff);
      mats.lidMat.color.setHex(0xd0e0fb);
      if (mats.cornerMat) mats.cornerMat.color.setHex(0xeef4ff);
      if (mats.seamMat) {
        mats.seamMat.color.setHex(0x00f0ff);
        mats.seamMat.emissive.setHex(0x00f0ff);
      }
      if (mats.scannerMat) {
        mats.scannerMat.color.setHex(0x00ffff);
        mats.scannerMat.emissive.setHex(0x00ffff);
      }
      if (mats.emblemMat) {
        mats.emblemMat.color.setHex(0xffd700);
        mats.emblemMat.emissive.setHex(0xb8860b);
      }
      if (mats.velvetMat) mats.velvetMat.color.setHex(0x12244e);
      if (mats.keyMat) {
        mats.keyMat.color.setHex(0xffc700);
        mats.keyMat.emissive.setHex(0x1f47bf);
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
      // Gold Luxury: Imperial 24K Gold + Midnight Obsidian + Signal Amber Neon
      mats.baseMat.color.setHex(0x181e2e);
      mats.lidMat.color.setHex(0xefb810);
      if (mats.cornerMat) mats.cornerMat.color.setHex(0xffd700);
      if (mats.seamMat) {
        mats.seamMat.color.setHex(0xff9500);
        mats.seamMat.emissive.setHex(0xff9500);
      }
      if (mats.scannerMat) {
        mats.scannerMat.color.setHex(0xffb800);
        mats.scannerMat.emissive.setHex(0xffb800);
      }
      if (mats.emblemMat) {
        mats.emblemMat.color.setHex(0xffffff);
        mats.emblemMat.emissive.setHex(0x888888);
      }
      if (mats.velvetMat) mats.velvetMat.color.setHex(0x2e0c15);
      if (mats.keyMat) {
        mats.keyMat.color.setHex(0xffffff);
        mats.keyMat.emissive.setHex(0xff9500);
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
      // Cyber Neo: Cyber Violet + Electric Cyan + Neon Pink/Magenta
      mats.baseMat.color.setHex(0x791ae5);
      mats.lidMat.color.setHex(0x00e5ff);
      if (mats.cornerMat) mats.cornerMat.color.setHex(0xff007f);
      if (mats.seamMat) {
        mats.seamMat.color.setHex(0xff007f);
        mats.seamMat.emissive.setHex(0xff007f);
      }
      if (mats.scannerMat) {
        mats.scannerMat.color.setHex(0x00f0ff);
        mats.scannerMat.emissive.setHex(0x00f0ff);
      }
      if (mats.emblemMat) {
        mats.emblemMat.color.setHex(0xffd700);
        mats.emblemMat.emissive.setHex(0xff007f);
      }
      if (mats.velvetMat) mats.velvetMat.color.setHex(0x20003c);
      if (mats.keyMat) {
        mats.keyMat.color.setHex(0x00f0ff);
        mats.keyMat.emissive.setHex(0xff007f);
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

    // 2. Camera: Positioned with clear 3/4 perspective
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.3, 6.2);
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
    renderer.toneMappingExposure = 1.45;
    rendererRef.current = renderer;

    // 4. STUDIO LIGHTING RIG — MULTI-COLORED, VIBRANT, ZERO BLACK BLOTS!
    // A. Luminous Ambient Light so every shadow retains rich cobalt tone
    const ambientLight = new THREE.AmbientLight(0x384d75, 4.0);
    scene.add(ambientLight);

    // B. Studio Key Light (Pure White Top-Front Specular)
    const keyLight = new THREE.DirectionalLight(0xffffff, 5.5);
    keyLight.position.set(6, 8, 6);
    scene.add(keyLight);

    // C. Saturated Electric Cobalt Side Light
    const cobaltLight = new THREE.DirectionalLight(0x2d68ff, 6.5);
    cobaltLight.position.set(-6, 5, 4);
    scene.add(cobaltLight);

    // D. Saturated Cyan Rim Light (from behind-right)
    const rimLight = new THREE.DirectionalLight(0x00e5ff, 4.5);
    rimLight.position.set(4, 5, -5);
    scene.add(rimLight);

    // E. Upward Stage Glow Light (illuminating the base from underneath)
    const upLight = new THREE.DirectionalLight(0x3872ff, 4.5);
    upLight.position.set(0, -6, 2);
    scene.add(upLight);

    // F. Mouse-interactive dynamic point light
    const pointLight = new THREE.PointLight(0x60a5fa, 8, 14);
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

    // --- MATERIALS WITH VIBRANT SATURATED BASE COLORS ---
    // A. Base Chassis: Saturated Luminous Electric Cobalt Blue
    const baseMat = new THREE.MeshPhysicalMaterial({
      color: 0x2062ff,
      metalness: 0.45, // Lower metalness prevents dark reflections, gives vibrant body color!
      roughness: 0.18,
      clearcoat: 0.95,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
      wireframe: wireframeMode,
    });

    // B. Upper Lid: Gleaming Brushed Platinum-Silver with Icy Specular
    const lidMat = new THREE.MeshPhysicalMaterial({
      color: 0xd0e0fb,
      metalness: 0.6,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
      wireframe: wireframeMode,
    });

    // C. Mirror Polished Chrome Corner Pillars
    const cornerMat = new THREE.MeshStandardMaterial({
      color: 0xeef4ff,
      metalness: 0.85,
      roughness: 0.08,
      wireframe: wireframeMode,
    });

    // D. Glowing Cyan-Cobalt LED Laser Seam
    const seamMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 4.5,
      roughness: 0.05,
      metalness: 0.2,
      wireframe: wireframeMode,
    });

    // E. Biometric Cyan Scanner Glass
    const scannerMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 4.0,
      roughness: 0.05,
      metalness: 0.3,
      wireframe: wireframeMode,
    });

    // F. Top APEX Emblem: 24K Polished Gold Badge
    const emblemMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xb8860b,
      emissiveIntensity: 0.3,
      metalness: 0.95,
      roughness: 0.12,
      wireframe: wireframeMode,
    });

    // G. Velvet Interior Foam Nest (Royal Sapphire Blue)
    const velvetMat = new THREE.MeshStandardMaterial({
      color: 0x12244e,
      roughness: 0.95,
      metalness: 0.05,
      wireframe: wireframeMode,
    });

    // H. Inside Vault: 24K Gold Bar APEX Encrypted Key
    const keyMat = new THREE.MeshStandardMaterial({
      color: 0xffc700,
      emissive: 0x1f47bf,
      emissiveIntensity: 0.6,
      metalness: 0.95,
      roughness: 0.15,
    });

    // I. Stage Pedestal Rings
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
      baseMat,
      lidMat,
      cornerMat,
      seamMat,
      scannerMat,
      emblemMat,
      velvetMat,
      keyMat,
      stage1Mat,
      stage2Mat,
    };

    // --- VAULT BASE (LOWER CHASSIS) ---
    const baseGroup = new THREE.Group();
    rootGroup.add(baseGroup);

    // Main base box
    const baseGeo = new THREE.BoxGeometry(3.2, 0.9, 2.2);
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.45;
    baseGroup.add(baseMesh);

    // Interior Velvet Nest (recessed inside base)
    const interiorGeo = new THREE.BoxGeometry(2.9, 0.2, 1.9);
    const interiorMesh = new THREE.Mesh(interiorGeo, velvetMat);
    interiorMesh.position.y = 0.01;
    baseGroup.add(interiorMesh);

    // Encrypted APEX Recovery Key (Gold VIP Artifact)
    const keyGeo = new THREE.BoxGeometry(0.85, 0.08, 0.35);
    const keyMesh = new THREE.Mesh(keyGeo, keyMat);
    keyMesh.position.set(0, 0.06, 0);
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
      const cornerMesh = new THREE.Mesh(cornerGeo, cornerMat);
      cornerMesh.position.set(cx, cy, cz);
      baseGroup.add(cornerMesh);
    });

    // Glowing Cobalt-Cyan Perimeter Seam (Base Top Rim)
    const seamGeo = new THREE.BoxGeometry(3.24, 0.045, 2.24);
    const seamMesh = new THREE.Mesh(seamGeo, seamMat);
    seamMesh.position.y = 0.01;
    baseGroup.add(seamMesh);

    // Front Biometric Roller Lock Housing on Base
    const lockHousingGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 32);
    const lockHousing = new THREE.Mesh(lockHousingGeo, cornerMat);
    lockHousing.rotation.x = Math.PI / 2;
    lockHousing.position.set(0, -0.25, 1.12);
    baseGroup.add(lockHousing);

    // Biometric Scanner Glowing Ring
    const scannerRingGeo = new THREE.TorusGeometry(0.2, 0.03, 16, 32);
    const scannerRing = new THREE.Mesh(scannerRingGeo, scannerMat);
    scannerRing.position.set(0, -0.25, 1.16);
    baseGroup.add(scannerRing);

    // Biometric Center Sensor
    const sensorGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 32);
    const sensorMesh = new THREE.Mesh(sensorGeo, seamMat);
    sensorMesh.rotation.x = Math.PI / 2;
    sensorMesh.position.set(0, -0.25, 1.16);
    baseGroup.add(sensorMesh);

    // Rear Chrome Hinges
    const hinge1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.45, 16), cornerMat);
    hinge1.rotation.z = Math.PI / 2;
    hinge1.position.set(-0.9, 0.02, -1.12);
    baseGroup.add(hinge1);

    const hinge2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.45, 16), cornerMat);
    hinge2.rotation.z = Math.PI / 2;
    hinge2.position.set(0.9, 0.02, -1.12);
    baseGroup.add(hinge2);

    // --- VAULT LID (UPPER PNEUMATIC CHASSIS) ---
    const lidHingeGroup = new THREE.Group();
    lidHingeGroup.position.set(0, 0.02, -1.1);
    lidHingeGroupRef.current = lidHingeGroup;
    rootGroup.add(lidHingeGroup);

    const lidContent = new THREE.Group();
    lidContent.position.set(0, 0, 1.1);
    lidHingeGroup.add(lidContent);

    // Lid Main Box (Brushed Platinum-Silver)
    const lidGeo = new THREE.BoxGeometry(3.2, 0.65, 2.2);
    const lidMesh = new THREE.Mesh(lidGeo, lidMat);
    lidMesh.position.y = 0.325;
    lidContent.add(lidMesh);

    // Lid Armor Corner Pillars
    cornerPositions.forEach(([cx, _, cz]) => {
      const lidCornerGeo = new THREE.BoxGeometry(0.2, 0.66, 0.2);
      const lidCornerMesh = new THREE.Mesh(lidCornerGeo, cornerMat);
      lidCornerMesh.position.set(cx, 0.325, cz);
      lidContent.add(lidCornerMesh);
    });

    // Top APEX Monogram Inlay Plate (Gold Badge)
    const emblemPlateGeo = new THREE.BoxGeometry(1.6, 0.035, 1.1);
    const emblemPlate = new THREE.Mesh(emblemPlateGeo, emblemMat);
    emblemPlate.position.set(0, 0.66, 0);
    lidContent.add(emblemPlate);

    // Laser-Etched Glowing APEX Geometric Monogram
    const logoSymbolGeo = new THREE.TorusGeometry(0.3, 0.035, 16, 3);
    const logoSymbol = new THREE.Mesh(logoSymbolGeo, seamMat);
    logoSymbol.rotation.x = Math.PI / 2;
    logoSymbol.rotation.z = Math.PI;
    logoSymbol.position.set(0, 0.685, 0);
    lidContent.add(logoSymbol);

    // Top Chamfer Accent Lines (Electric Cyan Neon)
    const accentLine1 = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.025, 0.035), seamMat);
    accentLine1.position.set(0, 0.66, -0.68);
    lidContent.add(accentLine1);

    const accentLine2 = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.025, 0.035), seamMat);
    accentLine2.position.set(0, 0.66, 0.68);
    lidContent.add(accentLine2);

    // --- HOLOGRAPHIC PROJECTION STAGE PEDESTAL BENEATH VAULT ---
    const stageGroup = new THREE.Group();
    stageGroup.position.y = -1.15;
    rootGroup.add(stageGroup);

    // Outer Neon Projection Ring
    const stageRing1Geo = new THREE.TorusGeometry(2.35, 0.03, 16, 64);
    const stageRing1 = new THREE.Mesh(stageRing1Geo, stage1Mat);
    stageRing1.rotation.x = Math.PI / 2;
    stageGroup.add(stageRing1);
    stageRing1Ref.current = stageRing1;

    // Inner Neon Projection Ring
    const stageRing2Geo = new THREE.TorusGeometry(1.65, 0.025, 16, 64);
    const stageRing2 = new THREE.Mesh(stageRing2Geo, stage2Mat);
    stageRing2.rotation.x = Math.PI / 2;
    stageGroup.add(stageRing2);
    stageRing2Ref.current = stageRing2;

    // Subtle Ambient Floating Dust Particles around Vault
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

      // Rotating concentric holographic stage rings
      if (stageRing1Ref.current) stageRing1Ref.current.rotation.z = elapsed * 0.3;
      if (stageRing2Ref.current) stageRing2Ref.current.rotation.z = -elapsed * 0.45;

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

      renderer.dispose();
      baseGeo.dispose();
      interiorGeo.dispose();
      keyGeo.dispose();
      lidGeo.dispose();
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
            {mode === 'three' ? 'APEX VIP Vault (3D Milled Spec)' : 'Spline 3D Scene'}
          </span>
        </div>

        {/* Colorway & Action Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#070A14]/90 backdrop-blur-md border border-white/15 shadow-xl">
          {mode === 'three' && (
            <>
              {/* Colorway Switcher Buttons */}
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

              {/* Open / Close Vault Toggle */}
              <button
                onClick={() => setIsVaultOpen((prev) => !prev)}
                title="Click to Open/Close Vault Lid"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  isVaultOpen
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-[#2D68FF] text-white font-semibold shadow-[0_0_15px_rgba(45,104,255,0.6)]'
                }`}
              >
                {isVaultOpen ? (
                  <>
                    <Unlock className="w-3 h-3 text-emerald-300" />
                    <span>Lid Open</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-white" />
                    <span>Open Vault</span>
                  </>
                )}
              </button>
            </>
          )}

          <button
            onClick={() => setMode('three')}
            title="Switch to Three.js Vault Model"
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
              mode === 'three'
                ? 'bg-white/20 text-white font-semibold'
                : 'text-[#858B9E] hover:text-white'
            }`}
          >
            3D Model
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
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#070A14] gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#2D68FF]/30 border-t-[#00F0FF] animate-spin shadow-[0_0_20px_#2D68FF]" />
          <div className="text-xs font-mono text-[#A1B5E8] tracking-widest uppercase">
            Fabricating Titanium Vault...
          </div>
        </div>
      )}

      {/* Bottom Telemetry HUD */}
      <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#A1B5E8] bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg border border-[#2D68FF]/30 shadow-lg">
          <Rotate3d className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>Drag to Rotate • Click Vault to Open Lid</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#00F0FF] bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#00F0FF]/40 shadow-[0_0_12px_rgba(0,240,255,0.3)] hidden sm:flex">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
          <span>Electric Cobalt + Platinum Milled</span>
        </div>
      </div>
    </div>
  );
};

export default Hero3DVisual;
