import { useState } from 'react';
import api from '../lib/api.js';
import Reveal from './Reveal.jsx';

const EMPTY = { name: '', email: '', company: '', message: '' };

/**
 * Contact. Posts inquiries to the Express backend at POST /api/contact and
 * surfaces success and field-level errors inline.
 */
export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    setMessage('');
    setFieldErrors({});

    try {
      const res = await api.submitContact(form);
      setStatus('success');
      setMessage(res.message || 'Thanks. Your inquiry has been received.');
      setForm(EMPTY);
    } catch (err) {
      setStatus('error');
      if (err.fields) {
        setFieldErrors(err.fields);
        setMessage('Please correct the highlighted fields.');
      } else {
        setMessage(err.message || 'Something went wrong. Please try again.');
      }
    }
  };

  const inputClass = (key) =>
    `w-full rounded-[4px] border bg-white/[0.03] px-4 py-3 text-[14px] text-bone placeholder:text-mute/60 transition-colors duration-200 focus:outline-none ${
      fieldErrors[key] ? 'border-red-500/70' : 'border-white/12 focus:border-accent'
    }`;

  return (
    <section id="contact" className="relative border-t border-white/10 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-accent" aria-hidden />
            <span className="font-mono text-[11px] uppercase tracking-ultra text-mute">Start a project</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Tell us what you are building.
          </h2>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-mute">
            Share a few details and a senior member of our team will reply within two
            business days to scope the engagement.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block font-mono text-[11px] uppercase tracking-ultra text-mute">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Jane Doe"
                  className={inputClass('name')}
                />
                {fieldErrors.name && <p className="mt-2 text-[12px] text-red-400">{fieldErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block font-mono text-[11px] uppercase tracking-ultra text-mute">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="jane@company.com"
                  className={inputClass('email')}
                />
                {fieldErrors.email && <p className="mt-2 text-[12px] text-red-400">{fieldErrors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="company" className="mb-2 block font-mono text-[11px] uppercase tracking-ultra text-mute">
                Company <span className="normal-case tracking-normal">(optional)</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={form.company}
                onChange={update('company')}
                placeholder="Acme Inc."
                className={inputClass('company')}
              />
              {fieldErrors.company && <p className="mt-2 text-[12px] text-red-400">{fieldErrors.company}</p>}
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block font-mono text-[11px] uppercase tracking-ultra text-mute">
                Project details
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={update('message')}
                placeholder="What are you building, and what does success look like?"
                className={`${inputClass('message')} resize-none`}
              />
              {fieldErrors.message && <p className="mt-2 text-[12px] text-red-400">{fieldErrors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="rounded-[4px] bg-bone px-7 py-3 text-[13px] font-semibold tracking-tight text-void transition-colors duration-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : 'Send Inquiry'}
            </button>

            {message && (
              <p
                role="status"
                className={`text-[13px] ${status === 'success' ? 'text-accent-soft' : 'text-red-400'}`}
              >
                {message}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
