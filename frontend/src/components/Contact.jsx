import { useState } from 'react';
import api from '../lib/api.js';
import Reveal from './Reveal.jsx';

const EMPTY = { name: '', email: '', company: '', message: '' };

/**
 * Contact — posts to POST /api/contact (same contract as the backend
 * expects: name, email, optional company, message). Pill inputs, white
 * pill submit, inline field errors.
 */
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
    setStatus('sending');
    setMessage('');
    setFieldErrors({});
    try {
      const res = await api.submitContact(form);
      setStatus('success');
      setMessage(res.message || 'Thanks — your note is with us.');
      setForm(EMPTY);
    } catch (err) {
      setStatus('error');
      if (err.fields) {
        setFieldErrors(err.fields);
        setMessage('A couple of fields need attention.');
      } else {
        setMessage(err.message || 'Something went wrong. Please try again.');
      }
    }
  };

  const inputClass = (key) =>
    `w-full rounded-full border bg-white/[0.04] px-5 py-3 text-[13px] text-neutral-100 placeholder:text-neutral-600 transition-colors duration-200 focus:outline-none ${
      fieldErrors[key] ? 'border-red-500/70' : 'border-white/10 focus:border-white/30'
    }`;

  return (
    <section id="contact" className="relative border-t border-white/10 py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">05 — Contact</p>
          <h2 className="mt-4 text-[26px] font-medium leading-tight tracking-tight text-neutral-100 sm:text-[32px]">
            Tell us what you are building.
          </h2>
          <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-neutral-400">
            A few sentences is plenty. A person — not a pipeline — reads every note
            and replies within two business days.
          </p>
          <p className="mt-8 font-mono text-[12px] text-neutral-600">hello@opticore.studio</p>
        </Reveal>

        <Reveal delay={0.12}>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Your name"
                  className={inputClass('name')}
                />
                {fieldErrors.name && <p className="mt-2 pl-5 text-[11px] text-red-400">{fieldErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="Email address"
                  className={inputClass('email')}
                />
                {fieldErrors.email && <p className="mt-2 pl-5 text-[11px] text-red-400">{fieldErrors.email}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="company" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                Company <span className="normal-case tracking-normal">(optional)</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={form.company}
                onChange={update('company')}
                placeholder="Company (optional)"
                className={inputClass('company')}
              />
              {fieldErrors.company && <p className="mt-2 pl-5 text-[11px] text-red-400">{fieldErrors.company}</p>}
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                Project details
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={update('message')}
                placeholder="What are you building, and what does success look like?"
                className={`${inputClass('message')} resize-none rounded-[24px]`}
              />
              {fieldErrors.message && <p className="mt-2 pl-5 text-[11px] text-red-400">{fieldErrors.message}</p>}
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="rounded-full bg-white px-7 py-3 text-[12.5px] font-semibold text-black transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : 'Send inquiry →'}
            </button>
            {message && (
              <p role="status" className={`pl-1 text-[12.5px] ${status === 'success' ? 'text-neutral-300' : 'text-red-400'}`}>
                {message}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
