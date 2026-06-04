import { useState } from 'react';

export default function Tabs({ tabs }: { tabs: { label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="flex flex-wrap gap-1 border-b border-line/70">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm transition ${
              active === i
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-ink2'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="pt-6">{tabs[active].content}</div>
    </div>
  );
}
