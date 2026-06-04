import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TopToolsChart from '../components/TopToolsChart';
import { buildStack, CATEGORY_META, type TechCategory } from '../lib/techStack';

export default function Stack() {
  const stack = useMemo(() => buildStack(), []);
  const [active, setActive] = useState<TechCategory | 'all'>('all');

  const shown =
    active === 'all' ? stack.categories : stack.categories.filter((c) => c.category === active);

  return (
    <div className="container-x animate-fade-up py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">Tech stack</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Every tool, language and framework across the portfolio — counted live from the project
        registry, so it stays in sync as projects are added or removed. Grouped by area; the number
        is how many projects use each one.
      </p>

      {/* Summary tiles */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile value={stack.totalTools} label="distinct tools" />
        <Tile value={stack.totalProjects} label="projects" />
        <Tile value={stack.totalCategories} label="areas" />
        <Tile value={stack.tools.reduce((s, t) => s + t.count, 0)} label="total tool-uses" />
      </div>

      {/* Category filter */}
      <div className="mt-8 flex flex-wrap gap-2">
        <Chip active={active === 'all'} onClick={() => setActive('all')} dot="bg-ink2">
          All areas
        </Chip>
        {stack.categories.map((c) => (
          <Chip
            key={c.category}
            active={active === c.category}
            onClick={() => setActive(c.category)}
            dot={CATEGORY_META[c.category].dot}
          >
            {c.category}
            <span className="ml-1.5 text-xs text-muted">{c.toolCount}</span>
          </Chip>
        ))}
      </div>

      {/* Top tools bar chart */}
      {active === 'all' && (
        <section className="mt-12">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
            Most-used tools
          </h2>
          <TopToolsChart limit={16} filterable />
        </section>
      )}

      {/* Category breakdown */}
      <div className="mt-12 space-y-8">
        {shown.map((c) => {
          const meta = CATEGORY_META[c.category];
          return (
            <section key={c.category}>
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line/60 pb-2">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${meta.dot}`} />
                  {c.category}
                </h2>
                <span className="text-xs text-muted">{meta.blurb}</span>
                <span className="ml-auto font-mono text-xs text-muted">
                  {c.toolCount} tools · {c.projectCount} projects
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {c.tools.map((t) => (
                  <span
                    key={t.name}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-app px-3 py-1 text-sm text-ink2"
                    title={`${t.name} — used in: ${t.projects.map((p) => p.title).join(', ')}`}
                  >
                    {t.name}
                    <span
                      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-ink ${meta.dot}`}
                    >
                      {t.count}
                    </span>
                  </span>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-12 text-sm text-muted">
        Hover a tool to see which projects use it.{' '}
        <Link to="/projects" className="link">
          Browse the projects →
        </Link>
      </p>
    </div>
  );
}

function Tile({ value, label }: { value: number; label: string }) {
  return (
    <div className="card p-4">
      <div className="text-2xl font-bold text-accent">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  dot,
  children,
}: {
  active: boolean;
  onClick: () => void;
  dot: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? 'border-accent bg-accent/10 text-accent'
          : 'border-line text-muted hover:border-accent/50 hover:text-ink2'
      }`}
    >
      <span className={`inline-block h-2 w-2 rounded-full ${dot}`} />
      {children}
    </button>
  );
}
