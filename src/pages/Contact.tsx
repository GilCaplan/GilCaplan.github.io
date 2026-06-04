import { useState } from 'react';
import { profile } from '../data/profile';

// Formspree form (https://formspree.io/f/xpqezwgp) — submissions email rockycaplan@gmail.com.
// Empty string would fall back to a mailto: link.
const FORMSPREE_ID = 'xpqezwgp';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!FORMSPREE_ID) return; // mailto fallback handles it
    const form = e.currentTarget;
    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error();
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="container-x animate-fade-up py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">Get in touch</h1>
      <p className="mt-2 max-w-xl text-muted">
        Open to research and project collaborations. Drop a message, or reach me directly at{' '}
        <a className="link" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        .
      </p>

      {!FORMSPREE_ID && (
        <p className="mt-4 rounded-lg border border-line bg-app px-4 py-3 text-sm text-muted">
          Note: add a Formspree form ID in <span className="font-mono text-ink2">Contact.tsx</span>{' '}
          to enable the form. For now, the button opens your email client.
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-8 max-w-xl space-y-4">
        <Field label="Name" name="name" />
        <Field label="Email" name="email" type="email" />
        <div>
          <label className="mb-1 block text-sm text-ink2">Message</label>
          <textarea
            name="message"
            required
            rows={5}
            className="w-full rounded-lg border border-line bg-app px-4 py-2 text-sm text-ink2 outline-none focus:border-accent"
          />
        </div>

        {FORMSPREE_ID ? (
          <button type="submit" className="btn-accent" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        ) : (
          <a className="btn-accent" href={`mailto:${profile.email}`}>
            Email me
          </a>
        )}

        {status === 'sent' && <p className="text-sm text-accent">Thanks — message sent!</p>}
        {status === 'error' && (
          <p className="text-sm text-spice">Something went wrong. Please email me directly.</p>
        )}
      </form>
    </div>
  );
}

function Field({ label, name, type = 'text' }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-ink2">{label}</label>
      <input
        name={name}
        type={type}
        required
        className="w-full rounded-lg border border-line bg-app px-4 py-2 text-sm text-ink2 outline-none focus:border-accent"
      />
    </div>
  );
}
