import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { projects, techTags } from '../data/projects';
import type { Interactivity, ProjectType } from '../data/types';
import { INTERACTIVITY_META, TYPE_LABELS } from '../data/types';

type TypeFilter = ProjectType | 'all';
type LiveFilter = Interactivity | 'all';
type YearFilter = number | 'undated' | 'all';
type SortOrder = 'relevance' | 'newest' | 'oldest';

const TYPE_OPTIONS: TypeFilter[] = [
  'all',
  'chatbot',
  'visualization',
  'research',
  'tool',
  'app',
  'seminar',
  'coursework',
];
// Only show status filters that some project actually uses (e.g. hide
// "coming soon" once every project has a real demo).
const PRESENT = new Set(projects.map((p) => p.interactivity));
const LIVE_OPTIONS: LiveFilter[] = (['all', 'live', 'potential', 'showcase'] as LiveFilter[]).filter(
  (l) => l === 'all' || PRESENT.has(l as Interactivity),
);
// Distinct years present in the registry (newest first), with an "Undated"
// bucket for projects that never set `year`.
const PRESENT_YEARS = [...new Set(projects.map((p) => p.year).filter((y): y is number => y != null))].sort(
  (a, b) => b - a,
);
const YEAR_OPTIONS: YearFilter[] = [
  'all',
  ...PRESENT_YEARS,
  ...(projects.some((p) => p.year == null) ? (['undated'] as const) : []),
];
const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest updated' },
  { value: 'oldest', label: 'Oldest updated' },
];

// How many tech tags to show before the "More tags" toggle.
const VISIBLE_TAGS = 14;

export default function Projects() {
  const [type, setType] = useState<TypeFilter>('all');
  const [live, setLive] = useState<LiveFilter>('all');
  const [year, setYear] = useState<YearFilter>('all');
  const [sort, setSort] = useState<SortOrder>('relevance');
  const [q, setQ] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);

  // Selected tags live in the URL (?tag=RAG,NLP) so the filter is shareable and
  // other pages (e.g. the Stack) can deep-link straight into a filtered view.
  const [params, setParams] = useSearchParams();
  const selectedTags = useMemo(
    () =>
      (params.get('tag') ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    [params],
  );
  const selectedLower = useMemo(
    () => new Set(selectedTags.map((t) => t.toLowerCase())),
    [selectedTags],
  );

  function toggleTag(name: string) {
    const next = new Set(selectedLower);
    const key = name.toLowerCase();
    next.has(key) ? next.delete(key) : next.add(key);
    // Re-emit in registry order using canonical casing.
    const value = techTags.filter((t) => next.has(t.name.toLowerCase())).map((t) => t.name);
    const sp = new URLSearchParams(params);
    value.length ? sp.set('tag', value.join(',')) : sp.delete('tag');
    setParams(sp, { replace: true });
  }

  function clearTags() {
    const sp = new URLSearchParams(params);
    sp.delete('tag');
    setParams(sp, { replace: true });
  }

  const shownTags = showAllTags ? techTags : techTags.slice(0, VISIBLE_TAGS);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    // Default display order: most-live first (live → coming-soon →
    // showcase), then featured (highlight) projects, then newest year
    // first, then by title. Overridden by an explicit newest/oldest sort.
    const liveRank: Record<Interactivity, number> = { live: 0, potential: 1, showcase: 2 };
    const result = projects.filter((p) => {
      if (type !== 'all' && p.type !== type) return false;
      if (live !== 'all' && p.interactivity !== live) return false;
      if (year !== 'all') {
        if (year === 'undated' ? p.year != null : p.year !== year) return false;
      }
      // Tags use OR semantics: keep a project if it carries any selected tag.
      if (
        selectedLower.size &&
        !p.tech.some((t) => selectedLower.has(t.toLowerCase()))
      )
        return false;
      if (
        query &&
        !`${p.title} ${p.tagline} ${p.tech.join(' ')}`.toLowerCase().includes(query)
      )
        return false;
      return true;
    });

    if (sort === 'relevance') {
      return result.sort(
        (a, b) =>
          liveRank[a.interactivity] - liveRank[b.interactivity] ||
          Number(Boolean(b.highlight)) - Number(Boolean(a.highlight)) ||
          (b.year ?? 0) - (a.year ?? 0) ||
          a.title.localeCompare(b.title),
      );
    }
    // Newest/oldest by year — undated projects have no known update date, so
    // they sink to the bottom regardless of direction.
    const dir = sort === 'newest' ? -1 : 1;
    return result.sort((a, b) => {
      if (a.year == null && b.year == null) return a.title.localeCompare(b.title);
      if (a.year == null) return 1;
      if (b.year == null) return -1;
      return dir * (a.year - b.year) || a.title.localeCompare(b.title);
    });
  }, [type, live, year, sort, q, selectedLower]);

  return (
    <div className="container-x animate-fade-up py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">Projects</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Search by title or tech, and filter by type, status or tag — green “Live” means you can use
        it right here in the browser. Live projects are listed first.
      </p>

      {/* Filters */}
      <div className="mt-8 space-y-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search projects…"
          className="w-full max-w-md rounded-lg border border-line bg-app px-4 py-2 text-sm text-ink2 outline-none placeholder:text-muted focus:border-accent"
        />
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((t) => (
            <FilterChip key={t} active={type === t} onClick={() => setType(t)}>
              {t === 'all' ? 'All types' : TYPE_LABELS[t]}
            </FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {LIVE_OPTIONS.map((l) => (
            <FilterChip key={l} active={live === l} onClick={() => setLive(l)}>
              {l === 'all' ? (
                'Any status'
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${INTERACTIVITY_META[l].dot}`} />
                  {INTERACTIVITY_META[l].label}
                </span>
              )}
            </FilterChip>
          ))}
        </div>

        {/* Date filter: which year a project was last updated, plus sort order */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {YEAR_OPTIONS.map((y) => (
              <FilterChip key={y} active={year === y} onClick={() => setYear(y)}>
                {y === 'all' ? 'All years' : y === 'undated' ? 'Undated' : y}
              </FilterChip>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs text-muted">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOrder)}
              className="rounded-lg border border-line bg-app px-2 py-1.5 text-sm text-ink2 outline-none focus:border-accent"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Tag filter (OR — match any selected tag) */}
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Tags</span>
            {selectedTags.length > 0 && (
              <button onClick={clearTags} className="text-xs text-accent hover:underline">
                Clear ({selectedTags.length})
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {shownTags.map((t) => {
              const active = selectedLower.has(t.name.toLowerCase());
              return (
                <button
                  key={t.name}
                  onClick={() => toggleTag(t.name)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs transition ${
                    active
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-line text-muted hover:border-accent/50 hover:text-ink2'
                  }`}
                >
                  {t.name}
                  <span className={active ? 'text-accent/70' : 'text-muted/60'}>{t.count}</span>
                </button>
              );
            })}
            {techTags.length > VISIBLE_TAGS && (
              <button
                onClick={() => setShowAllTags((v) => !v)}
                className="rounded-full px-3 py-1 text-xs text-accent hover:underline"
              >
                {showAllTags ? 'Show fewer' : `+${techTags.length - VISIBLE_TAGS} more`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-muted">No projects match those filters.</p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? 'border-accent bg-accent/10 text-accent'
          : 'border-line text-muted hover:border-accent/50 hover:text-ink2'
      }`}
    >
      {children}
    </button>
  );
}
