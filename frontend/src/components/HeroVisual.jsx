import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export default function HeroVisual() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // --- Create Glow Texture for Particles ---
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createParticleTexture();

    // --- Procedural Reaching Hand Geometry ---
    // Modeled after Michelangelo's Creation of Adam: index finger extended, others softly curled.
    function createReachingHandPoints(isAI = true) {
      const positions = [];
      const colors = [];
      const sizes = [];
      const baseColor = isAI ? new THREE.Color(0xa855f7) : new THREE.Color(0xf43f5e);
      const highlightColor = isAI ? new THREE.Color(0x38bdf8) : new THREE.Color(0xfdba74);

      // 1. Forearm & Wrist
      for (let i = 0; i < 400; i++) {
        const t = Math.random();
        const r = (0.2 + t * 0.15) * Math.sqrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        const x = -1.8 + t * 0.8;
        const y = Math.sin(theta) * r - 0.2;
        const z = Math.cos(theta) * r;

        positions.push(x, y, z);
        const mixed = baseColor.clone().lerp(highlightColor, t * 0.5);
        colors.push(mixed.r, mixed.g, mixed.b);
        sizes.push((1 - t * 0.3) * 0.04);
      }

      // 2. Palm & Metacarpals
      for (let i = 0; i < 600; i++) {
        const u = Math.random();
        const v = Math.random();
        const x = -1.0 + u * 0.6;
        const y = (v - 0.5) * 0.5 - 0.1;
        const z = (Math.random() - 0.5) * 0.25;

        positions.push(x, y, z);
        const mixed = baseColor.clone().lerp(highlightColor, 0.3 + u * 0.4);
        colors.push(mixed.r, mixed.g, mixed.b);
        sizes.push(0.035);
      }

      // 3. Fingers
      const fingerConfigs = [
        // Index: extended straight out towards center!
        { length: 0.8, curl: 0.05, spread: 0.05, count: 350, reach: true },
        // Middle: slightly curled
        { length: 0.75, curl: 0.4, spread: -0.1, count: 250, reach: false },
        // Ring: more curled
        { length: 0.65, curl: 0.6, spread: -0.22, count: 200, reach: false },
        // Pinky: fully curled
        { length: 0.5, curl: 0.8, spread: -0.32, count: 180, reach: false },
        // Thumb: abducted
        { length: 0.55, curl: 0.2, spread: 0.35, count: 220, isThumb: true },
      ];

      fingerConfigs.forEach((f) => {
        for (let j = 0; j < f.count; j++) {
          const t = j / f.count; // 0 to 1
          let x, y, z;

          if (f.reach) {
            // Index finger pointing sharply towards origin (0, 0, 0)
            x = -0.4 + t * f.length;
            y = -0.05 + Math.sin(t * Math.PI) * 0.05;
            z = t * f.spread * 0.5;
          } else if (f.isThumb) {
            x = -0.7 + t * f.length * 0.7;
            y = -0.2 - t * 0.3;
            z = t * f.spread + 0.1;
          } else {
            // Curled inward
            const angle = t * f.curl * Math.PI;
            x = -0.4 + Math.cos(angle) * (t * f.length);
            y = -0.1 - Math.sin(angle) * (t * f.length * 0.8);
            z = f.spread * 0.6 + (Math.random() - 0.5) * 0.05;
          }

          // Jitter for organic particle cloud feel
          x += (Math.random() - 0.5) * 0.04;
          y += (Math.random() - 0.5) * 0.04;
          z += (Math.random() - 0.5) * 0.04;

          positions.push(x, y, z);
          // Tips glow brighter
          const glow = f.reach ? t * 0.8 : t * 0.3;
          const mixed = baseColor.clone().lerp(highlightColor, glow);
          colors.push(mixed.r, mixed.g, mixed.b);
          sizes.push(f.reach && t > 0.8 ? 0.055 : 0.035);
        }
      });

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
      return geo;
    }

    const handMaterial = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // AI Hand (Left, reaching right)
    const aiGeo = createReachingHandPoints(true);
    const aiHand = new THREE.Points(aiGeo, handMaterial);
    aiHand.position.set(-0.8, 0, 0);
    scene.add(aiHand);

    // Human Hand (Right, reaching left, flipped)
    const humanGeo = createReachingHandPoints(false);
    const humanHand = new THREE.Points(humanGeo, handMaterial);
    humanHand.rotation.y = Math.PI; // Flip to face center
    humanHand.rotation.z = Math.PI; // Invert to mirror anatomical hand
    humanHand.position.set(0.8, 0, 0);
    scene.add(humanHand);

    // --- Floating Ambient Dust/Energy Spores ---
    const dustCount = 400;
    const dustPositions = [];
    const dustColors = [];
    for (let i = 0; i < dustCount; i++) {
      dustPositions.push(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      );
      const color = Math.random() > 0.5 ? new THREE.Color(0xa855f7) : new THREE.Color(0x38bdf8);
      dustColors.push(color.r, color.g, color.b);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute('color', new THREE.Float32BufferAttribute(dustColors, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // --- Centerpiece Core (Floating Polyhedron + Quantum Rings) ---
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner glowing crystal
    const crystalGeo = new THREE.OctahedronGeometry(0.35, 0);
    const crystalMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    coreGroup.add(crystal);

    // Solid inner core
    const solidGeo = new THREE.OctahedronGeometry(0.2, 0);
    const solidMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const solidCore = new THREE.Mesh(solidGeo, solidMat);
    coreGroup.add(solidCore);

    // Outer Gyro Rings
    const createRing = (radius, color) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.006, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });
      return new THREE.Mesh(ringGeo, ringMat);
    };

    const ring1 = createRing(0.55, 0xa855f7);
    const ring2 = createRing(0.68, 0xec4899);
    const ring3 = createRing(0.82, 0x38bdf8);
    coreGroup.add(ring1);
    coreGroup.add(ring2);
    coreGroup.add(ring3);

    // --- Interactive Mouse Dynamics ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // --- Render Loop ---
    let animationFrameId;
    let clock = new THREE.Clock();

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();

      // Smooth camera / group parallax
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x = targetX * 0.4;
      camera.position.y = targetY * 0.3;
      camera.lookAt(0, 0, 0);

      // Core rotation
      crystal.rotation.x = elapsed * 0.6;
      crystal.rotation.y = elapsed * 0.8;
      solidCore.rotation.x = -elapsed * 0.8;
      solidCore.rotation.y = -elapsed * 0.6;

      ring1.rotation.x = elapsed * 0.4;
      ring1.rotation.y = elapsed * 0.3;
      ring2.rotation.y = -elapsed * 0.5;
      ring2.rotation.z = elapsed * 0.2;
      ring3.rotation.x = -elapsed * 0.3;
      ring3.rotation.z = -elapsed * 0.4;

      // Pulse the hands slightly toward each other
      const tension = Math.sin(elapsed * 1.5) * 0.05;
      aiHand.position.x = -0.8 + tension;
      humanHand.position.x = 0.8 - tension;

      // Drift dust
      dust.rotation.y = elapsed * 0.02;

      renderer.render(scene, camera);
    };

    render();

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[550px] md:h-[650px] flex items-center justify-center pointer-events-none">
      <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-auto" />
      {/* Background Soft Glow Under the Hands */}
      <div className="absolute w-[500px] h-[300px] bg-gradient-to-r from-purple-600/15 via-sky-500/10 to-rose-500/15 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
