// ── Project data model ─────────────────────────────────────────────────────
// Two orthogonal axes:
//   • type          → chooses the LAYOUT template
//   • interactivity → chooses how LIVE the project is for a visitor
// Adding a project = append one Project to the registry in projects.ts.

export type ProjectType =
  | 'chatbot'
  | 'visualization'
  | 'research'
  | 'tool'
  | 'app'
  | 'seminar'
  | 'coursework';

export type Interactivity =
  | 'live' // usable in-browser now
  | 'potential' // for show now, interactive with planned work
  | 'showcase'; // for show — write-up + media + links

export interface ProjectLink {
  label: string;
  href: string;
}

// A talk artifact (slide deck, report, paper). If `src` is set it's embedded
// inline (iframe); otherwise it renders as a plain "open ↗" link.
export interface SeminarMaterial {
  label: string;
  // Open-in-new-tab + iframe URL. An absolute URL (http…) is used as-is; a
  // relative path (e.g. "seminars/ace.pdf") is resolved against the site base,
  // so self-hosted files in public/ work both locally and once deployed.
  href: string;
  src?: string; // iframe embed (omit for link-only, e.g. a paper)
  kind?: 'slides' | 'doc' | 'pdf'; // embed shape: 16:9 deck vs. tall page/PDF
}

export interface Project {
  slug: string;
  title: string;
  type: ProjectType;
  interactivity: Interactivity;
  tagline: string;
  description: string; // longer, plain text / light markdown
  repo?: string;
  liveDemo?: string;
  tech: string[];
  highlight?: boolean;
  year?: number;
  thumbnail?: string;
  links?: ProjectLink[];
  // Talk artifacts for `seminar` projects, embedded inline by SeminarTemplate.
  materials?: SeminarMaterial[];
  // Path to a self-contained app to embed in an iframe (served from public/).
  embed?: string;
  // For `potential`: what it'd take to make it interactive (shown as a callout).
  interactivePlan?: string;
  // Type/template-specific config (e.g. chatbot game settings, viz options).
  config?: Record<string, unknown>;
  // Curates the Playground, independent of `interactivity`:
  //   true  → force-include (e.g. a playable coursework demo marked "showcase")
  //   false → exclude (e.g. a live demo that isn't really "play"-able)
  // Left unset, an embedded demo is in the Playground iff it's `live`.
  playground?: boolean;
}

export const TYPE_LABELS: Record<ProjectType, string> = {
  chatbot: 'Chatbot',
  visualization: 'Visualization',
  research: 'Research',
  tool: 'Tool',
  app: 'App',
  seminar: 'Seminar',
  coursework: 'Coursework',
};

export const INTERACTIVITY_META: Record<
  Interactivity,
  { label: string; dot: string; hint: string }
> = {
  live: { label: 'Live — try it', dot: 'bg-spice', hint: 'Use it right here in the browser' },
  potential: {
    label: 'Interactive — coming soon',
    dot: 'bg-ocean',
    hint: 'For show now; interactive version on the roadmap',
  },
  showcase: { label: 'Showcase', dot: 'bg-muted', hint: 'Write-up, media and links' },
};
