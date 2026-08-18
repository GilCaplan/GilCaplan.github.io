import { Link } from 'react-router-dom';
import type { Project } from '../data/types';
import { INTERACTIVITY_META, TYPE_LABELS } from '../data/types';

export default function ProjectCard({ project }: { project: Project }) {
  const meta = INTERACTIVITY_META[project.interactivity];
  return (
    <Link
      to={`/projects/${project.slug}`}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
      }}
      className="card card-glow group flex flex-col p-5 transition duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_12px_40px_-16px_rgba(20,184,166,0.45)]"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2">
          <span className="pill">{TYPE_LABELS[project.type]}</span>
          {project.year && <span className="font-mono text-xs text-muted">{project.year}</span>}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted" title={meta.hint}>
          <span
            className={`inline-block h-2 w-2 rounded-full ${meta.dot} ${
              project.interactivity === 'live' ? 'animate-pulse-dot' : ''
            }`}
          />
          {meta.label}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-ink2 group-hover:text-accent">{project.title}</h3>
      <p className="mt-1 flex-1 text-sm text-muted">{project.tagline}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.slice(0, 4).map((t) => (
          <span key={t} className="rounded-md bg-app px-2 py-0.5 font-mono text-[11px] text-muted">
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
