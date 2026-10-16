import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal.jsx';

function useCountUp(target, started, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return undefined;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t) => {
      const k = Math.max(0, Math.min(1, (t - t0) / duration));
      const eased = 1 - Math.pow(1 - k, 3);
      setValue(target * eased);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);
  return value;
}

const STATS = [
  { value: 48, suffix: '', label: 'Projects shipped with client teams' },
  { value: 12, suffix: 'ms', label: 'Median API latency in production' },
  { value: 99.98, suffix: '%', label: 'Sync reliability across clusters', decimals: 2 },
  { value: 9, suffix: ' yrs', label: 'Average seniority on the team' },
];

function Stat({ stat, started }) {
  const v = useCountUp(stat.value, started);
  const text = stat.decimals ? v.toFixed(stat.decimals) : Math.round(v).toString();
  return (
    <div className="group px-6 py-8 text-center sm:py-10">
      <p className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
        {text}
        <span className="text-purple-400">{stat.suffix}</span>
      </p>
      <p className="mx-auto mt-3 max-w-[220px] text-[12.5px] leading-relaxed text-neutral-500">{stat.label}</p>
    </div>
  );
}

/** Animated stats band — numbers count up once on scroll into view. */
export default function Stats() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setStarted(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative border-y border-white/10 bg-white/[0.015]" aria-label="Studio statistics">
      <Reveal>
        <div ref={ref} className="mx-auto grid max-w-[1200px] grid-cols-2 divide-white/10 px-2 sm:px-8 lg:grid-cols-4 lg:divide-x">
          {STATS.map((s) => (
            <Stat key={s.label} stat={s} started={started} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
