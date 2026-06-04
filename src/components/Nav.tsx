import { NavLink } from 'react-router-dom';
import SpotlightToggle from './SpotlightToggle';

const links = [
  { to: '/', label: 'About', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/playground', label: 'Playground' },
  { to: '/stack', label: 'Stack' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/80 backdrop-blur">
      <nav className="container-x flex h-16 items-center justify-between">
        <NavLink to="/" className="font-mono text-sm font-semibold tracking-tight text-ink2">
          <span className="text-accent">gil</span>caplan
          <span className="text-muted">.dev</span>
        </NavLink>
        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-sm transition ${
                  isActive ? 'text-accent' : 'text-muted hover:text-ink2'
                }`
              }
            >
              {l.label}
              {l.label === 'Blog' && (
                <span className="ml-1 align-super text-[9px] text-muted">soon</span>
              )}
            </NavLink>
          ))}
          <SpotlightToggle />
        </div>
      </nav>
    </header>
  );
}
