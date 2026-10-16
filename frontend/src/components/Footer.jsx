/** Minimal footer doubling as the Resources anchor. */
export default function Footer() {
  return (
    <footer id="resources" className="border-t border-white/10">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-[15px] font-semibold tracking-tight text-white">opticore</p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-neutral-500">
            <li><a href="#services" className="transition-colors hover:text-white">Services</a></li>
            <li><a href="#how" className="transition-colors hover:text-white">How it works</a></li>
            <li><a href="#security" className="transition-colors hover:text-white">AI Security</a></li>
            <li><a href="#integrations" className="transition-colors hover:text-white">Integrations</a></li>
            <li><a href="#contact" className="transition-colors hover:text-white">Contact</a></li>
          </ul>
        </nav>
        <p className="font-mono text-[11px] text-neutral-600">© {new Date().getFullYear()} opticore studio</p>
      </div>
    </footer>
  );
}
