import { useEffect } from 'react';

/**
 * Custom cursor: a small difference-blend dot with a trailing ring that
 * expands over interactive elements. Fine pointers only, reduced-motion
 * safe, fully cleaned up on unmount.
 */
export default function Cursor() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.setAttribute('aria-hidden', 'true');
    ring.setAttribute('aria-hidden', 'true');
    dot.className = 'pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-white mix-blend-difference';
    ring.className = 'pointer-events-none fixed left-0 top-0 z-[9998] h-9 w-9 rounded-full border border-white/40 mix-blend-difference';
    ring.style.transition = 'width 0.25s ease, height 0.25s ease, opacity 0.25s ease';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let hovering = false;
    let raf = 0;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      const t = e.target instanceof Element ? e.target.closest('a, button, input, textarea, [role="button"]') : null;
      hovering = !!t;
    };

    const tick = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
      const s = hovering ? 56 : 36;
      ring.style.width = `${s}px`;
      ring.style.height = `${s}px`;
      ring.style.transform = `translate(${rx - s / 2}px, ${ry - s / 2}px)`;
      ring.style.opacity = hovering ? '0.9' : '0.5';
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      dot.remove();
      ring.remove();
    };
  }, []);

  return null;
}
