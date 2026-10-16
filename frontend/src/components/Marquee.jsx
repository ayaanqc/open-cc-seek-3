const ITEMS = [
  'Product Strategy',
  'Interface Design',
  'Platform Engineering',
  'AI Security',
  'Design Systems',
  'Rapid Prototyping',
];

/**
 * Infinite marquee band. Pure CSS animation, duplicated list for a seamless
 * loop, pauses on hover. Reduced-motion safe via CSS.
 */
export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-black py-4" aria-hidden>
      <div className="marquee-track flex w-max items-center gap-10">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span className="text-[12px] font-medium uppercase tracking-[0.24em] text-neutral-500">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-purple-400/70" />
          </span>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent" />
    </div>
  );
}
