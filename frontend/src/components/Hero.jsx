import FluidShape from './FluidShape.jsx';

/**
 * Hero. Typography drives the left column; the 3D fluid form anchors the
 * right. A restrained scroll indicator sits at the bottom edge.
 */
export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Single, controlled accent bloom behind the fluid form. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-8%] top-24 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(124,58,237,0.5) 0%, rgba(199,36,232,0.22) 45%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* Left: copy */}
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-accent" aria-hidden />
            <span className="font-mono text-[11px] uppercase tracking-ultra text-mute">
              Digital Product Consultancy
            </span>
          </div>

          <h1 className="mt-6 text-[13vw] font-extrabold leading-[0.9] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.25rem]">
            WE ARE
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: '1px #F4F1EA' }}>
              OPTICORE
            </span>
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-mute">
            We design and engineer digital products for teams that care about craft.
            Strategy, interface, and platform work delivered by a senior, embedded team.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="rounded-[4px] bg-bone px-6 py-3 text-[13px] font-semibold tracking-tight text-void transition-colors duration-200 hover:bg-white"
            >
              Start a Project
            </a>
            <a
              href="#services"
              className="rounded-[4px] border border-white/15 px-6 py-3 text-[13px] font-medium text-bone transition-colors duration-200 hover:border-accent hover:bg-accent/10"
            >
              View Services
            </a>
          </div>
        </div>

        {/* Right: focal 3D fluid form */}
        <div className="relative">
          <FluidShape />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative mx-auto mt-16 flex max-w-6xl items-center gap-3 px-6">
        <span className="h-8 w-px bg-gradient-to-b from-accent to-transparent" aria-hidden />
        <span className="font-mono text-[11px] uppercase tracking-ultra text-mute">Scroll</span>
      </div>
    </section>
  );
}
