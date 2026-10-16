/**
 * Premium 3D fluid focal element. Built entirely from layered CSS radial
 * gradients (purple/pink/blue) with blur for depth, a specular white rim,
 * and a slow morph + float animation. Responds subtly to the mouse.
 */
import { useRef } from 'react';
import { useParallax } from '../lib/effects.js';

export default function FluidBlob({ className = '', style = {} }) {
  const wrapRef = useRef(null);
  useParallax(wrapRef, { strength: 10 });

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Ambient glow cast onto the background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 rounded-full opacity-60 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle at 45% 40%, rgba(168,85,247,0.55) 0%, rgba(124,58,237,0.32) 38%, transparent 70%)',
          transform: 'translate3d(var(--mx,0), var(--my,0), 0)',
          transition: 'transform 0.15s ease-out',
        }}
      />

      {/* Main liquid body */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background: `
            radial-gradient(65% 60% at 35% 30%, #f0abfc 0%, #a855f7 38%, #7c3aed 62%, #4c1d95 100%)
          `,
          filter: 'blur(20px)',
          transform: 'translate3d(calc(var(--mx,0) * 0.5), calc(var(--my,0) * 0.5), 0)',
          animation: 'float 7s ease-in-out infinite',
          opacity: 0.92,
        }}
      />

      {/* Secondary overlapping droplet */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background: `
            radial-gradient(55% 55% at 62% 55%, #fb7185 0%, #ec4899 40%, #db2777 70%, transparent 100%)
          `,
          filter: 'blur(32px)',
          transform: 'translate3d(calc(var(--mx,0) * -0.4), calc(var(--my,0) * -0.4), 0)',
          animation: 'float 9s ease-in-out infinite reverse',
          opacity: 0.85,
        }}
      />

      {/* Specular highlight rim for glassy 3D read */}
      <div
        aria-hidden
        className="absolute left-1/3 top-1/6 h-[30%] w-[35%] rounded-full blur-md"
        style={{
          background:
            'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 65%)',
          opacity: 0.75,
          transform: 'translate3d(calc(var(--mx,0) * 0.15), calc(var(--my,0) * 0.15), 0)',
          animation: 'morph 10s ease-in-out infinite',
        }}
      />

      {/* Tiny satellite particle */}
      <div
        aria-hidden
        className="absolute bottom-1/4 right-1/4 h-8 w-8 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #f0abfc 0%, #a855f7 60%, transparent 100%)',
          boxShadow: '0 0 24px rgba(240,171,252,0.55)',
          opacity: 0.8,
          transform: 'translate3d(calc(var(--mx,0) * 0.3), calc(var(--my,0) * 0.3), 0)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
    </div>
  );
}
