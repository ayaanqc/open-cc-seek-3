/**
 * Premium pill CTA matching the reference aesthetic. Hover lifts the button
 * and brightens the gradient glow; active state presses down slightly.
 */
export default function Btn({ children, href, onClick, variant = 'primary', className = '' }) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';

  return (
    <a
      href={href}
        onClick={onClick}
        className={`
          inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full
          font-sans text-[12.5px] font-bold tracking-widest uppercase
          transition-all duration-300 ${className}
        `}
        style={{
          background: isPrimary
            ? 'linear-gradient(135deg, #a855f7 0%, #ec4899 55%, #8b5cf6 100%)'
            : 'rgba(255,255,255,0.06)',
          color: isPrimary || isGhost ? '#05050a' : '#ffffff',
          boxShadow: isPrimary
            ? '0 18px 40px -12px rgba(168, 85, 247, 0.45), 0 0 0 1px rgba(168, 85, 247, 0.18)'
            : isGhost
            ? '0 10px 24px -6px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.10)'
            : '',
        }}
    >
      {children}
    </a>
  );
}
