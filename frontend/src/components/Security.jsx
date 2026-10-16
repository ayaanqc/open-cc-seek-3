import Reveal from './Reveal.jsx';

const POINTS = [
  'Your data stays yours — scoped access, revoked on handoff.',
  'Every model touchpoint is logged and reviewable.',
  'Human sign-off on anything customer-facing.',
  'Weekly plain-English notes on what the system did and why.',
];

/** AI Security — reassurance in concrete terms, not slogans. */
export default function Security() {
  return (
    <section id="security" className="relative border-t border-white/10 py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">03 — AI Security</p>
          <h2 className="mt-4 text-[26px] font-medium leading-tight tracking-tight text-neutral-100 sm:text-[32px]">
            Careful with your data, explicit about the machine.
          </h2>
          <p className="mt-5 max-w-md text-[13.5px] leading-relaxed text-neutral-400">
            We use AI where it earns its place and say so each time. Nothing trains on
            your data without your written say-so, and a person reviews everything
            before it reaches your customers.
          </p>
        </Reveal>
        <Reveal delay="reveal-delay-1">
          <ul className="divide-y divide-white/10 rounded-2xl border border-white/10">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 px-6 py-5">
                <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="text-[13.5px] leading-relaxed text-neutral-300">{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
