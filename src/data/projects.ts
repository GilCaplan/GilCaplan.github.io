import type { Project } from './types';

const GH = 'https://github.com/GilCaplan';

// ── Project registry ────────────────────────────────────────────────────────
// To add a project later: append one entry. `type` picks the layout template,
// `interactivity` picks how live it is. See planning/EXTENDING.md.
export const projects: Project[] = [
  // ── Flagships ─────────────────────────────────────────────────────────────
  {
    slug: 'beat-the-llm',
    title: 'Beat the LLM',
    type: 'chatbot',
    interactivity: 'live',
    highlight: true,
    year: 2026,
    tagline: 'Trick the AI into saying the forbidden word.',
    description:
      'A word game: the assistant is told never to say a secret target word. Your job is ' +
      'to craft prompts that coax it into saying that word anyway. Bring your own API key ' +
      '(OpenAI or Anthropic) — it stays in your browser and is sent only to the provider.',
    repo: `${GH}/BeatTheLLM`,
    tech: ['LLM', 'Prompting', 'Game'],
    config: {
      targets: ['penguin', 'volcano', 'banana', 'wizard', 'asteroid', 'pickle', 'samurai'],
    },
  },
  {
    slug: 'warset',
    title: 'Warset',
    type: 'visualization',
    interactivity: 'live',
    highlight: true,
    year: 2026,
    tagline: 'A time-sliding atlas of ~3,385 wars across recorded history.',
    description:
      'A curated, uncertainty-rated dataset of armed conflicts across all of recorded ' +
      'history (~3,385 wars, 47 fields each), paired with a territorial-control atlas and ' +
      'interactive visualizations — a time-sliding world map, a conflict network, ML-driven ' +
      'analytics, an actor timeline, and a causal-inference view. The full visualization ' +
      'suite runs live below.',
    repo: `${GH}/Warset`,
    tech: ['JavaScript', 'D3', 'Chart.js', 'Data', 'ML'],
    embed: 'warset/index.html',
  },
  {
    slug: 'jude',
    title: 'Jude — Judaic Study Assistant',
    type: 'chatbot',
    interactivity: 'live',
    highlight: true,
    year: 2026,
    tagline: 'RAG over a Sefaria corpus — cited answers on Torah, Talmud, Halacha & more.',
    description:
      'A local AI Judaic study assistant. Ask about Torah, Talmud, Halacha, or Kabbalah and ' +
      'it retrieves relevant passages from a Sefaria-sourced corpus, filters them, and ' +
      'streams a cited answer. Supports Hebrew input, three query modes, and links every ' +
      'source back to Sefaria. The live demo here runs in-browser retrieval over a curated ' +
      'slice of real Sefaria texts.',
    repo: `${GH}/JudeTheJudaicChatBot`,
    tech: ['RAG', 'NLP', 'Embeddings', 'Hebrew'],
    config: { template: 'jude' },
  },
  {
    slug: 'music-orchestra-studio',
    title: 'Music Orchestra Studio',
    type: 'app',
    interactivity: 'live',
    year: 2026,
    tagline: 'AI music studio — compose with 9 instruments on a canvas piano roll.',
    description:
      'Compose and synthesize music with 9 instruments (piano, violin, cello, flute, sax, ' +
      'trumpet, guitar, bass, drums), edit notes on a canvas piano roll, arrange tracks on ' +
      'a visual timeline, and generate music with a local LLM (Ollama) or MusicGen. ' +
      'Export to WAV.',
    repo: `${GH}/music-orchestra-studio`,
    tech: ['Python', 'Audio', 'NumPy synthesis', 'Ollama'],
    embed: 'music-orchestra-studio/index.html',
  },
  {
    slug: 'cap',
    title: 'CAP',
    type: 'tool',
    interactivity: 'showcase',
    year: 2026,
    tagline: 'A functional, expression-oriented scripting language built in Rust.',
    description:
      'CAP is an expression-oriented scripting language built in Rust. It uses data ' +
      'pipelines (|>) instead of boilerplate, making it token-efficient. A strict parser ' +
      'plus a native Python bridge (pyval) and a rich standard library make it powerful for ' +
      'data-heavy tasks, automation, and AI agents.',
    repo: `${GH}/CAP`,
    tech: ['Rust', 'Language', 'Compilers'],
    embed: 'cap/index.html',
  },
  {
    slug: 'macalendar',
    title: 'MACalendar',
    type: 'app',
    interactivity: 'showcase',
    year: 2026,
    tagline: 'One local brain for your calendar, tasks and training — no accounts, no cloud, ever.',
    description:
      'A native macOS assistant that turns speech or text into calendar events, tasks, workouts ' +
      'and more. One process on the host Mac hears (Whisper), rule-parses (spaCy), and falls back ' +
      'to a local Llama 3.1 8B via Ollama — 15 actions across ~100 REST endpoints, all reachable ' +
      'from a SwiftUI iOS companion over Tailscale. No accounts or API keys, and nothing leaves ' +
      'the machine unless you opt into a cloud model.',
    repo: `${GH}/MACalendar`,
    tech: ['Python', 'PyQt6', 'Ollama · Llama 3.1', 'Whisper', 'SwiftUI', 'Tailscale'],
    embed: 'macalendar/index.html',
  },
  {
    slug: 'agriculture-assistant',
    title: 'Agriculture Assistant',
    type: 'chatbot',
    interactivity: 'live',
    highlight: true,
    year: 2026,
    tagline: 'An AI assistant chatbot for agriculture.',
    description:
      'An agriculture assistant chatbot — an AI agent that helps with farming and ' +
      'agriculture-related questions and tasks.',
    repo: `${GH}/Agents_960290`,
    tech: ['LangChain', 'FAISS RAG', 'Ollama', 'FastAPI'],
    embed: 'agriculture-assistant/index.html',
  },
  {
    slug: 'usa-trip-cost-agent',
    title: 'USA Trip Cost Agent',
    type: 'app',
    interactivity: 'live',
    highlight: true,
    year: 2026,
    tagline: 'A multi-agent system that estimates US trip costs and recommends venues.',
    description:
      'An AI travel agent built with FastAPI, a local Llama 3 (Ollama), and scikit-learn. ' +
      'Five sub-agents — transport, food, lodging, entertainment, and recommendations — each ' +
      'backed by its own ML model, are orchestrated with an LLM to produce itineraries, cost ' +
      'estimates, and venue suggestions. The demo here lets you explore the real city data ' +
      '(Numbeo transport costs + venue profiles) the agents are built on, plus the architecture.',
    repo: `${GH}/USA_trip_cost_agent`,
    tech: ['FastAPI', 'Llama 3', 'scikit-learn', 'Multi-agent'],
    embed: 'usa-trip-cost-agent/index.html',
  },

  {
    slug: 'eurovision',
    title: 'EuroVision — Computer Vision Methods',
    type: 'coursework',
    interactivity: 'live',
    highlight: true,
    year: 2026,
    tagline: 'Live in-browser KCF object tracker + CNN results from my MPV computer-vision coursework.',
    description:
      'Coursework for CTU’s BE4M33MPV (EuroTeQ exchange): local features & RANSAC, indexing & ' +
      'retrieval/SfM, an SE-ResNet CNN (79.5% Imagenette val acc) + a VGG-U-Net colorization model, ' +
      'and KCF/KLT object tracking. The headline demo ports my kcf.py Kernelized Correlation Filter ' +
      'to vanilla JS — draw a box and a from-scratch FFT-based tracker follows the object across real ' +
      'frames, bit-exact with the Python reference.',
    repo: `${GH}/EuroVision`,
    embed: 'eurovision/index.html',
    tech: ['PyTorch', 'kornia', 'OpenCV', 'KCF', 'Lucas–Kanade', 'CNN', 'JavaScript'],
  },
  {
    slug: 'traffic-crisis',
    title: 'Traffic Crisis Analysis — Oct 7 & Israel',
    type: 'visualization',
    interactivity: 'live',
    year: 2025,
    tagline:
      'Tableau dashboard on Oct 7 2023’s impact on Israeli internet traffic, device usage & L3 cyberattacks.',
    description:
      'An interactive Tableau Public dashboard (team project) analyzing how the October 7, 2023 ' +
      'events affected internet traffic, desktop-vs-mobile device usage, and network-layer (L3) ' +
      'cyberattacks directed at Israel. Built for a general-public audience on normalized ' +
      'Cloudflare Radar data prepped in Python, with coordinated multiple views, time sliders, ' +
      'choropleth maps and a targeted-industry heatmap. The full interactive dashboard is embedded below.',
    liveDemo:
      'https://public.tableau.com/app/profile/gil.caplan/viz/Team5Presentation09_07_17522180851300/TrafficCrisisAnalysisDashboard',
    embed: 'traffic-crisis/index.html',
    tech: ['Tableau', 'Cloudflare Radar', 'Python', 'Data Viz'],
  },

  {
    slug: 'imgretrieval',
    title: 'imgRetrieval',
    type: 'app',
    interactivity: 'live',
    highlight: true,
    year: 2026,
    tagline: 'Search your own photo library by image, by text, or both — with RANSAC geometric re-ranking.',
    description:
      'A local, cross-platform image-retrieval engine: it indexes the photos already on your ' +
      'machine — without copying them — and finds them by example image, by text, or by text + ' +
      'image together. Two engines: SIFT → BoW/VLAD (PCA-whitened) for near-duplicate / same-object ' +
      'search, geometrically re-ranked with RANSAC so coincidental matches sink to the bottom, and ' +
      'CLIP for semantic image/text/fusion search, with BLIP captions. SQLite metadata, an ' +
      'incremental content-hashed index, a FastAPI + browser UI, and a CLI. The live demo below ' +
      'runs the same retrieve → geometrically re-rank pipeline entirely in your browser over 24 ' +
      'bundled public photos — including a real Harris-corner + RANSAC verifier.',
    repo: `${GH}/LocalmgRetrieval`,
    tech: ['Python', 'OpenCV', 'SIFT/VLAD', 'CLIP', 'RANSAC', 'FastAPI'],
    embed: 'imgretrieval/index.html',
  },
  {
    slug: 'ecommerce',
    title: 'ecommerce — Seed Set Search',
    type: 'coursework',
    interactivity: 'live',
    highlight: true,
    year: 2024,
    tagline: 'Greedy + genetic search for the best seed set, running live on a real 4,039-person graph.',
    description:
      'Technion e-commerce course, three assignments. HW01 (the flagship demo) picks a seed set to ' +
      'maximize a product launch’s spread across a real 4,039-person / 88,234-edge friendship network ' +
      '— a greedy hill-climb and a genetic algorithm both run live in-browser against the real graph, ' +
      'real costs, and the real diffusion formulas, with a step-by-step view of the search itself, not ' +
      'just the final answer. HW02 (a Bayesian sequential recommender that sharpens its belief about a ' +
      'viewer’s type after every recommendation) and HW03 (adaptive posted-pricing against a hidden ' +
      'customer value) get lighter live treatments of the same idea.',
    repo: `${GH}/ecommerce`,
    tech: ['Python', 'Graph Algorithms', 'Genetic Algorithm', 'Bayesian Inference', 'Game Theory'],
    embed: 'ecommerce/index.html',
  },

  // ── Standard projects ─────────────────────────────────────────────────────
  {
    slug: 'adversarial-ml-vlm',
    title: 'Steer to Feel — Visual Activation Steering in VLMs',
    type: 'research',
    interactivity: 'showcase',
    highlight: true,
    year: 2026,
    tagline: 'Do images act as steering signals? Activation steering in vision-language models.',
    description:
      'Research on whether images can act as steering signals — investigating visual ' +
      'activation steering in VLMs.',
    repo: `${GH}/Adversarial_ML_2360207`,
    tech: ['Vision', 'VLM', 'Adversarial ML', 'Research'],
    embed: 'adversarial-ml-vlm/index.html',
  },
  {
    slug: 'adversarial-tokenization',
    title: 'Adversarial Tokenization with LLMs',
    type: 'research',
    interactivity: 'showcase',
    highlight: true,
    year: 2025,
    tagline: 'Can non-canonical tokenizations bypass LLM safety? Building on AdvTok.',
    description:
      'A Technion research project (Data & Decision Sciences) investigating whether ' +
      'non-canonical tokenizations of a prompt can bypass an LLM’s safety alignment — ' +
      'building on the AdvTok greedy-search algorithm — and how the effect interacts with ' +
      'decoder-layer truncation and reduced search iterations, across jailbreaking and ' +
      'prompt-injection settings on Llama 3 8B. Guided by Prof. Roi Reichart and Nitay ' +
      'Calderon. Includes the research poster.',
    repo: `${GH}/Techen`,
    tech: ['LLM Safety', 'Llama 3', 'Tokenization', 'Research'],
    embed: 'adversarial-tokenization/index.html',
  },
  {
    slug: 'forge-chatbots',
    title: 'ChatbotForge',
    type: 'tool',
    interactivity: 'showcase',
    year: 2026,
    tagline: 'Generate complete chatbot apps from a simple config.',
    description:
      'ChatbotForge generates complete chatbot applications from a simple configuration — ' +
      'automating project scaffolding and wiring together AI models, APIs, and interfaces so ' +
      'developers get runnable chatbot systems without boilerplate.',
    repo: `${GH}/ForgeChatBots`,
    tech: ['Python', 'Codegen', 'Tooling'],
    embed: 'forge-chatbots/index.html',
  },
  {
    slug: 'whatsapp-chatbot',
    title: 'WhatsApp Chatbot',
    type: 'chatbot',
    interactivity: 'showcase',
    year: 2026,
    tagline: 'Persona-driven bot that messages individuals or groups as you.',
    description:
      'A chatbot that sends messages to individual or group chats — define a persona and ' +
      'have the bot message as you.',
    repo: `${GH}/whatsapp_chatbot`,
    tech: ['Go', 'WhatsApp', 'Ollama', 'Automation'],
    embed: 'whatsapp-chatbot/index.html',
  },
  {
    slug: 'virtualhome-llm',
    title: 'VirtualHome LLM Agents',
    type: 'research',
    interactivity: 'showcase',
    year: 2025,
    tagline: 'LLMs + classic PDDL planning for household agent tasks.',
    description:
      'Combining an LLM with classic AI methods such as PDDL to make agents capable of ' +
      'performing household tasks in the VirtualHome simulator.',
    repo: `${GH}/virtualhome_llm_project`,
    tech: ['LLM', 'PDDL', 'Planning', 'Research'],
    embed: 'virtualhome-llm/index.html',
  },
  {
    slug: 'interviewer',
    title: 'Interview Process Assistant',
    type: 'app',
    interactivity: 'live',
    year: 2025,
    tagline: 'Collaborative platform to build & practice interview question sets, with AI help.',
    description:
      'A full-stack platform (React + Flask + MongoDB + Google Gemini, Dockerized) for ' +
      'building and practicing interview question templates. Teams co-author question sets ' +
      'in real-time WebSocket sessions with host-led approval, get AI-generated questions ' +
      'and per-field suggestions from Gemini 1.5 Flash (with an automatic mock fallback), and ' +
      'run auto-graded mock interviews. JWT auth, PBKDF2 hashing, rate limiting, 65+ tests.',
    repo: `${GH}/Interviewer`,
    tech: ['React', 'Flask', 'MongoDB', 'Gemini', 'WebSockets'],
    embed: 'interviewer/index.html',
  },
  {
    slug: 'ethics-ml',
    title: 'Ethics & ML Judgement',
    type: 'research',
    interactivity: 'showcase',
    year: 2025,
    tagline: 'World-building and an audit of ML judgement and morality.',
    description: 'A world-building project and audit on ML judgement and morality.',
    repo: `${GH}/Ethics-940288`,
    tech: ['Ethics', 'ML', 'NER', 'Audit'],
    embed: 'ethics-ml/index.html',
  },

  // ── Seminars — talks I presented ──────────────────────────────────────────
  {
    slug: 'seminar-nlp-ace',
    title: 'Seminar — ACE: Agentic Context Engineering',
    type: 'seminar',
    interactivity: 'showcase',
    year: 2025,
    tagline: 'Self-improving LLM contexts via generate → reflect → curate — my NLP seminar talk.',
    description:
      'A seminar talk I co-presented with Shachar Frenkel for an NLP seminar on ACE ' +
      '(Agentic Context Engineering), a ' +
      'framework that treats an LLM’s context as an evolving "playbook" rather than a static ' +
      'prompt. Three roles — a Generator, a Reflector, and a Curator — accumulate and refine ' +
      'strategies through structured, incremental updates, avoiding the brevity bias and ' +
      '"context collapse" of approaches that repeatedly rewrite the whole context. The talk ' +
      'walks through the method and its offline (system-prompt) and online (agent-memory) ' +
      'results. My presentation slides and the original paper are linked below.',
    tech: ['NLP', 'LLM', 'Agents', 'Context Engineering'],
    materials: [
      {
        label: 'Presentation slides',
        kind: 'pdf',
        src: 'seminars/ace.pdf',
        href: 'seminars/ace.pdf',
      },
      { label: 'Paper — ACE (arXiv 2510.04618)', href: 'https://arxiv.org/abs/2510.04618' },
    ],
  },
  {
    slug: 'seminar-time-series-gnn',
    title: 'Seminar — GNN-Based Time-Series Forecasting',
    type: 'seminar',
    interactivity: 'showcase',
    year: 2025,
    tagline: 'Graph neural networks for multivariate time-series forecasting — my seminar talk.',
    description:
      'A seminar talk I co-presented with Tal Schul on graph-neural-network approaches to time ' +
      'series. The first ' +
      'half introduces GNNs from the ground up — what they are and why they apply to ' +
      'time-series problems, where modelling the dependencies between many correlated series ' +
      'as a graph beats treating each series in isolation. The second half walks through two ' +
      'papers on the topic in depth. My presentation slides and the accompanying written ' +
      'report are linked below.',
    tech: ['Time Series', 'GNN', 'Forecasting', 'Deep Learning'],
    materials: [
      {
        label: 'Presentation slides',
        kind: 'slides',
        src: 'https://docs.google.com/presentation/d/1LcBPQ8i4ywfNIcMyTxKoXp0lQWG8xyYGtQnuQtPy1zg/embed?start=false&loop=false',
        href: 'https://docs.google.com/presentation/d/1LcBPQ8i4ywfNIcMyTxKoXp0lQWG8xyYGtQnuQtPy1zg/edit',
      },
      {
        label: 'Written report',
        kind: 'doc',
        src: 'https://docs.google.com/document/d/1_R2Bad_MFE0Pyz8ERpkKcd6dHXTol4Acaxxp6NQd9zk/preview',
        href: 'https://docs.google.com/document/d/1_R2Bad_MFE0Pyz8ERpkKcd6dHXTol4Acaxxp6NQd9zk/edit',
      },
    ],
  },

  // ── Coursework (Technion) — rendered as compact cards ─────────────────────
  {
    slug: 'causal-inference',
    title: 'Causal Inference — Maternal Smoking & Infant Mortality',
    type: 'coursework',
    interactivity: 'live',
    year: 2026,
    tagline:
      'Does smoking during pregnancy causally raise infant mortality? Seven estimators, one CDC cohort of 3.99M births.',
    description:
      'A Technion causal-inference course final project (097400, with Jeremy Jornet) estimating the ' +
      'causal effect of sustained daily cigarette smoking during pregnancy on infant death before age ' +
      'one, using the CDC’s 2015 Cohort Linked Birth/Infant Death Data Set (~3.99M US births). The ' +
      'naive gap is +0.52 pp, but seven estimators — S-/T-learner, IPW (± trimming), propensity-score ' +
      'matching, and AIPW (± trimming) — agree it’s really about +0.25 pp (≈2.5 extra deaths per 1,000 ' +
      'births), with 95% CIs that all exclude zero. The one soft spot: a tipping-point analysis shows a ' +
      'hidden confounder worth just 0.16–0.22 pp of bias — plausibly maternal stress, alcohol, or drug ' +
      'use, none of which are in the data — would erase the effect. The live demos reproduce the DAG, ' +
      'the seven-estimator forest plot, and the propensity-trimming and hidden-confounding sensitivity ' +
      'checks.',
    repo: `${GH}/Causal_Inference`,
    tech: ['Causal Inference', 'Python', 'Propensity Scores', 'Doubly Robust', 'Sensitivity Analysis'],
    embed: 'causal-inference/index.html',
  },
  {
    slug: 'xv6',
    title: 'Operating Systems — xv6 kernel',
    type: 'coursework',
    interactivity: 'live',
    year: 2023,
    tagline:
      'Hacking MIT’s xv6 kernel: a 3-level MLQ scheduler, new syscalls, and a signals layer — with a live scheduler visualizer.',
    description:
      'Modifications to the xv6 teaching OS (C, x86): replaced the round-robin scheduler with a ' +
      'preemptive 3-level multi-level-queue scheduler (time slices 8/16/32, a setpriority syscall), ' +
      'added the lsproc and waitpid system calls end-to-end, and scaffolded a POSIX-style signals ' +
      'layer. The live demo runs the exact MLQ policy as an animated Gantt chart with per-tick ready queues.',
    repo: `${GH}/xv6_hw`,
    tech: ['C', 'x86', 'Operating Systems', 'Kernel', 'Scheduling'],
    embed: 'xv6/index.html',
    playground: false, // live scheduler viz, but not "playground" material
  },
  {
    slug: 'fullstack',
    title: 'FullStack — Flask Web Development',
    type: 'coursework',
    interactivity: 'live',
    year: 2024,
    tagline:
      'A Flask PictureServer (image-classification REST API + UI) and a routing/Blueprints lab — recreated live in the browser.',
    description:
      'Flask websites coursework: HW1 is a PictureServer micro-service (app factory + Blueprint) ' +
      'exposing GET /status and POST /upload_image with Pillow validation and a mock classifier; ' +
      'Lab4 teaches routing, Blueprints and HTTP status codes. The demos faithfully recreate the ' +
      'real routes and data model client-side — a working PictureServer UI and an interactive Flask ' +
      'router (type a URL, see which route matches and the rendered response).',
    repo: `${GH}/FullStack_950219`,
    tech: ['Python', 'Flask', 'REST', 'Jinja2', 'Pillow'],
    embed: 'fullstack/index.html',
  },
  {
    slug: 'lab-data-viz',
    title: 'Data Analysis & Visualization Lab — Three Deliverables',
    type: 'coursework',
    interactivity: 'live',
    year: 2026,
    tagline: 'Technion · 094295 — a vector index, a Wikipedia retrieval pipeline, active learning + GNNs, and an entity-resolution hackathon.',
    description:
      'Technion’s Data Analysis & Visualization Lab (094295, with Guy Dukas and Murad Rahimli), three ' +
      'self-contained deliverables. Project A: a from-scratch dynamic vector index (insert/delete/' +
      'search, each ≤20 lines, sampled-threshold top-k ~10x faster than argpartition), plus a ' +
      'Wikipedia-style retrieval pipeline — the winning trick was forensically detecting that all 100 ' +
      'relevant pages in the public queries are among 200 template-generated synthetic pages hidden in ' +
      'a 27,074-page corpus, via five regexes with zero false negatives, collapsing search from ' +
      '27k noisy pages to 200 candidates (NDCG@10 0.4116 → 0.4651). Project B: active learning for ' +
      'employee attrition (margin sampling + a late "positive hunt" + 3x minority oversampling, mean ' +
      'F1 0.647) and a 2-layer GraphSAGE GNN for node classification. Hackathon: a multi-agent entity-' +
      'resolution pipeline — six blocking strategies (rules, TF-IDF, LSH, embeddings, sorted-' +
      'neighborhood, DeepBlocker) run in parallel and merged by a learned scorer, hitting ~90% recall ' +
      'inside a 2,000-pair budget. The live demo below covers all three, with an interactive rebuild of ' +
      'the retrieval pipeline’s query-processing rules.',
    repo: `${GH}/LabProject_940295`,
    tech: ['Python', 'Information Retrieval', 'Active Learning', 'GNN', 'Entity Resolution'],
    embed: 'lab-data-viz/index.html',
  },
  course('hagorem', 'The Human Factor in Data Collection', '960275', 'HaGorem_960275', ['A/B Testing', 'Webscraping'], true, { year: 2025 }),
  course('nlp', 'NLP', '970215', 'NLP_970215', ['Python', 'NLP'], true, { year: 2025 }),
  course('safa', 'Language & Computation', '960222', 'Safa_960222', ['NLP'], true, { year: 2025 }),
  course('genai-diffusion', 'Generative AI & Diffusion', '960236', 'GenerativeAI_Diffusion_960236', ['Diffusion'], true, { year: 2025 }),
  course('ml01', 'Statistical Machine Learning', '096411', 'ML01_096411', ['Python', 'ML'], true, { year: 2024 }),
  course('ml02', 'ML with Transformers & NN', '970209', 'ML02_970209', ['Transformers', 'ML'], true, { year: 2025 }),
  course('intro-ai', 'Intro to AI', '096210', 'intro_to_ai_096210', ['AI', 'Search'], true, { playground: true, year: 2024 }),
  course('optimization', 'Optimization', '096237', 'Optimization_096237', ['Optimization'], true, { year: 2024 }),
  course('algebraic', 'Algebraic Methods', '095296', 'Algebraic_Methods_095296', ['Math'], true, { year: 2024 }),
  course('sql', 'SQL', '094241', 'SQL_094241', ['SQL', 'Databases'], true, { year: 2025 }),
  course('statistics', 'Statistics', '970414', 'statistics_970414', ['Statistics'], true, { year: 2025 }),
  course('distributed', 'Distributed Systems', '096224', 'Distributed_Systems_096224', ['Systems'], true, { year: 2024 }),
  course('ds-algo', 'Data Structures & Algorithms', '', 'Mibnei', ['Java', 'Algorithms'], true, { playground: true, year: 2024 }),
  course('se-java', 'Software Engineering (Java OOP)', '094219', 'SE_course_Technion', ['Java', 'OOP'], true, { playground: true, year: 2023 }),
  course('intro-ds-python', 'Intro to Data Science in Python', '', 'Python_IntroToDS', ['Python', 'Data'], true, { year: 2023 }),
];

function course(
  slug: string,
  title: string,
  code: string,
  repoName: string,
  tech: string[],
  hasArtifact = false,
  opts: Partial<Project> = {},
): Project {
  return {
    slug,
    title,
    type: 'coursework',
    interactivity: 'showcase',
    tagline: code ? `Technion · ${code}` : 'Technion',
    description: `Technion coursework${code ? ` (${code})` : ''}.`,
    repo: `${GH}/${repoName}`,
    tech,
    ...(hasArtifact ? { embed: `${slug}/index.html` } : {}),
    ...opts,
  };
}

// Featured projects, with a couple pinned to the front; the rest keep
// registry order.
const FEATURED_FIRST = ['adversarial-ml-vlm', 'adversarial-tokenization'];
export const flagshipProjects = projects
  .filter((p) => p.highlight)
  .sort((a, b) => {
    const rank = (s: string) => {
      const i = FEATURED_FIRST.indexOf(s);
      return i === -1 ? FEATURED_FIRST.length : i;
    };
    return rank(a.slug) - rank(b.slug);
  });
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

// Live demos that run self-contained in an iframe — the Playground can embed
// these inline so a visitor can play in seconds, no setup or API key. An
// explicit `playground` flag overrides the default (curate via that flag).
export const embedDemos = projects.filter((p) => {
  if (!p.embed || p.playground === false) return false;
  return p.playground === true || p.interactivity === 'live';
});
// Other live demos that need their own page (a chat UI / bring-your-own-key,
// or in-browser retrieval) rather than a bare iframe.
export const liveNoEmbedDemos = projects.filter(
  (p) => p.interactivity === 'live' && !p.embed,
);

// Distinct tech tags across the registry, with how many projects use each —
// powers the tag filter on the Projects page.
export const techTags: { name: string; count: number }[] = (() => {
  const map = new Map<string, { name: string; count: number }>();
  for (const p of projects) {
    for (const raw of p.tech) {
      const name = raw.trim();
      if (!name) continue;
      const key = name.toLowerCase();
      const stat = map.get(key) ?? { name, count: 0 };
      stat.count += 1;
      map.set(key, stat);
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
})();
