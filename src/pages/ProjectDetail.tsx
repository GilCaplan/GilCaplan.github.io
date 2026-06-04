import { Link, useParams } from 'react-router-dom';
import { getProject } from '../data/projects';
import { INTERACTIVITY_META, TYPE_LABELS } from '../data/types';
import ChatbotTemplate from '../templates/ChatbotTemplate';
import ShowcaseTemplate from '../templates/ShowcaseTemplate';
import VizTemplate from '../templates/VizTemplate';
import JudeTemplate from '../templates/JudeTemplate';
import SeminarTemplate from '../templates/SeminarTemplate';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = slug ? getProject(slug) : undefined;

  if (!project) {
    return (
      <div className="container-x py-24 text-center">
        <p className="text-muted">Project not found.</p>
        <Link to="/projects" className="link mt-4 inline-block">
          ← Back to projects
        </Link>
      </div>
    );
  }

  const meta = INTERACTIVITY_META[project.interactivity];
  const hasEmbed = Boolean(project.embed);
  const isJude = project.config?.template === 'jude';
  const isSeminar = project.type === 'seminar' && Boolean(project.materials?.length);
  const isLiveChat =
    project.type === 'chatbot' && project.interactivity === 'live' && !hasEmbed && !isJude;

  return (
    <div className="container-x animate-fade-up py-12">
      <Link to="/projects" className="text-sm text-muted hover:text-accent">
        ← Projects
      </Link>

      {/* Header */}
      <header className="mt-4 border-b border-line/70 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="pill">{TYPE_LABELS[project.type]}</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted" title={meta.hint}>
            <span
              className={`inline-block h-2 w-2 rounded-full ${meta.dot} ${
                project.interactivity === 'live' ? 'animate-pulse-dot' : ''
              }`}
            />
            {meta.label}
          </span>
          {project.year && <span className="font-mono text-xs text-muted">{project.year}</span>}
        </div>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{project.title}</h1>
        <p className="mt-2 max-w-2xl text-lg text-muted">{project.tagline}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noreferrer" className="btn-ghost">
              GitHub ↗
            </a>
          )}
          {project.liveDemo && (
            <a href={project.liveDemo} target="_blank" rel="noreferrer" className="btn-ghost">
              Live demo ↗
            </a>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="mt-8">
        {isSeminar ? (
          <SeminarTemplate project={project} />
        ) : hasEmbed ? (
          <VizTemplate project={project} />
        ) : isJude ? (
          <JudeTemplate project={project} />
        ) : isLiveChat ? (
          <ChatbotTemplate project={project} />
        ) : (
          <ShowcaseTemplate project={project} />
        )}
      </div>
    </div>
  );
}
