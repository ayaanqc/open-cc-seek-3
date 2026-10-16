import { useState, useEffect } from 'react';
import MagneticBtn from './MagneticBtn.jsx';

const LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'How it works', href: '#how' },
  { label: 'AI Security', href: '#security' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Resources', href: '#resources' },
];

/** Glass nav: wordmark left, centered links, magnetic white CTA right. */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(0,0,0,0.7)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
      }}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-6 sm:px-10">
        <a href="#top" className="text-[18px] font-semibold tracking-tighter text-white">
          opticore
        </a>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 rounded-full border border-white/8 bg-white/[0.03] px-9 py-2.5 backdrop-blur-md lg:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="relative whitespace-nowrap text-[12px] font-medium text-neutral-400 transition-colors duration-300 hover:text-white"
              >
                <span
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"
                />
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <MagneticBtn href="#contact" variant="white">
          Get started
        </MagneticBtn>
      </nav>
    </header>
  );
}
