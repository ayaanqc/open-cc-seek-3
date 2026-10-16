import { useEffect, useRef } from 'react';
import Cursor from './Cursor.jsx';
import HeroVisual from './HeroVisual.jsx';
import MagneticBtn from './MagneticBtn.jsx';
import Reveal from './Reveal.jsx';

function IconRow() {
  const cls = 'h-[20px] w-[20px] text-neutral-800';
  return (
    <div className="flex items-center justify-center gap-8" aria-hidden>
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 4v10m0 0l-4-4m4 4l4-4M5 19h14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="6" y="6" width="12" height="12" rx="1.5" />
      </svg>
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 12h6m-2-3l3 3-3 3M14 12h6m-3-3l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="6.5" />
      </svg>
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M14.5 6.5a4 4 0 0 0-5.6 4.8L4 16.2V20h3.8l4.9-4.9a4 4 0 0 0 4.8-5.6l-2.7 2.7-2.1-2.1 1.8-3.6z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** Slow orbiting caption ring floating over the 3D core. */
function OrbitRing() {
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 sm:block">
      <svg width="380" height="380" viewBox="0 0 380 380" className="animate-spin-slower opacity-60">
        <defs>
          <path id="orbit-circle" d="M 190,190 m -150,0 a 150,150 0 1,1 300,0 a 150,150 0 1,1 -300,0" />
        </defs>
        <text className="fill-neutral-500 font-mono" style={{ fontSize: '10.5px', letterSpacing: '0.42em' }}>
          <textPath href="#orbit-circle">
            HUMAN INTUITION • ALGORITHMIC PRECISION • OPTICORE •
          </textPath>
        </text>
      </svg>
    </div>
  );
}

/**
 * Hero: centered headline with shimmer accent, mono subcopy, magnetic pill
 * CTA, and the 3D reaching-hands visual with scroll parallax.
 */
export default function Hero() {
  const visualRef = useRef(null);

  useEffect(() => {
    const node = visualRef.current;
    if (!node) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        node.style.transform = `translate3d(0, ${y * 0.1}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section id="top" className="grain relative overflow-hidden bg-black pt-[132px]">
      <Cursor />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h1 className="text-[30px] font-medium leading-[1.18] tracking-[-0.02em] text-neutral-100 sm:text-[38px]">
            When intelligence reaches out
            <br />
            <span className="shimmer-text">to instinct, the future takes shape</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md font-mono text-[11.5px] leading-relaxed text-neutral-500">
            an unlikely alliance - where human intuition
            <br />
            and algorithmic precision move as one
          </p>
          <div className="mt-7 flex justify-center">
            <MagneticBtn href="#how" variant="white">
              See it in action
              <span aria-hidden>→</span>
            </MagneticBtn>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative mt-2">
          <div ref={visualRef} className="relative will-change-transform">
            <HeroVisual />
            <OrbitRing />
          </div>
          <div className="pb-10">
            <IconRow />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
