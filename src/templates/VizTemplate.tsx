import { useState } from 'react';
import type { Project } from '../data/types';

// Embeds a self-contained visualization app (served from public/) in an iframe.
// Used for `live` visualization projects that carry an `embed` path.
export default function VizTemplate({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const src = `${import.meta.env.BASE_URL}${project.embed}`;
  const heading = project.interactivity === 'live' ? 'Explore — live' : 'Interactive demo';

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
            {heading}
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setExpanded((v) => !v)} className="btn-ghost text-xs">
              {expanded ? 'Shrink' : 'Expand'}
            </button>
            <a href={src} target="_blank" rel="noreferrer" className="btn-ghost text-xs">
              Open full ↗
            </a>
          </div>
        </div>
        <div
          className={`overflow-hidden rounded-2xl border border-line bg-app transition-all ${
            expanded ? 'h-[85vh]' : 'h-[70vh]'
          }`}
        >
          <iframe
            src={src}
            title={`${project.title} visualization`}
            className="h-full w-full"
            loading="lazy"
            allow="fullscreen"
          />
        </div>
        {project.slug === 'warset' && (
          <p className="mt-2 text-xs text-muted">
            Tip: use the sidebar inside the app to switch between the map, network, insights,
            actor timeline, and causal views. First map load fetches historical basemaps, so
            give it a moment.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">About</h2>
        <p className="leading-relaxed text-muted">{project.description}</p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">Tech</h2>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span key={t} className="pill">
              {t}
            </span>
          ))}
        </div>
      </section>

      {project.repo && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">Links</h2>
          <a href={project.repo} target="_blank" rel="noreferrer" className="btn-ghost">
            View on GitHub ↗
          </a>
        </section>
      )}
    </div>
  );
}
