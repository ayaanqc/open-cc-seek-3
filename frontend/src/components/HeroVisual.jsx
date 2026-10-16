import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/* Geometry samplers — surface-biased so forms read as solid volumes.  */
/* ------------------------------------------------------------------ */
function segPoint(out, ax, ay, az, bx, by, bz, t) {
  out[0] = ax + (bx - ax) * t;
  out[1] = ay + (by - ay) * t;
  out[2] = az + (bz - az) * t;
  return out;
}

function sampleCapsule(arr, ax, ay, az, bx, by, bz, r, count, jitter) {
  const p = [0, 0, 0];
  for (let i = 0; i < count; i += 1) {
    const t = Math.random();
    segPoint(p, ax, ay, az, bx, by, bz, t);
    const u = Math.random() * 2 - 1;
    const th = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const rr = r * (0.8 + Math.random() * 0.38);
    arr.push(
      p[0] + s * Math.cos(th) * rr + (Math.random() - 0.5) * jitter,
      p[1] + s * Math.sin(th) * rr + (Math.random() - 0.5) * jitter,
      p[2] + u * rr + (Math.random() - 0.5) * jitter
    );
  }
}

function sampleBall(arr, cx, cy, cz, r, count) {
  for (let i = 0; i < count; i += 1) {
    const u = Math.random() * 2 - 1;
    const th = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const rr = r * (0.75 + Math.random() * 0.4);
    arr.push(cx + s * Math.cos(th) * rr, cy + s * Math.sin(th) * rr, cz + u * rr);
  }
}

/**
 * Reaching hand in local space, pointing +X with a slight upward tilt —
 * Michelangelo pose: long extended index, progressively curled fingers,
 * abducted thumb, tapered forearm stub so it reads as an arm, not a cloud.
 * Returns positions, per-point light (0 palm .. 1 fingertip) and the index
 * fingertip anchor for the energy arc.
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

  /* ---- forearm stub tapering into the wrist ---- */
  {
    const pts = [];
    sampleCapsule(pts, -1.3, -0.14, 0, -0.72, -0.09, 0, 0.28, 420, 0.01);
    sampleCapsule(pts, -0.72, -0.09, 0, -0.3, -0.04, 0, 0.235, 320, 0.01);
    push(pts, 0.04);
  }

  /* ---- palm: wide flat ellipsoid, shell-biased ---- */
  {
    const pts = [];
    const rx = 0.44;
    const ry = 0.4;
    const rz = 0.185;
    for (let i = 0; i < 1400; i += 1) {
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const shell = 0.76 + Math.random() * 0.3;
      pts.push(
        -0.02 + s * Math.cos(th) * rx * shell,
        s * Math.sin(th) * ry * shell,
        u * rz * shell
      );
    }
    push(pts, 0.12);
  }

  /* ---- fingers ---- */
  const TILT = 0.13; // upward reach bias
  const fingers = [
    // rootY, lengthScale, curl, radius — index reaches, pinky tucks
    { rootY: 0.28, len: 1.14, curl: 0.1, r: 0.078 },
    { rootY: 0.1, len: 1.05, curl: 0.52, r: 0.082 },
    { rootY: -0.09, len: 0.96, curl: 0.94, r: 0.076 },
    { rootY: -0.26, len: 0.78, curl: 1.34, r: 0.063 },
  ];
  const segLens = [0.3, 0.24, 0.18];
  const taper = [1, 0.86, 0.66];
  const segLight = [0.32, 0.58, 1.0];
  const segCount = [130, 120, 175];
  let indexTip = [1.1, 0.3, 0];

  fingers.forEach((f, fi) => {
    const joints = [[0.38, f.rootY, 0.02]];
    let ang = TILT;
    for (let s = 0; s < 3; s += 1) {
      const len = segLens[s] * f.len;
      const prev = joints[joints.length - 1];
      ang -= f.curl / 3;
      joints.push([prev[0] + Math.cos(ang) * len, prev[1] + Math.sin(ang) * len, prev[2]]);
    }
    for (let s = 0; s < 3; s += 1) {
      const pts = [];
      const a = joints[s];
      const b = joints[s + 1];
      sampleCapsule(pts, a[0], a[1], a[2], b[0], b[1], b[2], f.r * taper[s], segCount[s], 0.01);
      push(pts, segLight[s]);
      // knuckle bulge for articulation
      if (s > 0) {
        const kp = [];
        sampleBall(kp, a[0], a[1], a[2], f.r * taper[s] * 1.18, 42);
        push(kp, 0.55);
      }
    }
    if (fi === 0) indexTip = joints[3].slice();
  });

  /* ---- thumb, abducted down-forward ---- */
  {
    const joints = [
      [0.08, -0.27, 0.1],
      [0.26, -0.43, 0.17],
      [0.4, -0.55, 0.21],
    ];
    for (let s = 0; s < 2; s += 1) {
      const pts = [];
      const a = joints[s];
      const b = joints[s + 1];
      sampleCapsule(pts, a[0], a[1], a[2], b[0], b[1], b[2], 0.092 - s * 0.016, s === 1 ? 170 : 150, 0.01);
      push(pts, s === 1 ? 0.85 : 0.3);
    }
  }

  return { positions, lights, tip: indexTip };
}

function colorize(lights, stops) {
  const colors = new Float32Array(lights.length * 3);
  const c = new THREE.Color();
  const c0 = new THREE.Color();
  for (let i = 0; i < lights.length; i += 1) {
    const t = Math.max(0, Math.min(1, lights[i] + (Math.random() - 0.5) * 0.1));
    let s = 0;
    while (s < stops.length - 2 && t > stops[s + 1][0]) s += 1;
    const a = stops[s];
    const b = stops[s + 1];
    const k = Math.max(0, Math.min(1, (t - a[0]) / Math.max(1e-5, b[0] - a[0])));
    c0.setRGB(a[1], a[2], a[3]);
    c.setRGB(b[1], b[2], b[3]);
    c0.lerp(c, k);
    colors[i * 3] = c0.r;
    colors[i * 3 + 1] = c0.g;
    colors[i * 3 + 2] = c0.b;
  }
  return colors;
}

/**
 * HeroVisual — dense capsule-sampled reaching hands (violet AI left, ember
 * human right) with forearm stubs, separated articulated fingers and glowing
 * index tips; a crackling energy arc between the fingertips; crystal core
 * with gyro rings, orbiting sparks and periodic shockwaves; starfield and
 * dust. Cursor parallax, responsive fit, reduced-motion static frame.
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

    /* ---------------- hands ---------------- */
    const hand = buildReachingHand();
    const HAND_X = 2.2;
    const HAND_Y = -0.18;

    const aiColors = colorize(hand.lights, [
      [0, 0.2, 0.06, 0.48],
      [0.45, 0.52, 0.24, 0.94],
      [1, 0.4, 0.88, 1.0],
    ]);
    const humanColors = colorize(hand.lights, [
      [0, 0.36, 0.09, 0.15],
      [0.45, 0.93, 0.3, 0.42],
      [1, 1.0, 0.82, 0.5],
    ]);

    const aiGeo = new THREE.BufferGeometry();
    aiGeo.setAttribute('position', new THREE.Float32BufferAttribute(hand.positions, 3));
    aiGeo.setAttribute('color', new THREE.BufferAttribute(aiColors, 3));
    const humanGeo = new THREE.BufferGeometry();
    humanGeo.setAttribute('position', new THREE.Float32BufferAttribute(hand.positions, 3));
    humanGeo.setAttribute('color', new THREE.BufferAttribute(humanColors, 3));

    const handMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      map: sprite,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const aiHand = new THREE.Points(aiGeo, handMat);
    aiHand.position.set(-HAND_X, HAND_Y, 0);
    world.add(aiHand);

    const humanHand = new THREE.Points(humanGeo, handMat.clone());
    humanHand.rotation.y = Math.PI;
    humanHand.position.set(HAND_X, HAND_Y, 0);
    world.add(humanHand);

    // index-tip anchors in world space (mirror flips x for the right hand)
    const tipL = new THREE.Vector3(-HAND_X + hand.tip[0], HAND_Y + hand.tip[1], hand.tip[2]);
    const tipR = new THREE.Vector3(HAND_X - hand.tip[0], HAND_Y + hand.tip[1], -hand.tip[2]);

    /* ---------------- energy arc ---------------- */
    const ARC_PTS = 70;
    const mkArc = (color, opacity) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(ARC_PTS * 3), 3));
      const line = new THREE.Line(
        g,
        new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending })
      );
      world.add(line);
      return line;
    };
    const arc = mkArc(0xc4b5fd, 0.7);
    const arc2 = mkArc(0x67e8f9, 0.4);

    const redrawArc = (line, seed, spread) => {
      const pos = line.geometry.attributes.position;
      for (let i = 0; i < ARC_PTS; i += 1) {
        const t = i / (ARC_PTS - 1);
        const lift = Math.sin(t * Math.PI) * 0.1;
        const x = tipL.x + (tipR.x - tipL.x) * t;
        const y = tipL.y + (0.12 - tipL.y) * Math.sin(t * Math.PI) + lift;
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

    /* periodic shockwaves */
    const shocks = [];
    for (let i = 0; i < 3; i += 1) {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.01, 10, 96),
        new THREE.MeshBasicMaterial({ color: 0xc4b5fd, transparent: true, opacity: 0, blending: THREE.AdditiveBlending })
      );
      m.rotation.x = Math.PI / 2 + (i - 1) * 0.35;
      core.add(m);
      shocks.push(m);
    }

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
      const halfW = Math.tan(THREE.MathUtils.degToRad(22.5)) * 6.5 * camera.aspect;
      world.scale.setScalar(Math.min(1, halfW / 3.5));
    };
    fit();
    window.addEventListener('resize', fit);

    /* ---------------- loop ---------------- */
    let raf = 0;
    let frame = 2;

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
      shell.rotation.y = -e * 0.06;
      ring1.rotation.x = e * 0.4;
      ring1.rotation.y = e * 0.3;
      ring2.rotation.y = -e * 0.5;
      ring3.rotation.x = -e * 0.3;
      ring3.rotation.z = -e * 0.4;

      // shockwaves: staggered expanding fades
      for (let i = 0; i < shocks.length; i += 1) {
        const k = (e * 0.28 + i / shocks.length) % 1;
        shocks[i].scale.setScalar(0.5 + k * 2.1);
        shocks[i].material.opacity = (1 - k) * 0.28;
      }

      {
        const pos = sparkGeo.attributes.position;
        for (let i = 0; i < SPARKS; i += 1) {
          const a = sparkSeed[i * 2] + e * (0.5 + (i % 5) * 0.14);
          const r = sparkSeed[i * 2 + 1];
          pos.setXYZ(i, Math.cos(a) * r, Math.sin(a * 1.3) * r * 0.7, Math.sin(a) * r);
        }
        pos.needsUpdate = true;
      }

      const tension = Math.sin(e * 1.4) * 0.06;
      aiHand.position.x = -HAND_X + tension + tx * 0.12;
      aiHand.position.y = HAND_Y + Math.sin(e * 0.9) * 0.03 + ty * 0.08;
      humanHand.position.x = HAND_X - tension - tx * 0.12;
      humanHand.position.y = HAND_Y + Math.sin(e * 0.9 + 1.2) * 0.03 - ty * 0.08;

      frame += 1;
      if (frame % 3 === 0) {
        redrawArc(arc, e, 0.05);
        redrawArc(arc2, e * 1.7 + 4, 0.11);
        arc.material.opacity = 0.55 + Math.random() * 0.35;
      }

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
