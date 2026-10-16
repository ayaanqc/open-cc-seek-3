import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * HeroVisual — crystal core with gyro rings, orbiting sparks, starfield
 * and dust. Cursor parallax, responsive fit, reduced-motion static frame.
 */
export default function HeroVisual() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch (e) {
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);

    const sprite = (() => {
      const cv = document.createElement('canvas');
      cv.width = 64;
      cv.height = 64;
      const ctx = cv.getContext('2d');
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.25, 'rgba(255,255,255,0.7)');
      g.addColorStop(0.55, 'rgba(255,255,255,0.18)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(cv);
    })();

    /* ---------------- crystal core ---------------- */
    const core = new THREE.Group();
    core.position.set(0, 0.1, 0);
    world.add(core);

    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.34, 0),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.85 })
    );
    core.add(crystal);
    const solid = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.19, 0),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    core.add(solid);

    const mkRing = (r, color, opacity) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.006, 12, 128),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending })
      );
      core.add(m);
      return m;
    };
    const ring1 = mkRing(0.55, 0xa855f7, 0.6);
    const ring2 = mkRing(0.68, 0xec4899, 0.5);
    const ring3 = mkRing(0.82, 0x38bdf8, 0.45);

    /* orbiting sparks */
    const SPARKS = 130;
    const sparkPos = new Float32Array(SPARKS * 3);
    const sparkSeed = new Float32Array(SPARKS * 2);
    for (let i = 0; i < SPARKS; i += 1) {
      sparkSeed[i * 2] = Math.random() * Math.PI * 2;
      sparkSeed[i * 2 + 1] = 0.55 + Math.random() * 0.5;
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparks = new THREE.Points(
      sparkGeo,
      new THREE.PointsMaterial({ size: 0.05, color: 0xf0abfc, map: sprite, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    core.add(sparks);

    /* ---------------- starfield + dust ---------------- */
    {
      const N = 850;
      const p = new Float32Array(N * 3);
      const c = new Float32Array(N * 3);
      const col = new THREE.Color();
      for (let i = 0; i < N; i += 1) {
        const r = 9 + Math.random() * 12;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(Math.random() * 2 - 1);
        p[i * 3] = r * Math.sin(ph) * Math.cos(th);
        p[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.6;
        p[i * 3 + 2] = r * Math.cos(ph) * 0.5 - 4;
        col.setHSL(0.72 + Math.random() * 0.12, 0.5, 0.25 + Math.random() * 0.35);
        c[i * 3] = col.r;
        c[i * 3 + 1] = col.g;
        c[i * 3 + 2] = col.b;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(p, 3));
      g.setAttribute('color', new THREE.BufferAttribute(c, 3));
      const stars = new THREE.Points(
        g,
        new THREE.PointsMaterial({ size: 0.07, vertexColors: true, map: sprite, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      scene.add(stars);
      scene.userData.stars = stars;
    }
    const dustGeo = new THREE.BufferGeometry();
    {
      const N = 320;
      const p = new Float32Array(N * 3);
      for (let i = 0; i < N; i += 1) {
        p[i * 3] = (Math.random() - 0.5) * 9;
        p[i * 3 + 1] = (Math.random() - 0.5) * 5;
        p[i * 3 + 2] = (Math.random() - 0.5) * 4;
      }
      dustGeo.setAttribute('position', new THREE.BufferAttribute(p, 3));
    }
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ size: 0.035, color: 0x8b8fa8, map: sprite, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    world.add(dust);

    /* ---------------- interaction ---------------- */
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    const onMove = (e) => {
      const r = container.getBoundingClientRect();
      if (r.width === 0) return;
      mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      my = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const fit = () => {
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      // core composition spans roughly ±1.2 units; keep it framed on narrow screens
      const halfW = Math.tan(THREE.MathUtils.degToRad(22.5)) * 6.5 * camera.aspect;
      world.scale.setScalar(Math.min(1, halfW / 1.9));
    };
    fit();
    window.addEventListener('resize', fit);

    /* ---------------- loop ---------------- */
    let raf = 0;

    const render = (t) => {
      const e = t * 0.001;
      tx += (mx - tx) * 0.045;
      ty += (my - ty) * 0.045;
      camera.position.x = tx * 0.5;
      camera.position.y = ty * 0.35;
      camera.lookAt(0, 0, 0);

      core.position.y = 0.1 + Math.sin(e * 1.3) * 0.07;
      core.rotation.y = e * 0.25;
      crystal.rotation.x = e * 0.6;
      solid.rotation.x = -e * 0.8;
      solid.rotation.y = -e * 0.6;
      ring1.rotation.x = e * 0.4;
      ring1.rotation.y = e * 0.3;
      ring2.rotation.y = -e * 0.5;
      ring3.rotation.x = -e * 0.3;
      ring3.rotation.z = -e * 0.4;

      {
        const pos = sparkGeo.attributes.position;
        for (let i = 0; i < SPARKS; i += 1) {
          const a = sparkSeed[i * 2] + e * (0.5 + (i % 5) * 0.14);
          const r = sparkSeed[i * 2 + 1];
          pos.setXYZ(i, Math.cos(a) * r, Math.sin(a * 1.3) * r * 0.7, Math.sin(a) * r);
        }
        pos.needsUpdate = true;
      }

      // core leans gently with the cursor
      core.position.x = tx * 0.12;
      core.position.y = 0.1 + Math.sin(e * 1.3) * 0.07 + ty * 0.08;

      dust.rotation.y = e * 0.02;
      const stars = scene.userData.stars;
      if (stars) stars.rotation.y = e * 0.008;

      renderer.render(scene, camera);
    };

    // First frame painted synchronously — never blank, even throttled.
    render(performance.now());
    if (!reduced) {
      const info = renderer.info.render;
      container.dataset.paint = `${info.calls}c/${info.points}p`;
      const loop = (t) => {
        render(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', fit);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative flex h-[480px] w-full items-center justify-center sm:h-[560px] lg:h-[620px]">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-600/15 via-sky-500/10 to-rose-500/15 blur-[110px]"
      />
    </div>
  );
}
