import Reveal from './Reveal.jsx';

const STEPS = [
  {
    n: '01',
    title: 'Tell us where it hurts',
    body: 'A 30-minute conversation about the outcome you need. No decks, no discovery theater — we listen first and repeat back what we heard.',
  },
  {
    n: '02',
    title: 'See it in a week',
    body: 'A working slice in seven days: real interface, real data, real trade-offs. You react to something tangible instead of a proposal.',
  },
  {
    n: '03',
    title: 'Ship it with your team',
    body: 'We embed, build in the open, and hand over clean systems your engineers own. Nothing precious, nothing locked away.',
  },
];

/** How it works — plain-spoken three steps on black. */
export default function HowItWorks() {
  return (
    <section id="how" className="relative border-t border-white/10 py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">01 — How it works</p>
          <h2 className="mt-4 max-w-xl text-[26px] font-medium leading-tight tracking-tight text-neutral-100 sm:text-[32px]">
            Built to work the way teams actually work.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i === 1 ? 'reveal-delay-1' : i === 2 ? 'reveal-delay-2' : ''} className="bg-black p-8">
              <p className="font-mono text-[11px] text-neutral-600">{s.n}</p>
              <h3 className="mt-4 text-[16px] font-semibold tracking-tight text-white">{s.title}</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-neutral-400">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
