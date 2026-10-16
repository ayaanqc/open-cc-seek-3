import Reveal from './Reveal.jsx';

const TOOLS = ['Slack', 'Figma', 'GitHub', 'Linear', 'Notion', 'Vercel'];

/** Integrations — a single quiet row of tools we already live in. */
export default function Integrations() {
  return (
    <section id="integrations" className="relative border-t border-white/10 py-20">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">04 — Integrations</p>
            <h2 className="mt-3 text-[20px] font-medium tracking-tight text-neutral-100">
              We meet you in the tools you already use.
            </h2>
          </div>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {TOOLS.map((tool) => (
              <li key={tool} className="text-[14px] font-medium text-neutral-600 transition-colors duration-200 hover:text-neutral-300">
                {tool}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
