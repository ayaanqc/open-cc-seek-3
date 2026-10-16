export default function Footer() {
  return (
    <footer id="resources" className="border-t border-white/8 bg-black">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <a href="#top" className="text-[17px] font-semibold tracking-tighter text-white">
          opticore
        </a>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[12px] text-neutral-500">
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
