import { useRef, useState } from 'react';
import { useReveal } from '../lib/effects.js';
import Btn from './Btn.jsx';

const LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Clients', href: '#clients' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  useReveal(navRef, { threshold: 0.05 });

  const handleScroll = () => setScrolled(window.scrollY > 10);
  const activeHash = () => {
    const hash = window.location.hash;
    return hash || '#top';
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed inset-x-0 top-0 z-50 transition-all duration-400"
        style={{
          background: scrolled
            ? 'rgba(5, 5, 10, 0.85)'
            : 'rgba(5, 5, 10, 0.35)',
          backdropFilter: scrolled ? 'blur(24px)' : 'blur(16px)',
          borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.12)' : 'transparent'}`,
        }}
      >
        <div className="mx-auto max-w-7xl h-16 flex items-center justify-between px-6 lg:px-10">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-[9px] font-bold text-white">
              O
            </span>
            <span className="font-display text-[15px] font-bold tracking-tighter text-white">
              OPTICORE
            </span>
          </a>

          {/* Centered links */}
          <div className="hidden md:flex items-center gap-8 text-[12px] font-medium text-mute uppercase tracking-widest">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`transition-colors duration-300 ${
                  activeHash() === link.href.toLowerCase()
                    ? 'text-white'
                    : 'text-mute hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <Btn href="#contact" variant="primary">
            Start a Project
          </Btn>
        </div>
      </nav>
    </>
  );
}
