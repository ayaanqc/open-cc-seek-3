import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/* Small vector helpers (plain arrays, no allocation in hot loops).    */
/* ------------------------------------------------------------------ */
function segPoint(out, ax, ay, az, bx, by, bz, t) {
  out[0] = ax + (bx - ax) * t;
  out[1] = ay + (by - ay) * t;
  out[2] = az + (bz - az) * t;
  return out;
}

/**
 * Sample points on the shell of a capsule segment a->b with radius r.
 * Surface-biased so fingers read as solid volumes, not clouds.
 */
function sampleCapsule(arr, ax, ay, az, bx, by, bz, r, count, jitter) {
  const p = [0, 0, 0];
  for (let i = 0; i < count; i += 1) {
    const t = Math.random();
    segPoint(p, ax, ay, az, bx, by, bz, t);
    // random unit direction
    const u = Math.random() * 2 - 1;
    const th = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const rr = r * (0.82 + Math.random() * 0.36);
    arr.push(
      p[0] + s * Math.cos(th) * rr + (Math.random() - 0.5) * jitter,
      p[1] + s * Math.sin(th) * rr + (Math.random() - 0.5) * jitter,
      p[2] + u * rr + (Math.random() - 0.5) * jitter
    );
  }
}

/**
 * Build a reaching hand in local space, pointing +X.
 * Pose mirrors the reference: index extended, middle soft, ring/pinky
 * curled, thumb abducted. Returns { positions, lights } where lights is
 * 0 (palm) .. 1 (fingertip glow) per point.
 */
function buildReachingHand() {
  const positions = [];
  const lights = [];

  const push = (pts, light) => {
    for (let i = 0; i < pts.length; i += 3) {
      positions.push(pts[i], pts[i + 1], pts[i + 2]);
      lights.push(light);
    }
  };

  /* ---- palm: ellipsoid shell + light interior fill ---- */
  {
    const pts = [];
    const rx = 0.36;
    const ry = 0.44;
    const rz = 0.21;
    for (let i = 0; i < 1500; i += 1) {
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const shell = 0.78 + Math.random() * 0.28; // shell-biased
      pts.push(
        s * Math.cos(th) * rx * shell,
        s * Math.sin(th) * ry * shell,
        u * rz * shell
      );
    }
    push(pts, 0.12);
  }

  /* ---- fingers ---- */
  const fingers = [
    // rootY, lengthScale, curl (radians of downward bend), radius
    { rootY: 0.24, len: 1.0, curl: 0.16, r: 0.088 }, // index — extended
    { rootY: 0.08, len: 1.06, curl: 0.55, r: 0.092 }, // middle — soft
    { rootY: -0.09, len: 0.98, curl: 0.95, r: 0.086 }, // ring — curled
    { rootY: -0.24, len: 0.8, curl: 1.35, r: 0.074 }, // pinky — tucked
  ];
  const segLens = [0.3, 0.24, 0.18];

  fingers.forEach((f) => {
    // joint chain from knuckle, curling downward (-Y) progressively
    const joints = [[0.32, f.rootY, 0.02]];
    let dx = 1;
    let dy = 0;
    for (let s = 0; s < 3; s += 1) {
      const len = segLens[s] * f.len;
      const prev = joints[joints.length - 1];
      // rotate direction downward by a third of total curl each joint
      const a = Math.atan2(dy, dx) - f.curl / 3;
      dx = Math.cos(a);
      dy = Math.sin(a);
      joints.push([prev[0] + dx * len, prev[1] + dy * len, prev[2]]);
    }
    const taper = [1, 0.88, 0.72];
    for (let s = 0; s < 3; s += 1) {
      const pts = [];
      const a = joints[s];
      const b = joints[s + 1];
      const r = f.r * taper[s];
      const count = s === 2 ? 150 : 120; // denser tip
      sampleCapsule(pts, a[0], a[1], a[2], b[0], b[1], b[2], r, count, 0.012);
      push(pts, s === 2 ? 1 : 0.3 + s * 0.2);
    }
  });

  /* ---- thumb: abducted down-forward ---- */
  {
    const joints = [
      [0.02, -0.3, 0.1],
      [0.2, -0.46, 0.16],
      [0.34, -0.58, 0.2],
    ];
    for (let s = 0; s < 2; s += 1) {
      const pts = [];
      const a = joints[s];
      const b = joints[s + 1];
      sampleCapsule(pts, a[0], a[1], a[2], b[0], b[1], b[2], 0.095 - s * 0.015, 170, 0.012);
      push(pts, s === 1 ? 0.85 : 0.3);
    }
  }

  return { positions, lights };
}

function colorize(lights, stops) {
  // stops: [[t, r, g, b], ...] gradientlut
  const colors = new Float32Array(lights.length * 3);
  const c = new THREE.Color();
  const c0 = new THREE.Color();
  for (let i = 0; i < lights.length; i += 1) {
    const t = Math.max(0, Math.min(1, lights[i] + (Math.random() - 0.5) * 0.12));
    let s = 0;
    while (s < stops.length - 2 && t > stops[s + 1][0]) s += 1;
    const a = stops[s];
    const b = stops[s + 1];
    const k = (t - a[0]) / Math.max(1e-5, b[0] - a[0]);
    c0.setRGB(a[1], a[2], a[3]);
    c.setRGB(b[1], b[2], b[3]);
    c0.lerp(c, Math.max(0, Math.min(1, k)));
    colors[i * 3] = c0.r;
    colors[i * 3 + 1] = c0.g;
    colors[i * 3 + 2] = c0.b;
  }
  return colors;
}

/**
 * HeroVisual — true 3D WebGL scene.
 *
 * Dense capsule-sampled reaching hands (violet AI left, ember human right),
 * a crackling energy arc between the index fingertips, a rotating crystal
 * core with gyro rings and orbiting sparks, plus a starfield. Camera and
 * hands parallax with the cursor. Fully procedural, responsive fit.
 */
export default function HeroVisual() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------- scene / camera / renderer ---------------- */
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

    /* Fit group so hands stay on-screen at any aspect. */
    const world = new THREE.Group();
    scene.add(world);

    /* ---------------- glow sprite ---------------- */
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

    /* ---------------- hands ---------------- */
    const handGeo = buildReachingHand();

    const aiColors = colorize(handGeo.lights, [
      [0, 0.24, 0.08, 0.55], // deep violet
      [0.45, 0.55, 0.25, 0.95], // violet
      [1, 0.35, 0.85, 1.0], // cyan tip
    ]);
    const humanColors = colorize(handGeo.lights, [
      [0, 0.45, 0.12, 0.2], // deep ember
      [0.45, 0.95, 0.32, 0.45], // rose
      [1, 1.0, 0.85, 0.55], // amber tip
    ]);

    const aiGeo = new THREE.BufferGeometry();
    aiGeo.setAttribute('position', new THREE.Float32BufferAttribute(handGeo.positions, 3));
    aiGeo.setAttribute('color', new THREE.BufferAttribute(aiColors, 3));
    const humanGeo = new THREE.BufferGeometry();
    humanGeo.setAttribute('position', new THREE.Float32BufferAttribute(handGeo.positions, 3));
    humanGeo.setAttribute('color', new THREE.BufferAttribute(humanColors, 3));

    const handMat = (size) =>
      new THREE.PointsMaterial({
        size,
        vertexColors: true,
        map: sprite,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

    const aiHand = new THREE.Points(aiGeo, handMat(0.075));
    aiHand.position.set(-2.05, -0.15, 0);
    world.add(aiHand);

    const humanHand = new THREE.Points(humanGeo, handMat(0.075));
    humanHand.rotation.y = Math.PI; // mirror to face center
    humanHand.position.set(2.05, -0.15, 0);
    world.add(humanHand);

    /* Fingertip world anchors (index tip ≈ local (1.05, 0.2, 0)). */
    const tipL = new THREE.Vector3(-2.05 + 1.02, -0.15 + 0.2, 0);
    const tipR = new THREE.Vector3(2.05 - 1.02, -0.15 + 0.2, 0);

    /* ---------------- energy arc between fingertips ---------------- */
    const ARC_PTS = 70;
    const arcGeo = new THREE.BufferGeometry();
    arcGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(ARC_PTS * 3), 3));
    const arcMat = new THREE.LineBasicMaterial({
      color: 0xc4b5fd,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const arc = new THREE.Line(arcGeo, arcMat);
    world.add(arc);
    const arc2 = new THREE.Line(arcGeo.clone(), arcMat.clone());
    arc2.material.color.set(0x67e8f9);
    arc2.material.opacity = 0.4;
    world.add(arc2);

    const redrawArc = (geo, seed, spread) => {
      const pos = geo.attributes.position;
      for (let i = 0; i < ARC_PTS; i += 1) {
        const t = i / (ARC_PTS - 1);
        // route through the core with a slight lift
        const lift = Math.sin(t * Math.PI) * 0.28;
        const x = tipL.x + (tipR.x - tipL.x) * t;
        const y = tipL.y + (0.12 - tipL.y) * Math.sin(t * Math.PI) + lift * 0.25;
        const z = Math.sin(t * Math.PI * 3 + seed) * spread + (Math.random() - 0.5) * spread * 1.6;
        pos.setXYZ(i, x + (Math.random() - 0.5) * spread, y + (Math.random() - 0.5) * spread, z);
      }
      pos.needsUpdate = true;
    };

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
    // faint outer shell
    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.05, 1),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.07 })
    );
    core.add(shell);

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
      new THREE.PointsMaterial({
        size: 0.05,
        color: 0xf0abfc,
        map: sprite,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    core.add(sparks);

    /* ---------------- starfield ---------------- */
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
      // slow drift handled in loop via rotation
      stars.onBeforeRender = () => {};
      scene.userData.stars = stars;
    }

    /* ---------------- dust motes ---------------- */
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

    /* ---------------- sizing (responsive fit) ---------------- */
    const fit = () => {
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      // hands span ±3.1 world units; shrink world to fit narrow screens
      const halfW = Math.tan(THREE.MathUtils.degToRad(22.5)) * 6.5 * camera.aspect;
      const s = Math.min(1, halfW / 3.4);
      world.scale.setScalar(s);
    };
    fit();
    window.addEventListener('resize', fit);

    /* ---------------- loop ---------------- */
    const clock = new THREE.Clock();
    let raf = 0;
    let frame = 2; // start at 2 so the first paint already draws the arc

    const render = (t) => {
      const e = t * 0.001;
      tx += (mx - tx) * 0.045;
      ty += (my - ty) * 0.045;
      camera.position.x = tx * 0.5;
      camera.position.y = ty * 0.35;
      camera.lookAt(0, 0, 0);

      // core motion
      core.position.y = 0.1 + Math.sin(e * 1.3) * 0.07;
      core.rotation.y = e * 0.25;
      crystal.rotation.x = e * 0.6;
      solid.rotation.x = -e * 0.8;
      solid.rotation.y = -e * 0.6;
      shell.rotation.y = -e * 0.06;
      ring1.rotation.x = e * 0.4;
      ring1.rotation.y = e * 0.3;
      ring2.rotation.y = -e * 0.5;
      ring3.rotation.x = -e * 0.3;
      ring3.rotation.z = -e * 0.4;

      // sparks orbit
      {
        const pos = sparkGeo.attributes.position;
        for (let i = 0; i < SPARKS; i += 1) {
          const a = sparkSeed[i * 2] + e * (0.5 + (i % 5) * 0.14);
          const r = sparkSeed[i * 2 + 1];
          pos.setXYZ(i, Math.cos(a) * r, Math.sin(a * 1.3) * r * 0.7, Math.sin(a) * r);
        }
        pos.needsUpdate = true;
      }

      // hands: reach tension + breath + cursor lean
      const tension = Math.sin(e * 1.4) * 0.06;
      aiHand.position.x = -2.05 + tension + tx * 0.12;
      aiHand.position.y = -0.15 + Math.sin(e * 0.9) * 0.03 + ty * 0.08;
      aiHand.rotation.z = Math.sin(e * 0.7) * 0.02;
      humanHand.position.x = 2.05 - tension - tx * 0.12;
      humanHand.position.y = -0.15 + Math.sin(e * 0.9 + 1.2) * 0.03 - ty * 0.08;
      humanHand.rotation.z = Math.sin(e * 0.7 + 0.6) * 0.02;

      // crackling arc, redrawn every 3rd frame
      frame += 1;
      if (frame % 3 === 0) {
        redrawArc(arcGeo, e, 0.05);
        redrawArc(arc2.geometry, e * 1.7 + 4, 0.11);
        arcMat.opacity = 0.55 + Math.random() * 0.35;
      }

      // dust drift
      dust.rotation.y = e * 0.02;
      const stars = scene.userData.stars;
      if (stars) stars.rotation.y = e * 0.008;

      renderer.render(scene, camera);
    };

    if (reduced) {
      render(performance.now());
    } else {
      // Paint one frame immediately so the visual is never blank before the
      // first animation tick (slow devices, throttled background tabs).
      render(performance.now());
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
      {/* soft glow under the composition */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-600/15 via-sky-500/10 to-rose-500/15 blur-[110px]"
      />
    </div>
  );
}
