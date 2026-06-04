import { useEffect, useState } from 'react';

const PHRASES = [
  'agents & chatbots',
  'retrieval-augmented assistants',
  'interactive data visualizations',
  'a scripting language with Rust',
];

// Typewriter that cycles through the phrases above with a blinking caret.
// Reduced-motion users see the first phrase, static.
export default function RoleTyper() {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [i, setI] = useState(0);
  const [txt, setTxt] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) {
      setTxt(PHRASES[0]);
      return;
    }
    const full = PHRASES[i];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && txt === full) {
      t = setTimeout(() => setDeleting(true), 1500);
    } else if (deleting && txt === '') {
      setDeleting(false);
      setI((v) => (v + 1) % PHRASES.length);
    } else {
      t = setTimeout(
        () => setTxt(full.slice(0, txt.length + (deleting ? -1 : 1))),
        deleting ? 35 : 60,
      );
    }
    return () => clearTimeout(t);
  }, [txt, deleting, i, reduce]);

  return (
    <span className="text-accent">
      {txt}
      <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] animate-pulse-dot bg-accent" />
    </span>
  );
}
