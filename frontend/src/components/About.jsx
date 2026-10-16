import Reveal from './Reveal.jsx';

const CAPABILITIES = [
  {
    index: '01',
    title: 'Product Strategy',
    body: 'We translate business goals into a clear product roadmap, defining scope, success metrics, and the sequencing to reach them.',
  },
  {
    index: '02',
    title: 'Interface Design',
    body: 'We craft accessible, high-fidelity interfaces and design systems that stay consistent as your product and team grow.',
  },
  {
    index: '03',
    title: 'Platform Engineering',
    body: 'We build and ship production web platforms, from component libraries to performant frontends and well-documented APIs.',
  },
];

/**
 * About. Opens with a wireframe grid and a low-opacity "ABOUT" watermark,
 * then lays out the consultancy's positioning and core capabilities.
 */
export default function About() {
  return (
    <section id="about" className="relative overflow-hidden border-t border-white/10 py-24 sm:py-32">
      {/* Wireframe grid backdrop */}
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />

      {/* ABOUT watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 select-none text-[22vw] font-extrabold leading-none tracking-tight text-transparent sm:text-[16rem]"
        style={{ WebkitTextStroke: '1px rgba(244,241,234,0.06)' }}
      >
        ABOUT
      </span>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Positioning */}
        <Reveal className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-accent" aria-hidden />
            <span className="font-mono text-[11px] uppercase tracking-ultra text-mute">Who we are</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            A senior consultancy for teams that treat software as a product,
            not a project.
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-mute">
            Opticore partners with founders and product leaders to close the gap between
            ambition and what actually ships. We embed with your team, work in short
            cycles, and leave behind systems your engineers can own and extend.
          </p>
        </Reveal>

        {/* Capabilities */}
        <div id="services" className="mt-16 grid gap-px overflow-hidden rounded-[6px] border border-white/10 bg-white/10 sm:grid-cols-3">
          {CAPABILITIES.map((item, i) => (
            <Reveal key={item.index} delay={i * 90} className="bg-void p-7">
              <span className="font-mono text-[11px] tracking-ultra text-accent">{item.index}</span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-mute">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
