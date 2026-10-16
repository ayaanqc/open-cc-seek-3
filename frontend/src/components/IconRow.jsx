/** Faint dotted-icon row beneath the visual, as in the reference. */
export default function IconRow() {
  const cls = 'h-[22px] w-[22px] text-neutral-800';
  return (
    <div className="mt-2 flex items-center justify-center gap-8" aria-hidden>
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 4v10m0 0l-4-4m4 4l4-4M5 19h14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="6" y="6" width="12" height="12" rx="1.5" />
      </svg>
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 12h6m-2-3l3 3-3 3M14 12h6m-3-3l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="6.5" />
      </svg>
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M14.5 6.5a4 4 0 0 0-5.6 4.8L4 16.2V20h3.8l4.9-4.9a4 4 0 0 0 4.8-5.6l-2.7 2.7-2.1-2.1 1.8-3.6z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
