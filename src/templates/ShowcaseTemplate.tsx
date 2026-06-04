import type { Project } from '../data/types';

// Generic template for `showcase` and `potential` projects (viz, research, tool,
// app, non-live chatbots). Live behaviour lives in dedicated templates.
export default function ShowcaseTemplate({ project }: { project: Project }) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">Overview</h2>
        <p className="leading-relaxed text-muted">{project.description}</p>
      </section>

      {project.interactivity === 'potential' && project.interactivePlan && (
        <section className="card border-ocean/40 bg-ocean/5 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ocean">
            <span className="h-2 w-2 rounded-full bg-ocean" />
            Make it interactive — on the roadmap
          </h3>
          <p className="mt-2 text-sm text-muted">{project.interactivePlan}</p>
        </section>
      )}

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

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">Links</h2>
        <div className="flex flex-wrap gap-3">
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noreferrer" className="btn-ghost">
              View on GitHub ↗
            </a>
          )}
          {project.liveDemo && (
            <a href={project.liveDemo} target="_blank" rel="noreferrer" className="btn-accent">
              Live demo ↗
            </a>
          )}
          {project.links?.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn-ghost">
              {l.label} ↗
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
