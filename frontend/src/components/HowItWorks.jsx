import React from 'react';

const steps = [
  {
    num: '01',
    name: 'Ingestion & Alignment',
    detail: 'Continuous telemetry capture establishes baseline human behavioral patterns without invasive tracking.',
  },
  {
    num: '02',
    name: 'Latent Space Synthesis',
    detail: 'High-dimensional embeddings bridge implicit intent directly into modular, executable actions.',
  },
  {
    num: '03',
    name: 'Co-Adaptive Execution',
    detail: 'Feedback loops ensure deterministic guardrails while allowing the system to dynamically learn edge cases.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-24 px-6 border-t border-white/5 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-sky-400 mb-3">
              The Protocol
            </h2>
            <p className="text-3xl font-light tracking-tight text-white max-w-md">
              A frictionless handoff from intuition to algorithmic execution.
            </p>
          </div>
          <span className="font-mono text-xs text-zinc-500">
            [ ARCHITECTURE OVERVIEW v2.4 ]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-lg border border-white/5 bg-zinc-950/40 backdrop-blur-sm group hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="text-4xl font-mono text-zinc-700 group-hover:text-purple-400 transition-colors duration-300 mb-6 font-light">
                {s.num}
              </div>
              <h3 className="text-lg font-medium text-white mb-2 tracking-tight">
                {s.name}
              </h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
