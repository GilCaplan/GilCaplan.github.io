import { useEffect, useRef, useState } from 'react';
import ApiKeyBar, { type KeyState } from '../components/ApiKeyBar';
import { chat, PROVIDERS, type ChatMessage } from '../lib/chat';
import type { Project } from '../data/types';

// ── In-browser RAG demo over a curated slice of real Sefaria passages ───────
// corpus.json (metadata + text) + vectors.bin (Float32 embeddings) are built by
// scripts/build_jude_corpus.mjs. Query embedding uses the SAME MiniLM model via
// transformers.js (loaded from CDN), so query/corpus vectors are comparable.

const STORAGE_KEY = 'gc_chat_key';
const TRANSFORMERS_CDN = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';
const MODEL = 'Xenova/all-MiniLM-L6-v2';

interface Segment {
  ref: string;
  book: string;
  cat: string;
  en: string;
  he: string;
}
interface Corpus {
  dim: number;
  count: number;
  books: string[];
  segments: Segment[];
}

function sefariaUrl(ref: string) {
  return `https://www.sefaria.org/${encodeURIComponent(ref.replace(/ /g, '_').replace(/:/g, '.'))}`;
}

type Mode = 'live' | 'demo';

// ── Demo presets ────────────────────────────────────────────────────────────
// In Demo mode the REAL in-browser retrieval still runs (no key needed). For
// these preset questions we also show a pre-written example synthesized answer
// so visitors see the full experience without calling an LLM provider.
interface Preset {
  q: string;
  answer: string;
}
const DEMO_PRESETS: Preset[] = [
  {
    q: 'What does the Torah say about resting on Shabbat?',
    answer:
      'The Torah frames Shabbat rest as both a commandment and a remembrance. The fourth ' +
      'commandment instructs Israel to "remember the Sabbath day, to keep it holy," working six ' +
      'days but ceasing on the seventh [1]. This rest is rooted in the creation account, where ' +
      'God rested on the seventh day and blessed it [2], making the weekly pause a re-enactment ' +
      'of that pattern. The prohibition extends to one\'s whole household and even servants and ' +
      'animals, underscoring that the day is a communal release from labor rather than mere ' +
      'private piety [1][3].',
  },
  {
    q: 'What do the sages teach about humility and good character?',
    answer:
      'The sages of Pirkei Avot tie good character to self-restraint and how one treats others. ' +
      'Ben Zoma teaches that the truly strong person is "one who conquers his own impulse," ' +
      'locating greatness in inner mastery rather than dominance [1]. Hillel\'s call to "be of ' +
      'the disciples of Aaron — loving peace and pursuing peace" sets humility and peacemaking as ' +
      'the ideal posture toward people [2]. Together the sources present humility not as ' +
      'self-deprecation but as disciplined, others-oriented conduct [1][3].',
  },
];

export default function JudeTemplate({ project }: { project: Project }) {
  const [key, setKey] = useState<KeyState>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) return JSON.parse(s) as KeyState;
    } catch {
      /* ignore */
    }
    return { provider: 'openai', model: PROVIDERS.openai.defaultModel, apiKey: '', remember: false };
  });
  const updateKey = (n: KeyState) => {
    setKey(n);
    try {
      if (n.remember) localStorage.setItem(STORAGE_KEY, JSON.stringify(n));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const [corpus, setCorpus] = useState<Corpus | null>(null);
  const vectorsRef = useRef<Float32Array | null>(null);
  const embedRef = useRef<((t: string) => Promise<Float32Array>) | null>(null);
  const [loadStage, setLoadStage] = useState('Loading demo corpus…');
  const [ready, setReady] = useState(false);

  const [mode, setMode] = useState<Mode>('live');
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [answer, setAnswer] = useState('');
  const [demoAnswer, setDemoAnswer] = useState(''); // canned example answer (demo only)
  const [sources, setSources] = useState<Segment[]>([]);

  // Load corpus + vectors once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const base = import.meta.env.BASE_URL;
        const [cRes, vRes] = await Promise.all([
          fetch(`${base}jude/corpus.json`),
          fetch(`${base}jude/vectors.bin`),
        ]);
        if (!cRes.ok || !vRes.ok) throw new Error('corpus not found');
        const c = (await cRes.json()) as Corpus;
        const buf = await vRes.arrayBuffer();
        if (cancelled) return;
        vectorsRef.current = new Float32Array(buf);
        setCorpus(c);
        setReady(true);
        setLoadStage('');
      } catch {
        if (!cancelled) setLoadStage('Could not load the demo corpus.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Lazily create the query embedder (downloads MiniLM from CDN on first ask).
  async function getEmbedder() {
    if (embedRef.current) return embedRef.current;
    setLoadStage('Loading the embedding model (first query only)…');
    const tf = await import(/* @vite-ignore */ TRANSFORMERS_CDN);
    tf.env.allowLocalModels = false;
    tf.env.useBrowserCache = true;
    const extractor = await tf.pipeline('feature-extraction', MODEL);
    const fn = async (text: string) => {
      const out = await extractor([text], { pooling: 'mean', normalize: true });
      return new Float32Array(out.data);
    };
    embedRef.current = fn;
    setLoadStage('');
    return fn;
  }

  function topK(q: Float32Array, k: number): Segment[] {
    const vecs = vectorsRef.current!;
    const dim = corpus!.dim;
    const scores: { i: number; s: number }[] = [];
    for (let i = 0; i < corpus!.count; i++) {
      let dot = 0;
      const off = i * dim;
      for (let d = 0; d < dim; d++) dot += q[d] * vecs[off + d];
      scores.push({ i, s: dot });
    }
    scores.sort((a, b) => b.s - a.s);
    return scores.slice(0, k).map((x) => corpus!.segments[x.i]);
  }

  // Demo mode: run the REAL retrieval (no key, no LLM) and, for preset questions,
  // show a pre-written example synthesized answer.
  async function runDemo(text: string, presetAnswer?: string) {
    if (!text || busy || !ready) return;
    setError('');
    setAnswer('');
    setDemoAnswer('');
    setSources([]);
    setBusy(true);
    try {
      const embed = await getEmbedder();
      const qv = await embed(text);
      const hits = topK(qv, 6);
      setSources(hits);
      if (presetAnswer) setDemoAnswer(presetAnswer);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Retrieval failed.');
    } finally {
      setBusy(false);
    }
  }

  async function ask() {
    const text = question.trim();
    if (!text || busy || !ready) return;
    if (mode === 'demo') {
      const preset = DEMO_PRESETS.find((p) => p.q.toLowerCase() === text.toLowerCase());
      await runDemo(text, preset?.answer);
      return;
    }
    setError('');
    setAnswer('');
    setDemoAnswer('');
    setSources([]);
    setBusy(true);
    try {
      const embed = await getEmbedder();
      const qv = await embed(text);
      const hits = topK(qv, 6);
      setSources(hits);

      const context = hits
        .map((h, i) => `[${i + 1}] ${h.ref}\n${h.en}`)
        .join('\n\n');
      const system =
        'You are Jude, a Judaic study assistant. Answer the question using ONLY the ' +
        'numbered sources provided. Cite sources inline as [1], [2], etc. matching their ' +
        'numbers. If the sources do not address the question, say so plainly rather than ' +
        'guessing. Keep a respectful, scholarly tone.';
      const messages: ChatMessage[] = [
        { role: 'user', content: `Sources:\n${context}\n\nQuestion: ${text}` },
      ];
      const reply = await chat({
        provider: key.provider,
        apiKey: key.apiKey,
        model: key.model,
        system,
        messages,
        temperature: 0.4,
      });
      setAnswer(reply);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Demo-slice + credit banner */}
      <div className="card border-ocean/40 bg-ocean/5 p-4 text-sm text-muted">
        <p>
          <strong className="text-ink2">This is a demo slice</strong> —{' '}
          {corpus ? corpus.count.toLocaleString() : '~9,000'} real passages from{' '}
          {corpus ? corpus.books.join(', ') : 'Torah, Psalms, Proverbs, Pirkei Avot, Mishnah Berakhot'}.
          The full Jude indexes <strong className="text-ink2">288,737</strong> Sefaria passages
          with a five-stage pipeline.{' '}
          <a href={project.repo} target="_blank" rel="noreferrer" className="link">
            Visit the project and run the full version ↗
          </a>
          .
        </p>
        <p className="mt-2 text-xs">
          Texts courtesy of{' '}
          <a href="https://www.sefaria.org" target="_blank" rel="noreferrer" className="link">
            Sefaria
          </a>{' '}
          (open-licensed). Retrieval runs entirely in your browser; answers use your own API
          key, sent only to your chosen provider.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="card flex flex-wrap items-center gap-3 p-3">
        <span className="text-xs uppercase tracking-wider text-muted">Mode</span>
        <div className="inline-flex overflow-hidden rounded-lg border border-line">
          <button
            onClick={() => setMode('live')}
            className={`px-4 py-1.5 text-sm transition ${
              mode === 'live' ? 'bg-accent text-ink' : 'bg-app text-ink2 hover:text-accent'
            }`}
          >
            Live (your key)
          </button>
          <button
            onClick={() => setMode('demo')}
            className={`px-4 py-1.5 text-sm transition ${
              mode === 'demo' ? 'bg-accent text-ink' : 'bg-app text-ink2 hover:text-accent'
            }`}
          >
            Demo (no key)
          </button>
        </div>
        <span className="text-xs text-muted">
          {mode === 'live'
            ? 'Real in-browser retrieval + answer synthesis with your own API key.'
            : 'No key needed — run the real retrieval and see an example synthesized answer.'}
        </span>
      </div>

      {mode === 'live' ? (
        <ApiKeyBar state={key} onChange={updateKey} />
      ) : (
        <div className="card border-ocean/40 bg-ocean/5 p-4 text-sm text-muted">
          <p>
            <strong className="text-ink2">Demo — no API key, no LLM call.</strong> The retrieval
            below is the <strong className="text-ink2">genuine in-browser RAG</strong>: your query
            is embedded with MiniLM and matched against the shipped Sefaria vectors. Pick a preset
            to also see a pre-written example answer, or type your own question to see the real
            retrieved passages.
          </p>
        </div>
      )}

      {loadStage && <p className="text-sm text-muted">{loadStage}</p>}

      {mode === 'demo' && (
        <div className="card p-4">
          <p className="mb-2 text-xs uppercase tracking-wider text-muted">Try a preset</p>
          <div className="flex flex-wrap gap-2">
            {DEMO_PRESETS.map((p) => (
              <button
                key={p.q}
                onClick={() => {
                  setQuestion(p.q);
                  runDemo(p.q, p.answer);
                }}
                disabled={busy || !ready}
                className="btn-ghost text-left text-sm disabled:opacity-60"
              >
                {p.q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <div className="flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ask()}
            placeholder="Ask about Torah, Psalms, ethics… (e.g. “What does the Torah say about resting on Shabbat?”)"
            disabled={busy || !ready}
            className="flex-1 rounded-lg border border-line bg-app px-4 py-2 text-sm text-ink2 outline-none focus:border-accent disabled:opacity-60"
          />
          <button onClick={ask} disabled={busy || !ready} className="btn-accent disabled:opacity-60">
            {busy ? (mode === 'demo' ? 'Retrieving…' : 'Thinking…') : mode === 'demo' ? 'Retrieve' : 'Ask'}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-spice">{error}</p>}
      </div>

      {mode === 'demo' && demoAnswer && (
        <div className="card border-ocean/40 bg-ocean/5 p-5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
              Demo answer
            </h3>
            <span className="rounded-full bg-app px-2 py-0.5 text-[11px] uppercase tracking-wider text-muted">
              Example — add your key for live synthesis
            </span>
          </div>
          <p className="whitespace-pre-wrap leading-relaxed text-ink2">{demoAnswer}</p>
          <p className="mt-3 text-xs text-muted">
            Demo answer — example only. The citations above reference the real retrieved passages;
            switch to <strong className="text-ink2">Live (your key)</strong> to synthesize a fresh
            answer over them.
          </p>
        </div>
      )}

      {mode === 'demo' && !demoAnswer && sources.length > 0 && (
        <div className="card border-ocean/40 bg-ocean/5 p-4 text-sm text-muted">
          Real retrieval ran for your question. This is a free-form query, so there's no canned
          answer — add your key in <strong className="text-ink2">Live</strong> mode to synthesize
          one over these passages.
        </div>
      )}

      {mode === 'live' && answer && (
        <div className="card p-5">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">Answer</h3>
          <p className="whitespace-pre-wrap leading-relaxed text-ink2">{answer}</p>
        </div>
      )}

      {sources.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
            Retrieved sources
          </h3>
          {sources.map((s, i) => (
            <div key={s.ref} className="card p-4">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-muted">[{i + 1}]</span>
                <a href={sefariaUrl(s.ref)} target="_blank" rel="noreferrer" className="link text-sm font-medium">
                  {s.ref} ↗
                </a>
              </div>
              <p className="text-sm text-ink2">{s.en}</p>
              {s.he && <p dir="rtl" className="mt-2 font-mono text-sm text-muted">{s.he}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
