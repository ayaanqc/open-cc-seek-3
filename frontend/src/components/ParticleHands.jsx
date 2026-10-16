import { useEffect, useRef } from 'react';

/* ---------- geometry helpers ---------- */

function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function ellipseValue(px, py, cx, cy, rx, ry, rot) {
  const dx = px - cx;
  const dy = py - cy;
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  const lx = dx * cos + dy * sin;
  const ly = -dx * sin + dy * cos;
  return (lx * lx) / (rx * rx) + (ly * ly) / (ry * ry);
}

function hash(x, y) {
  let h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
}

/**
 * Dual dotted hands on canvas — a cool gray robotic hand reaching from the
 * left and a warm human hand reaching from the right, both dissolving into
 * a dot matrix like the reference. Dots drift gently and parallax with
 * the cursor.
 */
export default function ParticleHands({ className = '' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let dots = [];
    let raf = 0;
    let w = 0;
    let h = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const build = () => {
      const rect = container.getBoundingClientRect();
      w = Math.max(320, rect.width);
      h = Math.max(280, rect.height);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const step = w < 640 ? 7 : 8.5;
      const rFinger = Math.max(13, h * 0.032);
      dots = [];

      /* Hand landmarks, proportional so it holds at any width. */
      const L = {
        wrist: [0, h * 0.34, w * 0.085, h * 0.60],
        palm: [w * 0.135, h * 0.47, w * 0.072, h * 0.115, -0.28],
        index: [w * 0.185, h * 0.435, w * 0.345, h * 0.465],
        middle: [w * 0.18, h * 0.50, w * 0.27, h * 0.535],
        ring: [w * 0.165, h * 0.545, w * 0.235, h * 0.585],
        thumb: [w * 0.145, h * 0.385, w * 0.205, h * 0.295],
      };
      const R = {
        wrist: [w * 0.915, h * 0.54, w, h * 0.80],
        palm: [w * 0.865, h * 0.665, w * 0.072, h * 0.11, 0.28],
        index: [w * 0.815, h * 0.615, w * 0.655, h * 0.575],
        middle: [w * 0.82, h * 0.675, w * 0.725, h * 0.69],
        ring: [w * 0.835, h * 0.72, w * 0.765, h * 0.745],
        thumb: [w * 0.855, h * 0.735, w * 0.795, h * 0.815],
      };

      for (let gy = step / 2; gy < h; gy += step) {
        for (let gx = step / 2; gx < w; gx += step) {
          const j = hash(gx, gy);
          let side = null;
          let light = 0;

          /* --- left robotic hand --- */
          {
            const inWrist =
              gx >= L.wrist[0] && gx <= L.wrist[2] && gy >= L.wrist[1] && gy <= L.wrist[3];
            const palmV = ellipseValue(gx, gy, L.palm[0], L.palm[1], L.palm[2], L.palm[3], L.palm[4]);
            const dIndex = distToSegment(gx, gy, L.index[0], L.index[1], L.index[2], L.index[3]);
            const dMid = distToSegment(gx, gy, L.middle[0], L.middle[1], L.middle[2], L.middle[3]);
            const dRing = distToSegment(gx, gy, L.ring[0], L.ring[1], L.ring[2], L.ring[3]);
            const dThumb = distToSegment(gx, gy, L.thumb[0], L.thumb[1], L.thumb[2], L.thumb[3]);

            if (inWrist) {
              side = 'robot';
              light = 0.55 + j * 0.25 - ((gy - L.wrist[1]) / (L.wrist[3] - L.wrist[1])) * 0.15;
            } else if (palmV < 1) {
              side = 'robot';
              light = 0.72 - palmV * 0.25 + (1 - (gy - L.palm[1]) / L.palm[3]) * 0.12;
            } else if (dIndex < rFinger) {
              side = 'robot';
              light = 0.95 - (dIndex / rFinger) * 0.45;
            } else if (dMid < rFinger * 0.92) {
              side = 'robot';
              light = 0.7 - (dMid / rFinger) * 0.4;
            } else if (dRing < rFinger * 0.85) {
              side = 'robot';
              light = 0.6 - (dRing / rFinger) * 0.35;
            } else if (dThumb < rFinger * 0.9) {
              side = 'robot';
              light = 0.8 - (dThumb / rFinger) * 0.4;
            }
          }

          /* --- right human hand --- */
          if (!side) {
            const inWrist =
              gx >= R.wrist[0] && gx <= R.wrist[2] && gy >= R.wrist[1] && gy <= R.wrist[3];
            const palmV = ellipseValue(gx, gy, R.palm[0], R.palm[1], R.palm[2], R.palm[3], R.palm[4]);
            const dIndex = distToSegment(gx, gy, R.index[0], R.index[1], R.index[2], R.index[3]);
            const dMid = distToSegment(gx, gy, R.middle[0], R.middle[1], R.middle[2], R.middle[3]);
            const dRing = distToSegment(gx, gy, R.ring[0], R.ring[1], R.ring[2], R.ring[3]);
            const dThumb = distToSegment(gx, gy, R.thumb[0], R.thumb[1], R.thumb[2], R.thumb[3]);

            if (inWrist) {
              side = 'human';
              light = 0.5 + j * 0.25;
            } else if (palmV < 1) {
              side = 'human';
              light = 0.66 - palmV * 0.22 + (1 - (gy - R.palm[1]) / R.palm[3]) * 0.14;
            } else if (dIndex < rFinger) {
              side = 'human';
              light = 0.92 - (dIndex / rFinger) * 0.45;
            } else if (dMid < rFinger * 0.92) {
              side = 'human';
              light = 0.66 - (dMid / rFinger) * 0.38;
            } else if (dRing < rFinger * 0.85) {
              side = 'human';
              light = 0.56 - (dRing / rFinger) * 0.32;
            } else if (dThumb < rFinger * 0.9) {
              side = 'human';
              light = 0.74 - (dThumb / rFinger) * 0.38;
            }
          }

          if (!side) continue;
          /* Erode edges so the form dissolves into dots like the reference. */
          if (j < 0.08) continue;

          light = Math.max(0.15, Math.min(1, light + (j - 0.5) * 0.22));

          let color;
          if (side === 'robot') {
            const g = Math.round(105 + light * 130);
            color = `rgb(${Math.round(g * 0.97)},${Math.round(g * 0.99)},${Math.min(255, Math.round(g * 1.06))})`;
          } else {
            const t = light;
            const r = Math.round(94 + t * 148);
            const g = Math.round(58 + t * 142);
            const b = Math.round(44 + t * 121);
            color = `rgb(${r},${g},${b})`;
          }

          dots.push({
            x: gx,
            y: gy,
            r: 1.05 + light * 1.35,
            color,
            alpha: 0.45 + light * 0.5,
            phase: j * Math.PI * 2,
            speed: 0.6 + j * 1.1,
            depth: side === 'robot' ? 0.55 : 0.8,
          });
        }
      }
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;

      for (let i = 0; i < dots.length; i += 1) {
        const d = dots[i];
        const tw = reduced ? 1 : 0.78 + 0.22 * Math.sin(t * 0.001 * d.speed + d.phase);
        const floatY = reduced ? 0 : Math.sin(t * 0.0007 * d.speed + d.phase) * 1.6;
        const px = d.x + mouse.x * 14 * d.depth;
        const py = d.y + floatY + mouse.y * 10 * d.depth;
        ctx.globalAlpha = Math.max(0, Math.min(1, d.alpha * tw));
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(px, py, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    build();
    // Paint one static frame immediately so the visual is never blank —
    // even before the first animation tick or when frames are throttled.
    draw(0);
    if (!reduced) {
      const loop = (t) => {
        draw(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      build();
      if (reduced) draw(0);
    };
    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(onResize);
      ro.observe(container);
    }
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} className="block" aria-hidden />
    </div>
  );
}
