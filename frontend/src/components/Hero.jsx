import { useRef } from 'react';
import { useParallax, useReveal } from '../lib/effects.js';
import FluidBlob from './FluidBlob.jsx';
import Btn from './Btn.jsx';

const SUBHEAD =
  'In the dynamic landscape of business, navigating complexities and maximizing opportunities requires expertise, vision, and strategic acumen.';

export default function Hero() {
  const wrapRef = useRef(null);
  useReveal(wrapRef, { threshold: 0.12 });

  return (
    <section id="top" className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Deep gradient backdrop */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #020205 0%, #1a0a2e 45%, #0a0a12 85%, #05050a 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.35) 0%, transparent 45%), radial-gradient(ellipse at 20% 70%, rgba(236,72,153,0.25) 0%, transparent 45%)',
        }}
      />

      <div
        ref={wrapRef}
        className="relative mx-auto max-w-7xl px-6 lg:px-10 flex flex-col lg:flex-row items-center gap-16 min-h-[85vh]"
      >
        {/* Left copy column */}
        <div className="flex-1 max-w-xl reveal reveal-delay-1">
          <div className="inline-flex items-center gap-2 mb-8">
            <span className="h-2 w-8 bg-gradient-to-r from-accent-purple to-accent-pink rounded-full" aria-hidden />
            <span className="font-display text-xs font-bold tracking-[0.28em] text-mute uppercase">Digital consultancy</span>
          </div>

          <h1 className="font-display text-[5rem] font-black leading-none tracking-tightest text-white sm:text-[4.25rem] lg:text-[5.75rem]">
            WE ARE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-accent-purple to-accent-pink">
              OPTICORE
            </span>
          </h1>

          <p className="mt-8 text-[14px] leading-relaxed text-mute max-w-md">
            {SUBHEAD}
          </p>

          <div className="mt-10 flex items-center gap-4">
            <Btn href="#contact" variant="primary">
              Sign Up <span aria-hidden>☎</span>
            </Btn>
            <a href="#about" className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-[12px] font-bold text-mute uppercase tracking-widest transition-all duration-300 hover:bg-white/5 hover:text-white hover:border-accent-purple">
              Learn more <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        {/* Right fluid focal */}
        <div className="flex-1 relative h-[560px] lg:h-[720px] w-full reveal reveal-delay-2">
          <FluidBlob className="absolute inset-0" />
        </div>
      </div>

      {/* Bottom indicator row */}
      <div className="absolute bottom-16 left-6 lg:left-12 right-6 lg:right-12 flex items-center justify-between px-4">
        {/* Socials */}
        <div className="flex items-center gap-4 text-xs font-medium text-mute uppercase tracking-widest">
          <a href="#" className="transition-colors hover:text-white">f</a>
          <a href="#" className="transition-colors hover:text-white"></a>
          <a href="#" className="transition-colors hover:text-white">𝕏</a>
        </div>

        {/* Scroll down */}
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 group">
          <div className="absolute -inset-1 rounded-full bg-accent-purple opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
          <span className="text-[10px] font-bold text-white leading-none group-hover:text-accent-purple transition-colors">↓</span>
        </div>

        {/* Section nav arrows */}
        <div className="flex items-center gap-6 text-xs font-bold text-mute uppercase tracking-widest">
          <button className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <span>←</span> Prev
          </button>
          <button className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            Next <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
