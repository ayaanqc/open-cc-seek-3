import Reveal from './Reveal.jsx';

const ITEMS = [
  {
    title: 'Product strategy',
    body: 'Scope, sequencing, and success metrics — decided with you in days, not quarters. You leave with a roadmap you can defend.',
  },
  {
    title: 'Interface design',
    body: 'Accessible, high-fidelity interfaces and design systems that hold together as the product and the team grow.',
  },
  {
    title: 'Platform engineering',
    body: 'Production frontends and documented APIs, built beside your engineers and reviewed in the open every week.',
  },
];

/** Services — three quiet cards, human copy, no jargon. */
export default function Services() {
  return (
    <section id="services" className="relative border-t border-white/10 py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">02 — Services</p>
          <h2 className="mt-4 max-w-xl text-[26px] font-medium leading-tight tracking-tight text-neutral-100 sm:text-[32px]">
            Three things we do well, and nothing else.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ITEMS.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i === 1 ? 'reveal-delay-1' : i === 2 ? 'reveal-delay-2' : ''}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.04]"
            >
              <h3 className="text-[16px] font-semibold tracking-tight text-white">{item.title}</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-neutral-400">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
