export const profile = {
  name: 'Gil Caplan',
  headline: 'B.Sc. Data Science & Engineering @ Technion',
  location: 'Tel Aviv District, Israel',
  email: 'rockycaplan@gmail.com',
  github: 'https://github.com/GilCaplan',
  linkedin: 'https://www.linkedin.com/in/gil-caplan-3120a4181/',
  photo: '/photos/profile.png', // drop your image here when ready
  bioShort:
    'A human who builds AI things — agents, chatbots, RAG systems, and interactive data ' +
    'visualizations — with the odd language Rust.',
  bio:
    "I'm Gil — a human who builds AI things: agents and chatbots, retrieval-augmented " +
    'assistants, interactive data visualizations, and the odd systems project like a ' +
    'scripting language with Rust. I like turning ideas into working software and making ' +
    "technical work explorable, not just shippable. I'm always up for research " +
    'collaborations across NLP, ML, and vision.',
};

export const SOCIALS = [
  { label: 'GitHub', href: profile.github },
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'Email', href: `mailto:${profile.email}` },
];

export const experience = [
  {
    role: 'Teaching Assistant',
    org: 'Faculty of Data & Decision Sciences, Technion',
    period: 'Mar 2026 – Present',
    detail:
      'TA for an Interactive Data Visualization course; guide students in Tableau and the ' +
      'principles of data visualization and storytelling through hands-on projects.',
  },
  {
    role: 'Mentor / Teacher',
    org: 'Magshimim',
    period: 'Aug 2025 – Present',
    detail:
      'Led and mentored 14 teams of 12th-grade students through full-cycle data science ' +
      'projects (data acquisition → EDA → feature engineering → ML). Taught 10th-graders ' +
      'Python, ML, statistics, and data visualization.',
  },
];

export const education = [
  {
    org: 'Technion – Israel Institute of Technology',
    detail: 'B.Sc., Data Science & Engineering',
    period: 'Oct 2022 – Oct 2026',
  },
];

export const leadership = [
  { org: 'AEPI', role: 'President / Vice President / Scribe', period: 'Dec 2022 – Oct 2026' },
  { org: 'ASAT — Technion Student Association', role: 'Audit Committee Member', period: 'Jul 2025 – Jul 2026' },
  { org: 'Data & Decision Science Student Committee', role: 'Treasurer', period: 'Oct 2024 – Jul 2025' },
];

export const skills = {
  Languages: ['Python', 'R', 'Java', 'Rust', 'Go', 'C', 'TypeScript', 'SQL'],
  'AI / ML': ['NLP', 'Deep Learning', 'Transformers', 'Diffusion', 'RAG', 'LLM Agents', 'Adversarial ML'],
  'Data & Viz': ['Tableau', 'Data Storytelling', 'Statistics', 'Optimization', 'A/B Testing'],
  Systems: ['Distributed Systems', 'OS', 'Software Engineering', 'Language Design'],
};
