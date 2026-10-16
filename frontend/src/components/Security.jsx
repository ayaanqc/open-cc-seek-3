import Reveal from './Reveal.jsx';

const POINTS = [
  'Your data stays yours — scoped access, revoked on handoff.',
  'Every model touchpoint is logged and reviewable.',
  'Human sign-off on anything customer-facing.',
  'Weekly plain-English notes on what the system did and why.',
];

export default function Security() {
  return (
    <section id="security" className="relative border-t border-white/8 py-28 sm:py-36 bg-black overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 80% 30%, rgba(168,85,247,0.08) 0%, transparent 40%)',
        }}
      />
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10 grid gap-12 items-center lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-500 mb-3">03 — AI Security</p>
          <h2 className="text-[28px] font-medium leading-[1.2] tracking-tight text-white sm:text-[36px]">
            Careful with your data, explicit about the machine.
          </h2>
          <p className="mt-5 max-w-md text-[13.5px] leading-relaxed text-neutral-400">
            We use AI where it earns its place and say so each time. Nothing trains on
            your data without your written say-so, and a person reviews everything
            before it reaches your customers.
          </p>
        </Reveal>
        <Reveal delay="0.12">
          <ul className="divide-y divide-white/8 rounded-2xl border border-white/8 bg-white/[0.02]">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 px-6 py-5 hover:bg-white/[0.03] transition-colors">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                <span className="text-[13.5px] leading-relaxed text-neutral-300">{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
