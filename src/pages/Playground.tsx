import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { embedDemos, liveNoEmbedDemos } from '../data/projects';
import { TYPE_LABELS } from '../data/types';

// Featured-first, then newest, then by title — same ordering the rest of the
// site uses, so the most interesting demo lands first.
function order<T extends { highlight?: boolean; year?: number; title: string }>(list: T[]) {
  return [...list].sort(
    (a, b) =>
      Number(Boolean(b.highlight)) - Number(Boolean(a.highlight)) ||
      (b.year ?? 0) - (a.year ?? 0) ||
      a.title.localeCompare(b.title),
  );
}

export default function Playground() {
  const demos = useMemo(() => order(embedDemos), []);
  const moreDemos = useMemo(() => order(liveNoEmbedDemos), []);
  const [activeSlug, setActiveSlug] = useState(demos[0]?.slug);
  const [expanded, setExpanded] = useState(false);

  const active = demos.find((d) => d.slug === activeSlug) ?? demos[0];
  const src = active ? `${import.meta.env.BASE_URL}${active.embed}` : '';

  return (
    <div className="container-x animate-fade-up py-14">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold sm:text-4xl">Playground</h1>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
          <span className="h-2 w-2 animate-pulse-dot rounded-full bg-spice" />
          {demos.length} live demos
        </span>
      </div>
      <p className="mt-2 max-w-2xl text-muted">
        Every project that runs right in your browser — no install, no API key, no reading required.
        Pick one and play. Each loads its real, self-contained app below.
      </p>

      {active ? (
        <>
          {/* Demo picker */}
          <div className="mt-8 flex flex-wrap gap-2">
            {demos.map((d) => {
              const isActive = d.slug === active.slug;
              return (
                <button
                  key={d.slug}
                  onClick={() => {
                    setActiveSlug(d.slug);
                    setExpanded(false);
                  }}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    isActive
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-line text-muted hover:border-accent/50 hover:text-ink2'
                  }`}
                >
                  {d.title}
                </button>
              );
            })}
          </div>

          {/* Active demo header */}
          <div className="mt-8 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="pill">{TYPE_LABELS[active.type]}</span>
                {active.year && (
                  <span className="font-mono text-xs text-muted">{active.year}</span>
                )}
              </div>
              <h2 className="mt-2 text-xl font-semibold text-ink2">{active.title}</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted">{active.tagline}</p>
            </div>
            <div className="flex flex-shrink-0 gap-2">
              <button onClick={() => setExpanded((v) => !v)} className="btn-ghost text-xs">
                {expanded ? 'Shrink' : 'Expand'}
              </button>
              <a href={src} target="_blank" rel="noreferrer" className="btn-ghost text-xs">
                Open full ↗
              </a>
              <Link to={`/projects/${active.slug}`} className="btn-ghost text-xs">
                Details →
              </Link>
            </div>
          </div>

          {/* Inline player */}
          <div
            className={`mt-4 overflow-hidden rounded-2xl border border-line bg-app transition-all ${
              expanded ? 'h-[88vh]' : 'h-[72vh]'
            }`}
          >
            <iframe
              key={active.slug}
              src={src}
              title={`${active.title} demo`}
              className="h-full w-full"
              loading="lazy"
              allow="fullscreen"
            />
          </div>
        </>
      ) : (
        <p className="mt-16 text-center text-muted">No live demos yet — check back soon.</p>
      )}

      {/* Live demos that need their own page (chat UI / bring-your-own-key) */}
      {moreDemos.length > 0 && (
        <section className="mt-16">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
            More live demos
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            These also run live, but open on their own page — they bring up a chat interface (and
            may ask for your own API key, which stays in your browser).
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {moreDemos.map((d) => (
              <Link
                key={d.slug}
                to={`/projects/${d.slug}`}
                className="card flex flex-col p-4 transition hover:-translate-y-0.5 hover:border-accent/60"
              >
                <div className="flex items-center gap-2">
                  <span className="pill">{TYPE_LABELS[d.type]}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                    <span className="h-2 w-2 animate-pulse-dot rounded-full bg-spice" />
                    Live
                  </span>
                </div>
                <h3 className="mt-2 font-semibold text-ink2">{d.title}</h3>
                <p className="mt-1 text-sm text-muted">{d.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
