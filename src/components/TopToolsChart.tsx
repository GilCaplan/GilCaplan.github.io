import { useEffect, useMemo, useRef, useState } from 'react';
import { buildStack, CATEGORY_META, CATEGORY_ORDER, type TechCategory } from '../lib/techStack';

// A reusable "most-used tools" horizontal bar chart, derived live from the
// project registry (so it auto-updates as projects change). Bars are colored
// by category, grow in on first view, and a category filter narrows the list.
export default function TopToolsChart({
  limit = 12,
  filterable = false,
}: {
  limit?: number;
  filterable?: boolean;
}) {
  const stack = useMemo(() => buildStack(), []);
  const [active, setActive] = useState<TechCategory | 'all'>('all');
  const [grown, setGrown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Grow the bars in when the chart scrolls into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setGrown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pool = active === 'all' ? stack.tools : stack.tools.filter((t) => t.category === active);
  const rows = pool.slice(0, limit);
  const maxCount = rows[0]?.count ?? 1;
  // Legend categories, in canonical order. When the chart is a filter (Stack
  // page) show every category so you can filter to it; otherwise (About) only
  // show categories that actually have a bar in the displayed rows — no orphan
  // legend colors for tools that didn't make the top-N.
  const cats = CATEGORY_ORDER.filter((c) =>
    filterable
      ? stack.categories.some((s) => s.category === c)
      : rows.some((t) => t.category === c),
  );

  return (
    <div ref={ref}>
      {/* Legend / filter */}
      <div className="mb-4 flex flex-wrap gap-x-3 gap-y-1.5">
        {filterable && (
          <LegendItem
            dot="bg-ink2"
            label="All"
            active={active === 'all'}
            onClick={() => setActive('all')}
          />
        )}
        {cats.map((c) => (
          <LegendItem
            key={c}
            dot={CATEGORY_META[c].dot}
            label={c}
            active={!filterable || active === 'all' || active === c}
            onClick={filterable ? () => setActive(active === c ? 'all' : c) : undefined}
          />
        ))}
      </div>

      {/* Bars */}
      <div className="space-y-2">
        {rows.map((t, i) => {
          const pct = Math.max(7, (t.count / maxCount) * 100);
          return (
            <div
              key={t.name}
              className="group relative grid grid-cols-[7.5rem_1fr_1.5rem] items-center gap-3 sm:grid-cols-[9rem_1fr_1.75rem]"
            >
              <div className="flex items-center justify-end gap-1.5 truncate text-sm text-ink2">
                <span className={`h-2 w-2 shrink-0 rounded-full ${CATEGORY_META[t.category].dot}`} />
                <span className="truncate">{t.name}</span>
              </div>
              <div className="h-6 overflow-hidden rounded-md bg-app ring-1 ring-line/60">
                <div
                  className={`flex h-full items-center rounded-md ${CATEGORY_META[t.category].dot} opacity-85 transition-all duration-700 ease-out group-hover:opacity-100`}
                  style={{
                    width: grown ? `${pct}%` : '0%',
                    transitionDelay: `${i * 45}ms`,
                  }}
                />
              </div>
              <div className="text-right font-mono text-xs text-muted">{t.count}</div>

              {/* Hover tooltip: which projects use this tool */}
              <div className="pointer-events-none absolute left-[7.5rem] top-full z-30 mt-1 hidden w-max max-w-[18rem] rounded-lg border border-line bg-ink/95 p-2.5 text-xs shadow-xl backdrop-blur group-hover:block sm:left-[9rem]">
                <div className="mb-1 flex items-center gap-1.5 font-medium text-ink2">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${CATEGORY_META[t.category].dot}`} />
                  {t.name} · {t.count} project{t.count > 1 ? 's' : ''} · {t.category}
                </div>
                <ul className="space-y-0.5 text-muted">
                  {t.projects.map((p) => (
                    <li key={p.slug} className="truncate">
                      {p.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LegendItem({
  dot,
  label,
  active,
  onClick,
}: {
  dot: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-xs transition ${
        active ? 'text-ink2' : 'text-muted/50'
      } ${onClick ? 'cursor-pointer hover:text-ink2' : ''}`}
    >
      <span className={`h-2 w-2 rounded-full ${dot} ${active ? '' : 'opacity-40'}`} />
      {label}
    </Tag>
  );
}
