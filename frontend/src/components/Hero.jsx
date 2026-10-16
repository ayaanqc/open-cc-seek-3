import CrystalCore from './CrystalCore.jsx';
import IconRow from './IconRow.jsx';
import ParticleHands from './ParticleHands.jsx';
import Reveal from './Reveal.jsx';

/** Centered hero mirroring the reference: headline, mono sub, white pill CTA, dotted-hands visual. */
export default function Hero() {
  return (
    <section id="top" className="grain relative overflow-hidden pt-[136px]">
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h1 className="text-[30px] font-medium leading-[1.18] tracking-[-0.02em] text-neutral-100 sm:text-[38px]">
            When intelligence reaches out
            <br />
            <span className="text-neutral-400">to instinct, the future takes shape</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md font-mono text-[11.5px] leading-relaxed text-neutral-500">
            an unlikely alliance - where human intuition
            <br />
            and algorithmic precision move as one
          </p>
          <div className="mt-7 flex justify-center">
            <a
              href="#how"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[12.5px] font-semibold text-black transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98]"
            >
              See it in action
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay="reveal-delay-1" className="relative mt-4">
          <div className="relative mx-auto h-[380px] max-w-[1200px] sm:h-[460px] lg:h-[520px]">
            <ParticleHands className="absolute inset-0" />
            <CrystalCore />
          </div>
          <IconRow />
        </Reveal>
      </div>
    </section>
  );
}
