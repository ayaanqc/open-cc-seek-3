import { useEffect, useState } from 'react';

const LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'How it works', href: '#how' },
  { label: 'AI Security', href: '#security' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Resources', href: '#resources' },
];

/** Top bar matching the reference: lowercase wordmark, centered pill nav, white pill CTA. */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{ background: scrolled ? 'rgba(0,0,0,0.82)' : 'transparent', backdropFilter: scrolled ? 'blur(16px)' : 'none' }}
    >
      <nav className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-5 sm:px-8">
        <a href="#top" className="text-[17px] font-semibold tracking-tight text-white">
          opticore
        </a>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 rounded-full border border-white/10 bg-white/[0.05] px-7 py-2.5 backdrop-blur-md lg:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="whitespace-nowrap text-[12px] font-normal text-neutral-400 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="rounded-full bg-white px-[18px] py-2 text-[12.5px] font-semibold text-black transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
        >
          Get started
        </a>
      </nav>
    </header>
  );
}
