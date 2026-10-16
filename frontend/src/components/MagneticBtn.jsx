import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Magnetic pill button — drifts toward the cursor on hover and springs back
 * on leave. White (primary) and ghost variants, matching the reference.
 */
export default function MagneticBtn({
  children,
  href = '#top',
  onClick,
  variant = 'white',
  className = '',
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let raf = 0;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      target.x = (e.clientX - rect.left - rect.width / 2) * 0.28;
      target.y = (e.clientY - rect.top - rect.height / 2) * 0.28;
    };

    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      gsap.set(el, { x: pos.x, y: pos.y });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      gsap.set(el, { x: 0, y: 0 });
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const isWhite = variant === 'white';

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-[12.5px] font-semibold transition-all duration-200 hover:scale-[1.04] active:scale-[0.98] ${
        isWhite
          ? 'bg-white text-black shadow-[0_16px_40px_-12px_rgba(255,255,255,0.35)] hover:shadow-[0_16px_44px_-10px_rgba(255,255,255,0.45)]'
          : 'border border-white/15 bg-white/[0.04] text-white hover:border-white/35 hover:bg-white/[0.08]'
      } ${className}`}
    >
      {children}
    </a>
  );
}
