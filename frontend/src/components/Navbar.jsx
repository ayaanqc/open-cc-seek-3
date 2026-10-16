import { useEffect, useState } from 'react';

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
];

/**
 * Top navigation. Fixed, with a hairline border that appears once the page
 * scrolls. Rectangular CTA on the right, no pill shapes.
 */
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
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-white/10 bg-void/80 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo slot */}
        <a href="#top" className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="h-5 w-5 rounded-[3px]"
            style={{ background: 'linear-gradient(135deg, #C724E8 0%, #7C3AED 100%)' }}
          />
          <span className="text-[15px] font-semibold tracking-tight">Opticore</span>
        </a>

        {/* Centered links */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-[13px] font-medium text-mute transition-colors duration-200 hover:text-bone"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Primary CTA — rectangular, sharp corners */}
        <a
          href="#contact"
          className="rounded-[4px] border border-white/15 px-4 py-2 text-[13px] font-medium text-bone transition-colors duration-200 hover:border-accent hover:bg-accent/10"
        >
          Start a Project
        </a>
      </nav>
    </header>
  );
}
