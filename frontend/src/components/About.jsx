import { useRef } from 'react';
import { useParallax, useReveal } from '../lib/effects.js';
import FluidBlob from './FluidBlob.jsx';
import Btn from './Btn.jsx';

const BODY =
  'Providing comprehensive business management consulting services tailored to the unique needs of our clients.' +
  ' Opticore is a leading consultancy firm comprised of seasoned professionals dedicated to empowering businesses to achieve their full potential.' +
  ' With a team of experts spanning various industries and disciplines, we bring a wealth of experience and insight to every project we undertake.';

export default function About() {
  const wrapRef = useRef(null);
  useReveal(wrapRef, { threshold: 0.1 });

  return (
    <section id="about" className="relative overflow-hidden border-t border-white/5 py-32 lg:py-40">
      {/* ABOUT watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 select-none text-[26vw] font-black leading-none tracking-tighter text-transparent sm:text-[20rem] lg:text-[32rem]"
        style={{
          WebkitTextStroke: '1px rgba(255,255,255,0.03)',
        }}
      >
        ABOUT
      </span>

      {/* Left fluid shape */}
      <div className="hidden lg:block absolute left-0 top-1/4 -translate-y-1/2 w-[70vw] max-w-[700px] h-[700px]">
        <FluidBlob className="absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10 flex flex-col lg:flex-row items-start gap-20">
        {/* Right copy */}
        <div className="flex-1 max-w-2xl reveal reveal-delay-1">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="h-2 w-8 bg-gradient-to-r from-accent-purple to-accent-pink rounded-full" aria-hidden />
            <span className="font-display text-xs font-bold tracking-[0.28em] text-mute uppercase">Section 01</span>
          </div>

          <h2 className="font-display text-3xl font-bold leading-none tracking-tightest text-white sm:text-4xl lg:text-5xl">
            WHO WE ARE
          </h2>

          <p className="mt-6 text-[14px] leading-relaxed text-mute max-w-xl">
            {BODY}
          </p>

          <div className="mt-10 flex items-center gap-4">
            <Btn href="#contact" variant="primary">
              Read more <span aria-hidden>☎</span>
            </Btn>
            <div className="hidden sm:block h-[1px] w-[120px] bg-gradient-to-r from-transparent via-accent-purple/40 to-transparent" />
          </div>
        </div>

        {/* Right-edge fluid accent */}
        <div className="hidden lg:block relative h-[560px] w-full reveal reveal-delay-2">
          <FluidBlob className="absolute inset-0" style={{ transform: 'scaleX(-1)' }} />
        </div>
      </div>

      {/* Page indicator */}
      <div className="absolute bottom-12 right-12 flex items-end gap-2">
        <span className="font-mono text-[11px] font-bold text-mute">01</span>
        <div className="h-0.5 w-16 bg-white/10" />
      </div>
    </section>
  );
}
