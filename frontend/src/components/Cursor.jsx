import { useEffect } from 'react';

/**
 * Custom cursor: white difference-blend dot glued to the pointer, with a
 * trailing ring that follows tightly (fast lerp, transform-only — no layout
 * thrash, no perceptible lag). The ring expands over interactive elements
 * and compresses on press. Fine pointers only, fully cleaned up.
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
    ring.className = 'pointer-events-none fixed left-0 top-0 z-[9998] h-9 w-9 rounded-full border border-white/50 mix-blend-difference';
    dot.style.willChange = 'transform';
    ring.style.willChange = 'transform';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let hovering = false;
    let pressed = false;
    let raf = 0;
    let visible = false;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        rx = mx;
        ry = my;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
      const t = e.target instanceof Element ? e.target.closest('a, button, input, textarea, select, [role="button"]') : null;
      hovering = !!t;
    };
    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };
    const onLeave = () => {
      visible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const tick = () => {
      // dot: glued to the pointer, zero lag
      dot.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0) scale(${pressed ? 0.6 : 1})`;
      // ring: fast critically-damped-style follow — tight, no floaty trail
      rx += (mx - rx) * 0.45;
      ry += (my - ry) * 0.45;
      const s = pressed ? 0.7 : hovering ? 1.7 : 1;
      ring.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0) scale(${s})`;
      ring.style.opacity = hovering || pressed ? '0.95' : '0.55';
      raf = requestAnimationFrame(tick);
    };
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      dot.remove();
      ring.remove();
    };
  }, []);

  return null;
}
