import { useEffect, useState } from 'react';
import { setSpotlight, spotlightOn } from '../lib/spotlight';

// Small nav button to turn the cursor spotlight on/off (default on).
export default function SpotlightToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    setOn(spotlightOn());
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    setSpotlight(next);
  };

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={on}
      title={`Cursor glow is ${on ? 'on' : 'off'} — click to turn it ${on ? 'off' : 'on'}`}
      aria-label="Toggle cursor glow"
      className={`ml-1 inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
        on
          ? 'border-accent/60 text-accent'
          : 'border-line text-muted hover:border-accent/50 hover:text-ink2'
      }`}
    >
      {/* sun / glow glyph: filled when on, outline + faded when off */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="3.6" fill={on ? 'currentColor' : 'none'} />
        <g opacity={on ? 1 : 0.45}>
          <line x1="12" y1="2.5" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="21.5" />
          <line x1="2.5" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="21.5" y2="12" />
          <line x1="5.3" y1="5.3" x2="7" y2="7" />
          <line x1="17" y1="17" x2="18.7" y2="18.7" />
          <line x1="18.7" y1="5.3" x2="17" y2="7" />
          <line x1="7" y1="17" x2="5.3" y2="18.7" />
        </g>
      </svg>
    </button>
  );
}
