/**
 * Hero focal element: a premium 3D "fluid" form built entirely in CSS.
 *
 * It uses a single accent hue (violet -> fuchsia) with layered radial
 * gradients for volume, a soft specular highlight for a glassy surface, and
 * a thin orbiting ring for depth. Motion is slow and restrained.
 */
export default function FluidShape() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[540px]">
      {/* Soft ambient bloom cast onto the background. */}
      <div
        aria-hidden
        className="absolute inset-6 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(199,36,232,0.42) 0%, rgba(124,58,237,0.24) 42%, transparent 72%)',
        }}
      />

      {/* Orbiting hairline ring. */}
      <div
        aria-hidden
        className="fluid-ring absolute inset-0 rounded-full border border-white/10"
        style={{ boxShadow: 'inset 0 0 60px rgba(199,36,232,0.10)' }}
      />

      {/* Main fluid body. */}
      <div
        aria-hidden
        className="fluid-body absolute inset-8"
        style={{
          background: `
            radial-gradient(120% 120% at 30% 22%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 26%),
            radial-gradient(90% 90% at 32% 26%, #E9A8FF 0%, #C724E8 34%, #8A1BB0 62%, #3B0A52 100%)
          `,
          boxShadow: `
            inset -28px -34px 70px rgba(20,4,32,0.75),
            inset 18px 22px 60px rgba(255,255,255,0.10),
            0 40px 90px rgba(124,58,237,0.28)
          `,
        }}
      />

      {/* Specular highlight: gives the surface a liquid, glassy read. */}
      <div
        aria-hidden
        className="absolute left-[24%] top-[20%] h-24 w-24 rotate-[-18deg] rounded-full opacity-80 blur-md"
        style={{
          background:
            'radial-gradient(circle at 40% 35%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)',
        }}
      />

      {/* Small satellite droplet for composition balance. */}
      <div
        aria-hidden
        className="absolute bottom-[14%] right-[10%] h-16 w-16"
        style={{
          background:
            'radial-gradient(90% 90% at 30% 25%, #EFA6FF 0%, #C724E8 45%, #4C0E6B 100%)',
          boxShadow: 'inset -6px -8px 16px rgba(20,4,32,0.7), 0 12px 30px rgba(199,36,232,0.30)',
        }}
      />
    </div>
  );
}
