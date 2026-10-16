import { useEffect, useState } from 'react';
import MagneticBtn from './MagneticBtn.jsx';

const LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'How it works', href: '#how' },
  { label: 'AI Security', href: '#security' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Resources', href: '#resources' },
];

/** Glass nav: wordmark left, centered pill links, magnetic CTA right, mobile menu. */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{
        background: scrolled || open ? 'rgba(0,0,0,0.82)' : 'transparent',
        backdropFilter: scrolled || open ? 'blur(20px)' : 'none',
        borderBottom: `1px solid ${scrolled || open ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
      }}
    >
      <nav className="relative mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <a href="#top" className="text-[18px] font-semibold tracking-tighter text-white">
          opticore
        </a>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 rounded-full border border-white/10 bg-white/[0.04] px-8 py-2.5 backdrop-blur-md md:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="whitespace-nowrap text-[12px] font-medium text-neutral-400 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <MagneticBtn href="#contact" variant="white" className="hidden sm:inline-flex">
            Get started
          </MagneticBtn>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white md:hidden"
          >
            <span aria-hidden className="relative block h-[10px] w-4">
              <span className={`absolute left-0 top-0 h-px w-4 bg-white transition-transform duration-300 ${open ? 'translate-y-[4.5px] rotate-45' : ''}`} />
              <span className={`absolute left-0 bottom-0 h-px w-4 bg-white transition-transform duration-300 ${open ? '-translate-y-[4.5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <nav aria-label="Mobile" className="border-t border-white/10 px-5 pb-6 pt-3 md:hidden">
          <ul className="space-y-1">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-[14px] text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-3 sm:hidden">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-white px-5 py-3 text-center text-[13px] font-semibold text-black"
              >
                Get started
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
