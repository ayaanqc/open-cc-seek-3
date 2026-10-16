const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="h-5 w-5 rounded-[3px]"
            style={{ background: 'linear-gradient(135deg, #C724E8 0%, #7C3AED 100%)' }}
          />
          <span className="text-[15px] font-semibold tracking-tight">Opticore</span>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-7">
            {NAV.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-[13px] text-mute transition-colors duration-200 hover:text-bone"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-[12px] text-mute">© {new Date().getFullYear()} Opticore. All rights reserved.</p>
      </div>
    </footer>
  );
}
