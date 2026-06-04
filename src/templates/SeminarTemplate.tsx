import type { Project, SeminarMaterial } from '../data/types';

// Renders a `seminar` talk: an overview, then each material (slide deck, report)
// embedded inline so visitors can read it without leaving the page. Materials
// without an embed `src` (e.g. a paper) fall through to a simple links row.
export default function SeminarTemplate({ project }: { project: Project }) {
  const materials = project.materials ?? [];
  const embedded = materials.filter((m) => m.src);
  const linkOnly = materials.filter((m) => !m.src);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
          The talk
        </h2>
        <p className="leading-relaxed text-muted">{project.description}</p>
      </section>

      {embedded.map((m) => (
        <Embed key={m.href} material={m} title={project.title} />
      ))}

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

      {(linkOnly.length > 0 || project.repo) && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">Links</h2>
          <div className="flex flex-wrap gap-3">
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noreferrer" className="btn-ghost">
                View on GitHub ↗
              </a>
            )}
            {linkOnly.map((m) => (
              <a key={m.href} href={m.href} target="_blank" rel="noreferrer" className="btn-ghost">
                {m.label} ↗
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Absolute URLs pass through; relative paths resolve against the site base so
// self-hosted files in public/ work in dev and once deployed under a sub-path.
function resolve(url: string) {
  return /^https?:\/\//.test(url) ? url : `${import.meta.env.BASE_URL}${url}`;
}

function Embed({ material, title }: { material: SeminarMaterial; title: string }) {
  // Slide decks are 16:9; documents and PDFs render as a tall scrollable page.
  const frameClass =
    material.kind === 'doc' || material.kind === 'pdf'
      ? 'h-[80vh]'
      : 'aspect-video max-h-[80vh]';
  // For PDFs, fit to width and keep the viewer toolbar.
  const src =
    resolve(material.src!) + (material.kind === 'pdf' ? '#view=FitH&toolbar=1' : '');

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
          {material.label}
        </h2>
        <a href={resolve(material.href)} target="_blank" rel="noreferrer" className="btn-ghost text-xs">
          Open ↗
        </a>
      </div>
      <div className={`overflow-hidden rounded-2xl border border-line bg-app ${frameClass}`}>
        <iframe
          src={src}
          title={`${title} — ${material.label}`}
          className="h-full w-full"
          loading="lazy"
          allowFullScreen
        />
      </div>
    </section>
  );
}
