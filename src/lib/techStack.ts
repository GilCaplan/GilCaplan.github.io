// ── Tech-stack aggregation ───────────────────────────────────────────────────
// Everything here is DERIVED from the project registry (src/data/projects.ts),
// so the Stack dashboard auto-updates whenever a project/repo is added or
// removed — no manual list to maintain. Each tech badge is bucketed into a
// category by keyword rules; unknown/new tech falls back to "Other" (and is
// easy to slot by adding a keyword below).

import { projects } from '../data/projects';
import type { Project } from '../data/types';

export type TechCategory =
  | 'AI / ML'
  | 'Web & App'
  | 'Data & Viz'
  | 'Math & Theory'
  | 'Systems & Infra'
  | 'Languages'
  | 'Other';

export const CATEGORY_ORDER: TechCategory[] = [
  'AI / ML',
  'Web & App',
  'Data & Viz',
  'Math & Theory',
  'Systems & Infra',
  'Languages',
  'Other',
];

export const CATEGORY_META: Record<TechCategory, { dot: string; blurb: string }> = {
  'AI / ML': { dot: 'bg-accent', blurb: 'Models, agents, RAG, vision & NLP' },
  'Web & App': { dot: 'bg-ocean', blurb: 'Frontends, APIs, full-stack & realtime' },
  'Data & Viz': { dot: 'bg-spice', blurb: 'Pipelines, databases & visualization' },
  'Math & Theory': { dot: 'bg-violet-400', blurb: 'Optimization, stats, causal & algorithms' },
  'Systems & Infra': { dot: 'bg-amber-400', blurb: 'OS, kernels, automation & tooling' },
  Languages: { dot: 'bg-emerald-400', blurb: 'Programming languages used' },
  Other: { dot: 'bg-muted', blurb: 'Everything else' },
};

// Ordered rules: a tech is assigned to the FIRST category whose any keyword
// matches (case-insensitive substring). Order matters (AI/ML before Languages
// so "Python" lands in Languages but "PyTorch" in AI/ML, etc.).
const RULES: { cat: TechCategory; keys: string[] }[] = [
  {
    cat: 'AI / ML',
    keys: [
      'llm', 'ml', 'nlp', 'rag', 'embedding', 'vision', 'vlm', 'cnn', 'transformer',
      'diffusion', 'pytorch', 'scikit', 'sklearn', 'llama', 'gemini', 'ollama',
      'langchain', 'faiss', 'whisper', 'musicgen', 'multi-agent', 'agent', 'pddl',
      'planning', 'prompt', 'safety', 'tokeniz', 'ner', 'kornia', 'kcf', 'kanade',
      'minilm', 'adversarial', 'bert', 'gpt', 'opencv', ' ai', 'ai ', ' search ',
    ],
  },
  {
    cat: 'Math & Theory',
    keys: [
      'optimiz', 'statistic', 'causal', 'propensity', 'dag', 'algorithm', 'math',
      'algebra', 'probability', 'folktables', 'order statistics', 'compiler',
    ],
  },
  {
    cat: 'Web & App',
    keys: [
      'react', 'flask', 'fastapi', 'mongo', 'websocket', 'jinja', 'rest', 'd3',
      'chart.js', 'whatsapp', 'pyqt', 'pillow', 'codegen', 'tooling', 'html', 'css',
      'node', 'express', 'vite', 'tailwind',
    ],
  },
  {
    cat: 'Data & Viz',
    keys: [
      'data', 'tableau', 'cloudflare', 'bm25', ' ir', 'a/b', 'webscrap', 'database',
      'sql', 'numpy', 'pandas', 'spark', 'etl', 'audit', 'ethics', 'ab testing',
    ],
  },
  {
    cat: 'Systems & Infra',
    keys: [
      'operating system', 'kernel', 'x86', 'systems', 'distributed', 'scheduling',
      'automation', 'macos', 'docker',
    ],
  },
  {
    cat: 'Languages',
    keys: ['python', 'java', 'rust', 'go', ' c ', 'javascript', 'typescript', 'language'],
  },
];

export function categorize(tech: string): TechCategory {
  const t = ` ${tech.toLowerCase()} `;
  for (const rule of RULES) {
    if (rule.keys.some((k) => t.includes(k))) return rule.cat;
  }
  return 'Other';
}

export interface TechStat {
  name: string;
  count: number; // how many projects use it
  category: TechCategory;
  projects: Project[];
}

export interface CategoryStat {
  category: TechCategory;
  tools: TechStat[];
  toolCount: number; // distinct tools
  usageCount: number; // sum of project-uses
  projectCount: number; // distinct projects touching this category
}

export interface StackSummary {
  categories: CategoryStat[];
  tools: TechStat[]; // all tools, sorted by count desc
  totalTools: number;
  totalProjects: number;
  totalCategories: number;
}

// Build the whole dashboard model from the live registry.
export function buildStack(): StackSummary {
  const map = new Map<string, TechStat>();
  for (const p of projects) {
    for (const raw of p.tech) {
      const name = raw.trim();
      if (!name) continue;
      const key = name.toLowerCase();
      let stat = map.get(key);
      if (!stat) {
        stat = { name, count: 0, category: categorize(name), projects: [] };
        map.set(key, stat);
      }
      stat.count += 1;
      stat.projects.push(p);
    }
  }

  const tools = [...map.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );

  const categories: CategoryStat[] = CATEGORY_ORDER.map((category) => {
    const catTools = tools.filter((t) => t.category === category);
    const projSet = new Set<string>();
    catTools.forEach((t) => t.projects.forEach((p) => projSet.add(p.slug)));
    return {
      category,
      tools: catTools,
      toolCount: catTools.length,
      usageCount: catTools.reduce((s, t) => s + t.count, 0),
      projectCount: projSet.size,
    };
  }).filter((c) => c.toolCount > 0);

  return {
    categories,
    tools,
    totalTools: tools.length,
    totalProjects: projects.length,
    totalCategories: categories.length,
  };
}
