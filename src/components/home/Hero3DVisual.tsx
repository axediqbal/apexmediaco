'use client';

/**
 * @file Hero3DVisual.tsx
 * @description Photorealistic 3D Safe Vault for APEX MEDIA CO.
 * 
 * SPECIFICATIONS:
 * - Color Theme: Locked strictly to authentic "Gold & Steel"
 *   - Outer Armor Chassis & Walls: Heavy Gunmetal Brushed Titanium Steel (#4F5869)
 *   - Open Vault Door Face: Machined Titanium Plate (#64748B) with original brushed metal texture
 *   - Door Inset Plate & Fasteners: 24K Imperial Gold Plate (#D4AF37)
 *   - 5-Spoke Combination Lock Wheel & Hub: Solid Polished 24K Pure Gold (#F59E0B, metalness: 0.98, roughness: 0.08)
 *   - Locking Bolts & Hinge Pins: Mirror-Polished Hardened Chrome Steel (#FFFFFF, metalness: 1.0, roughness: 0.03)
 *   - Interior Vault Cavity: Concealed Warm Golden Downlight (#FFBE3B)
 *   - Presentation Stage: Sleek Dark Obsidian Plinth (#0D121C) with razor-thin cobalt hairline
 * - Interactive: 360° Drag-to-Rotate, Click-to-Spin Combination Wheel
 * - UI: Minimal, clean, distraction-free (control bar removed as requested).
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Rotate3d, Shield } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface Hero3DVisualProps {
  posterFallback?: string;
  splineSceneUrl?: string;
}

export const Hero3DVisual: React.FC<Hero3DVisualProps> = ({
  posterFallback = '/images/agency/ai-creative-lab.jpg',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
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
  const wheelMeshesRef = useRef<THREE.Mesh[]>([]);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const dialRotationRef = useRef<number>(0);

  // Trigger combination wheel spin animation on click
  const handleSpinDial = () => {
    setIsDialSpinning(true);
    setTimeout(() => setIsDialSpinning(false), 2400);
  };

  // Initialize Three.js Scene & Load safe_vault.glb
  useEffect(() => {
    if (prefersReduced) {
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

    // 2. Camera: Positioned for heroic 3D safe showcase
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.2);
    camera.lookAt(0, -0.05, 0);

    // 3. WebGL Renderer with ACES Filmic Tone Mapping & Controlled 1.05 Exposure
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
    renderer.toneMappingExposure = 1.05; // Balanced, prevents flat blown-out white
    rendererRef.current = renderer;

    // 4. Realistic Studio Environment (RoomEnvironment + PMREM)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTexture;

    // 5. BALANCED FIVE-POINT STUDIO LIGHTING (Rich contrast, deep metallic shadows, zero chalk)
    // A. Soft Ambient Base Light
    const ambientLight = new THREE.AmbientLight(0xd5e0ec, 0.85);
    scene.add(ambientLight);

    // B. Studio Key Light (Balanced at 2.4, reveals brushed steel grain and bevel highlights)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    // C. Fill Light (Cool Steel Blue Fill at 1.2)
    const fillLight = new THREE.DirectionalLight(0x94a3b8, 1.2);
    fillLight.position.set(-5, 3, 4);
    scene.add(fillLight);

    // D. Warm Golden Specular Light (Highlights 24K Gold Wheel at 1.5)
    const goldAccentLight = new THREE.DirectionalLight(0xffc857, 1.5);
    goldAccentLight.position.set(3, 0, 4);
    scene.add(goldAccentLight);

    // E. APEX Signature Cobalt Rim Light (Back Chamfer Highlights at 1.8)
    const cobaltRimLight = new THREE.DirectionalLight(0x2d68ff, 1.8);
    cobaltRimLight.position.set(-1, 5, -5);
    scene.add(cobaltRimLight);

    // F. Cursor-Interactive Dynamic Specular Light
    const pointLight = new THREE.PointLight(0xffffff, 1.5, 12);
    pointLight.position.set(0, 2, 4);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // G. Concealed Vault Interior Light (Warm Luxury Glow inside the open safe cavity)
    const interiorLight = new THREE.PointLight(0xffbe3b, 1.8, 10);
    interiorLight.position.set(0.2, 0.6, -0.3);
    scene.add(interiorLight);

    // 6. ROOT TRANSFORMATION GROUP
    const rootGroup = new THREE.Group();
    // Angle showcases the open door, 24K gold combination wheel, chrome locking pins, and illuminated interior
    rootGroup.rotation.x = 0.12;
    rootGroup.rotation.y = Math.PI - 0.72;
    rootGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // 7. PBR MATERIALS FOR AUTHENTIC "GOLD & STEEL" VAULT
    // A. Outer Armor Chassis (Deep Gunmetal Brushed Titanium Steel)
    const matChassis = new THREE.MeshStandardMaterial({
      color: 0x4f5869, // Heavy gunmetal steel
      metalness: 0.85,
      roughness: 0.32,
    });

    // B. Vault Door Face Panel (Machined Titanium Plate)
    const matDoor = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Brushed titanium plate
      metalness: 0.88,
      roughness: 0.25,
    });

    // C. Door Inset Accent Plate & Trim (Rich Brushed 24K Imperial Gold)
    const matInset = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // 24K Imperial Gold Plate
      metalness: 0.92,
      roughness: 0.20,
    });

    // D. 5-Spoke Combination Lock Wheel & Center Hub (Solid Polished 24K Pure Gold)
    const matWheel = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b, // Warm radiant 24K Gold
      metalness: 0.98,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
    });

    // E. Heavy Locking Bolts & Hinge Pins (Mirror-Polished Hardened Chrome)
    const matChrome = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.03,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 1.0,
    });

    // F. Heavy Hinge Blocks (Solid Forged Steel)
    const matHinge = new THREE.MeshStandardMaterial({
      color: 0x334155, // Forged dark steel
      metalness: 0.85,
      roughness: 0.35,
    });

    // G. Biometric Optical Tumbler Core (Electric Cobalt Laser Scanner)
    const matCore = new THREE.MeshStandardMaterial({
      color: 0x0a0e1a,
      emissive: 0x2d68ff,
      emissiveIntensity: 3.5,
      metalness: 0.5,
      roughness: 0.2,
    });

    // --- SLEEK OBSIDIAN PRECISION STAGE (Clean, grounded, no blue dinner plate!) ---
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.y = -1.35;
    rootGroup.add(pedestalGroup);

    // Dark obsidian ground plinth
    const pedestalGeo = new THREE.CylinderGeometry(2.1, 2.2, 0.08, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0d121c, // Dark obsidian
      metalness: 0.5,
      roughness: 0.6,
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalGroup.add(pedestalMesh);

    // Milled Gunmetal Inner Plinth Ring
    const pedestalInnerGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.09, 48);
    const pedestalInnerMat = new THREE.MeshStandardMaterial({
      color: 0x1e2738,
      metalness: 0.85,
      roughness: 0.25,
    });
    const pedestalInnerMesh = new THREE.Mesh(pedestalInnerGeo, pedestalInnerMat);
    pedestalGroup.add(pedestalInnerMesh);

    // Subtle Electric Cobalt Hairline Ring
    const pedestalRimGeo = new THREE.TorusGeometry(2.12, 0.015, 16, 64);
    const pedestalRimMat = new THREE.MeshStandardMaterial({
      color: 0x2d68ff,
      emissive: 0x2d68ff,
      emissiveIntensity: 2.5,
    });
    const pedestalRim = new THREE.Mesh(pedestalRimGeo, pedestalRimMat);
    pedestalRim.rotation.x = Math.PI / 2;
    pedestalRim.position.y = 0.045;
    pedestalGroup.add(pedestalRim);

    // 8. LOAD AND PRECISELY MAP safe_vault.glb (Preserving embedded brushed metal UV maps!)
    const loader = new GLTFLoader();
    loader.load(
      '/safe_vault.glb',
      (gltf) => {
        const vaultGroup = new THREE.Group();
        vaultModelRef.current = vaultGroup;

        wheelMeshesRef.current = [];

        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const name = mesh.name.toLowerCase();
            const origMat = mesh.material as THREE.MeshStandardMaterial;
            const originalTexture = origMat?.map || null;

            // 1. Wheel Spokes & Center Hub (Cylinder001 - Cylinder006) -> 24K Pure Gold
            if (
              name.includes('cylinder001') ||
              name.includes('cylinder002') ||
              name.includes('cylinder003') ||
              name.includes('cylinder004') ||
              name.includes('cylinder005') ||
              name.includes('cylinder006')
            ) {
              mesh.material = matWheel;
              wheelMeshesRef.current.push(mesh);
            }
            // 2. Combination Dial Core / Biometric Indicator (Cylinder007)
            else if (name.includes('cylinder007')) {
              if (name.includes('37') || name.includes('38')) {
                mesh.material = matCore;
              } else {
                mesh.material = matWheel;
              }
              wheelMeshesRef.current.push(mesh);
            }
            // 3. Mirror Chrome Locking Bolts & Hinge Pins (Cylinder008 - Cylinder013)
            else if (
              name.includes('cylinder008') ||
              name.includes('cylinder009') ||
              name.includes('cylinder010') ||
              name.includes('cylinder011') ||
              name.includes('cylinder012') ||
              name.includes('cylinder013')
            ) {
              mesh.material = matChrome;
            }
            // 4. Vault Door Outer Front Face (Box006) -> Titanium with brushed texture
            else if (name.includes('box006')) {
              const doorMat = matDoor.clone();
              if (originalTexture) doorMat.map = originalTexture;
              mesh.material = doorMat;
            }
            // 5. Vault Door Inset / Reinforcement Plate (Box020) -> 24K Imperial Gold Plate
            else if (name.includes('box020')) {
              const insetMat = matInset.clone();
              if (originalTexture) insetMat.map = originalTexture;
              mesh.material = insetMat;
            }
            // 6. Heavy Hinge Blocks (Box007, Box008, Box016) -> Forged Steel
            else if (
              name.includes('box007') ||
              name.includes('box008') ||
              name.includes('box016')
            ) {
              mesh.material = matHinge;
            }
            // 7. Hinge Brackets & Fasteners (Box009-Box014, Box017-Box019) -> 24K Gold Fasteners
            else if (
              name.includes('box009') ||
              name.includes('box010') ||
              name.includes('box011') ||
              name.includes('box012') ||
              name.includes('box013') ||
              name.includes('box014') ||
              name.includes('box017') ||
              name.includes('box018') ||
              name.includes('box019')
            ) {
              const fastenerMat = matInset.clone();
              if (originalTexture) fastenerMat.map = originalTexture;
              mesh.material = fastenerMat;
            }
            // 8. Outer Armor Chassis & Walls (Box001-Box005, Box015) -> Brushed Gunmetal Titanium Steel
            else {
              const chassisMat = matChassis.clone();
              if (originalTexture) chassisMat.map = originalTexture;
              mesh.material = chassisMat;
            }
          }
        });

        // Compute Bounding Box, center, and auto-scale
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Center geometry accurately
        gltf.scene.position.x = -center.x;
        gltf.scene.position.y = -center.y + 0.15;
        gltf.scene.position.z = -center.z;

        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 3.6 / (maxDim || 1);
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

    // 9. Intersection Observer for Mobile CPU/Battery Optimization
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // 10. Smooth Drag-to-Rotate Interaction
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

    // 11. Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 12. Animation Render Loop (High-precision timer without THREE.Clock deprecation)
    const startTime = performance.now();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const elapsed = (performance.now() - startTime) * 0.001;

      // Damped mouse movement for dynamic lighting reflection
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Update point light position with mouse for moving specular glints
      if (pointLightRef.current) {
        pointLightRef.current.position.x = mouseRef.current.x * 4;
        pointLightRef.current.position.y = mouseRef.current.y * 3 + 2;
      }

      // Smooth idle showcase turntable rotation & floating bob
      if (!mouseRef.current.isDown && rootGroup) {
        rootGroup.position.y = Math.sin(elapsed * 1.2) * 0.04;
        rootGroup.rotation.y += 0.0018;
      }

      // Combination dial wheel rotation animation
      const spinSpeed = isDialSpinning ? 0.08 : 0.0015;
      dialRotationRef.current += spinSpeed;
      if (wheelMeshesRef.current.length > 0) {
        wheelMeshesRef.current.forEach((mesh) => {
          mesh.rotation.z = dialRotationRef.current;
        });
      }

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
      pmremGenerator.dispose();
      envTexture.dispose();
      pedestalGeo.dispose();
      pedestalMat.dispose();
      pedestalInnerGeo.dispose();
      pedestalInnerMat.dispose();
      pedestalRimGeo.dispose();
      pedestalRimMat.dispose();
      matChassis.dispose();
      matDoor.dispose();
      matInset.dispose();
      matWheel.dispose();
      matChrome.dispose();
      matHinge.dispose();
      matCore.dispose();
    };
  }, [prefersReduced]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl bg-gradient-to-b from-[#131926] via-[#0E131F] to-[#0A0D14] border border-white/20 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95),0_0_60px_rgba(45,104,255,0.25)] overflow-hidden group select-none"
    >
      {/* Studio Radial Horizon Glow Behind Vault (High-Contrast Backdrop) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.12)_0%,rgba(45,104,255,0.08)_40%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2D68FF]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Visual Badge (Clean, Minimal, No Control Bar) */}
      <div className="absolute top-3 left-3 z-30 pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A0E1A]/90 backdrop-blur-md border border-white/15 shadow-lg">
          <Shield className="w-3.5 h-3.5 text-[#5A8BFF]" />
          <span className="text-[11px] font-mono text-[#F8F9FD] tracking-wider uppercase font-semibold">
            APEX Executive Vault • 24K Gold & Brushed Steel
          </span>
        </div>
      </div>

      {/* Reduced Motion OR Static Poster Fallback */}
      {prefersReduced ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0D121F]">
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
        <div
          className="w-full h-full relative cursor-grab active:cursor-grabbing"
          onClick={handleSpinDial}
          title="Click and drag to rotate vault 360° • Click to spin 24K gold combination wheel"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
          />
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && !prefersReduced && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0D121F] gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-[#FBBF24] animate-spin shadow-[0_0_20px_#FBBF24]" />
          <div className="text-xs font-mono text-[#E2E8F0] tracking-widest uppercase">
            Machining Gold & Steel Vault...
          </div>
        </div>
      )}

      {/* Bottom Telemetry HUD */}
      <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#E2E8F0] bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg border border-white/15 shadow-lg">
          <Rotate3d className="w-3.5 h-3.5 text-[#5A8BFF]" />
          <span>Drag to Rotate 360° • Click to Spin Gold Dial</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#FBBF24] bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#FBBF24]/40 shadow-[0_0_12px_rgba(251,191,36,0.3)] hidden sm:flex">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-ping" />
          <span>24K Gold & Brushed Steel PBR</span>
        </div>
      </div>
    </div>
  );
};

export default Hero3DVisual;


