import { Link } from 'react-router-dom';
import NetworkBackground from '../components/NetworkBackground';
import ProjectCard from '../components/ProjectCard';
import RoleTyper from '../components/RoleTyper';
import TopToolsChart from '../components/TopToolsChart';
import { flagshipProjects } from '../data/projects';
import { education, experience, leadership, profile, SOCIALS } from '../data/profile';

export default function About() {
  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line/70">
        <NetworkBackground />
        <div className="container-x relative py-20 sm:py-28">
          <p className="font-mono text-sm text-accent">{profile.headline}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Hi, I'm {profile.name}.
          </h1>
          <p className="mt-4 font-mono text-base text-ink2 sm:text-lg">
            <span className="text-muted">building</span> <RoleTyper />
          </p>
          <p className="mt-4 max-w-2xl text-lg text-muted">{profile.bioShort}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/projects" className="btn-accent">
              View projects →
            </Link>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="btn-ghost"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="container-x py-16">
        {/* Skills — most-used tools, computed live from the projects */}
        <section className="grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">Skills</h2>
            <p className="mt-2 text-sm text-muted">
              My most-used tools, counted across every project — so it reflects what I actually
              build with.{' '}
              <Link to="/stack" className="link">
                Full stack →
              </Link>
            </p>
          </div>
          <div className="md:col-span-2">
            <TopToolsChart limit={12} />
          </div>
        </section>

        {/* Experience */}
        <section className="mt-16 grid gap-10 md:grid-cols-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">Experience</h2>
          <div className="md:col-span-2 space-y-6">
            {experience.map((e) => (
              <div key={e.role} className="card p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-ink2">{e.role}</h3>
                  <span className="font-mono text-xs text-muted">{e.period}</span>
                </div>
                <p className="text-sm text-accent">{e.org}</p>
                <p className="mt-2 text-sm text-muted">{e.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education + Leadership */}
        <section className="mt-16 grid gap-10 md:grid-cols-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
            Education & Leadership
          </h2>
          <div className="md:col-span-2 space-y-6">
            {education.map((e) => (
              <div key={e.org}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-ink2">{e.org}</h3>
                  <span className="font-mono text-xs text-muted">{e.period}</span>
                </div>
                <p className="text-sm text-muted">{e.detail}</p>
              </div>
            ))}
            <ul className="space-y-2 border-t border-line/70 pt-4">
              {leadership.map((l) => (
                <li key={l.org} className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                  <span className="text-ink2">
                    <span className="text-accent">{l.role}</span> · {l.org}
                  </span>
                  <span className="font-mono text-xs text-muted">{l.period}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Featured projects */}
        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold">Featured projects</h2>
            <Link to="/projects" className="link text-sm">
              See all →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {flagshipProjects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
