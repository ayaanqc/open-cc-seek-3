import { useState } from 'react';
import api from '../lib/api.js';
import { useReveal } from '../lib/effects.js';
import Btn from './Btn.jsx';

const EMPTY = { name: '', email: '', company: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending'); setMessage(''); setFieldErrors({});
    try {
      const res = await api.submitContact(form);
      setStatus('success'); setMessage(res.message || 'Inquiry received.');
      setForm(EMPTY);
    } catch (err) {
      setStatus('error');
      if (err.fields) { setFieldErrors(err.fields); setMessage('Please correct the highlighted fields.'); }
      else { setMessage(err.message || 'Something went wrong. Please try again.'); }
    }
  };

  const inputClass = (key) =>
    `w-full rounded-full border bg-white/[0.04] px-6 py-3 text-[13px] text-white placeholder:text-mute/50 transition-all duration-300 focus:outline-none ${
      fieldErrors[key] ? 'border-red-500/70' : 'border-white/10 focus:border-accent-purple'
    }`;

  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/5 py-28 lg:py-36">
      <div aria-hidden className="absolute inset-0 -z-10" style={{
        background: 'radial-gradient(ellipse at 60% 10%, rgba(168,85,247,0.12) 0%, transparent 40%)'
      }} />
      <div className="relative mx-auto max-w-5xl px-6 lg:px-12 grid gap-12 lg:grid-cols-2">
        <div className="reveal reveal-delay-1 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="h-2 w-8 bg-gradient-to-r from-accent-purple to-accent-pink rounded-full" aria-hidden />
            <span className="font-display text-xs font-bold tracking-[0.28em] text-mute uppercase">Section 02</span>
          </div>
          <h2 className="font-display text-3xl font-bold leading-none tracking-tightest text-white sm:text-4xl">
            Start a Project
          </h2>
          <p className="mt-6 text-[14px] leading-relaxed text-mute max-w-md">
            Tell us what you are building. A senior member of our team will reply within
            two business days to scope the engagement.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-purple" />
              <span className="text-[13px] text-mute">hello@opticore.studio</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-purple" />
              <span className="text-[13px] text-mute">opticore.studio</span>
            </div>
          </div>
        </div>
        <div className="reveal reveal-delay-2">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-widest text-mute">Name</label>
                <input id="name" name="name" type="text" value={form.name} onChange={update('name')} placeholder="Jane Doe" className={inputClass('name')} />
                {fieldErrors.name && <p className="text-[11px] text-red-400">{fieldErrors.name}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-widest text-mute">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={update('email')} placeholder="jane@company.com" className={inputClass('email')} />
                {fieldErrors.email && <p className="text-[11px] text-red-400">{fieldErrors.email}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="company" className="font-mono text-[10px] uppercase tracking-widest text-mute">Company <span className="tracking-normal">(optional)</span></label>
              <input id="company" name="company" type="text" value={form.company} onChange={update('company')} placeholder="Acme Inc." className={inputClass('company')} />
              {fieldErrors.company && <p className="text-[11px] text-red-400">{fieldErrors.company}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="font-mono text-[10px] uppercase tracking-widest text-mute">Project details</label>
              <textarea id="message" name="message" rows={4} value={form.message} onChange={update('message')} placeholder="What are you building?" className={`${inputClass('message')} resize-none`} />
              {fieldErrors.message && <p className="text-[11px] text-red-400">{fieldErrors.message}</p>}
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-bold text-[12.5px] uppercase tracking-widest transition-all duration-300 text-void bg-gradient-to-r from-accent-purple to-accent-pink shadow-[0_18px_40px_-12px_rgba(168,85,247,0.45)] hover:shadow-[0_18px_40px_-10px_rgba(168,85,247,0.6)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Sending…' : 'Send Inquiry'}
            </button>
          </form>
          {message && (
            <p role="status" className={`text-[12px] font-medium ${status === 'success' ? 'text-accent-pink' : 'text-red-400'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
