import React from 'react';

const bentoItems = [
  {
    title: 'Neural Architecture',
    desc: 'Self-adapting model frameworks designed to scale across heterogeneous clusters without throughput degradation.',
    tag: 'Core Compute',
    colSpan: 'col-span-12 md:col-span-8',
    graphic: (
      <div className="relative h-32 w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-sky-500/10 to-transparent blur-xl" />
        <div className="font-mono text-xs text-zinc-500 space-y-1">
          <div>[opt-0] weights synced :: latency 1.2ms</div>
          <div className="text-purple-400">[opt-1] dynamic context allocation: 128k ok</div>
          <div>[opt-2] zero-knowledge telemetry verified</div>
        </div>
      </div>
    ),
  },
  {
    title: 'Biometric Feedback',
    desc: 'Low-latency somatic interfaces mapping non-verbal intent directly to execution pipelines.',
    tag: 'Intuitive AI',
    colSpan: 'col-span-12 md:col-span-4',
    graphic: (
      <div className="h-32 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border border-rose-500/30 flex items-center justify-center animate-ping">
          <div className="w-8 h-8 rounded-full border border-purple-500/50" />
        </div>
      </div>
    ),
  },
  {
    title: 'Autonomous Drift Detection',
    desc: 'Continuous real-time auditing guarantees zero semantic degradation over long-horizon reasoning runs.',
    tag: 'Safety & Audit',
    colSpan: 'col-span-12 md:col-span-4',
    graphic: (
      <div className="h-32 flex items-center justify-center">
        <div className="flex gap-1.5 items-end h-16">
          {[40, 65, 30, 85, 95, 75, 60, 90].map((h, i) => (
            <div
              key={i}
              className="w-2 bg-gradient-to-t from-purple-500 to-sky-400 rounded-t-sm"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Unified Control Plane',
    desc: 'A single, consolidated interface bridging deterministic systems with emergent probabilistic agents.',
    tag: 'Operations',
    colSpan: 'col-span-12 md:col-span-8',
    graphic: (
      <div className="h-32 flex items-center justify-center">
        <div className="border border-white/10 rounded-md p-3 bg-zinc-950/60 backdrop-blur-md flex gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300">Cluster 01: Optimal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span className="text-zinc-300">Sync: 99.98%</span>
          </div>
        </div>
      </div>
    ),
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      <div className="mb-16">
        <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-purple-400 mb-3">
          Capabilities Matrix
        </h2>
        <p className="text-3xl md:text-4xl font-light tracking-tight text-white max-w-xl">
          Engineered for the threshold where computation mirrors consciousness.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {bentoItems.map((item, idx) => (
          <div
            key={idx}
            className={`${item.colSpan} group relative rounded-xl border border-white/10 bg-zinc-900/40 p-6 md:p-8 backdrop-blur-md overflow-hidden hover:border-white/20 transition-all duration-300`}
          >
            {/* Ambient hover glow */}
            <div className="absolute -inset-px bg-gradient-to-b from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-400">
                  {item.tag}
                </span>
                <h3 className="text-xl font-medium text-white mt-4 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-400 font-light mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {item.graphic}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
