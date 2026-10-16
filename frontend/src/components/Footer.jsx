export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-14 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-[9px] font-bold text-white">
            O
          </span>
          <span className="font-display text-[14px] font-bold tracking-tighter text-white">OPTICORE</span>
        </div>

        <div className="flex flex-wrap items-center gap-8 text-[12px] font-medium text-mute uppercase tracking-widest">
          <a href="#top" className="transition-colors hover:text-white">Home</a>
          <a href="#about" className="transition-colors hover:text-white">About</a>
          <a href="#services" className="transition-colors hover:text-white">Services</a>
          <a href="#process" className="transition-colors hover:text-white">Process</a>
          <a href="#clients" className="transition-colors hover:text-white">Clients</a>
        </div>

        <p className="text-[11px] text-mute">
          © {new Date().getFullYear()} Opticore. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
