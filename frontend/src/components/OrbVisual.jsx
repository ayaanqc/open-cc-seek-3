import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * OrbVisual — compact interactive 3D visual: a wireframe icosahedron core
 * wrapped in two orbiting particle shells and gyro rings. The whole orb
 * tilts toward the cursor; scroll velocity spins it. Used beside copy in
 * the Security section.
 */
export default function OrbVisual({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
    camera.position.set(0, 0, 5.2);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch (e) {
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    const orb = new THREE.Group();
    scene.add(orb);

    const sprite = (() => {
      const cv = document.createElement('canvas');
      cv.width = 64;
      cv.height = 64;
      const ctx = cv.getContext('2d');
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.3, 'rgba(255,255,255,0.6)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(cv);
    })();

    // core wireframe
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.85, 1),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.28 })
    );
    orb.add(core);
    const nucleus = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.3, 0),
      new THREE.MeshBasicMaterial({ color: 0xf0abfc, wireframe: true, transparent: true, opacity: 0.9 })
    );
    orb.add(nucleus);

    // two particle shells (fibonacci spheres, violet + cyan)
    const mkShell = (n, r, color, size) => {
      const p = new Float32Array(n * 3);
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < n; i += 1) {
        const y = 1 - (i / (n - 1)) * 2;
        const rad = Math.sqrt(1 - y * y);
        const th = golden * i;
        p[i * 3] = Math.cos(th) * rad * r;
        p[i * 3 + 1] = y * r;
        p[i * 3 + 2] = Math.sin(th) * rad * r;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(p, 3));
      const pts = new THREE.Points(
        g,
        new THREE.PointsMaterial({ size, color, map: sprite, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      orb.add(pts);
      return pts;
    };
    const shellA = mkShell(420, 1.35, 0xa855f7, 0.045);
    const shellB = mkShell(300, 1.7, 0x67e8f9, 0.035);

    // gyro rings
    const mkRing = (r, color) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.005, 10, 128),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending })
      );
      m.rotation.x = Math.PI / 2.4;
      orb.add(m);
      return m;
    };
    const ring1 = mkRing(1.95, 0xec4899);
    const ring2 = mkRing(2.2, 0x38bdf8);

    // cursor tilt + scroll spin
    let mx = 0;
    let my = 0;
    let spin = 0;
    let lastY = window.scrollY;
    const onMove = (e) => {
      const r = container.getBoundingClientRect();
      if (r.width === 0) return;
      mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      my = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const onScroll = () => {
      const y = window.scrollY;
      spin += Math.max(-8, Math.min(8, (y - lastY) * 0.002));
      lastY = y;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const fit = () => {
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    fit();
    window.addEventListener('resize', fit);

    const clock = new THREE.Clock();
    let raf = 0;
    const render = () => {
      const e = clock.getElapsedTime();
      orb.rotation.y += 0.0035 + spin;
      spin *= 0.94;
      orb.rotation.x += ((my * 0.35) - orb.rotation.x) * 0.05;
      orb.rotation.z = mx * 0.12;
      core.rotation.x = e * 0.12;
      nucleus.rotation.y = -e * 0.5;
      shellA.rotation.y = -e * 0.08;
      shellB.rotation.y = e * 0.05;
      ring1.rotation.z = e * 0.3;
      ring2.rotation.z = -e * 0.22;
      const s = 1 + Math.sin(e * 1.6) * 0.02;
      orb.scale.setScalar(s);
      renderer.render(scene, camera);
    };

    if (reduced) {
      render();
    } else {
      // Paint one frame immediately so the orb is never blank before the
      // first animation tick.
      render();
      const info = renderer.info.render;
      container.dataset.paint = `${info.calls}c/${info.points}p`;
      const loop = () => {
        render();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', fit);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/15 blur-[80px]"
      />
    </div>
  );
}
