import Reveal from './Reveal.jsx';

const TOOLS = ['Slack', 'Figma', 'GitHub', 'Linear', 'Notion', 'Vercel'];

export default function Integrations() {
  return (
    <section id="integrations" className="relative border-t border-white/8 py-20 sm:py-28 bg-black">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <Reveal className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-500 mb-3">04 — Integrations</p>
            <h2 className="text-[22px] font-medium tracking-tight text-white sm:text-[26px]">
              We meet you in the tools you already use.
            </h2>
          </div>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {TOOLS.map((tool) => (
              <li
                key={tool}
                className="group relative flex items-center gap-2 text-[13px] font-medium text-neutral-500 transition-colors hover:text-white"
              >
                <span className="w-1 h-1 rounded-full bg-current opacity-0 group-hover:opacity-100 transition-opacity" />
                {tool}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
