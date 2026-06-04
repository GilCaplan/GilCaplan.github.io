// Build a ~20MB demo RAG corpus for the Jude project page.
// Fetches REAL passages from the Sefaria API (the same source Jude itself uses),
// embeds the English text with all-MiniLM-L6-v2, and writes:
//   public/jude/corpus.json  — metadata + en/he text per passage
//   public/jude/vectors.bin  — Float32 little-endian embeddings (count * 384)
// Texts © Sefaria, distributed under their open licenses (https://www.sefaria.org).
// This is a curated SLICE — the full Jude indexes 288,737 passages.

import { pipeline } from '@xenova/transformers';
import { writeFileSync, mkdirSync } from 'node:fs';

// Most-referenced, foundational works (the canonical backbone Jude leans on).
const BOOKS = [
  { title: 'Genesis', chapters: 50, cat: 'Torah' },
  { title: 'Exodus', chapters: 40, cat: 'Torah' },
  { title: 'Leviticus', chapters: 27, cat: 'Torah' },
  { title: 'Numbers', chapters: 36, cat: 'Torah' },
  { title: 'Deuteronomy', chapters: 34, cat: 'Torah' },
  { title: 'Psalms', chapters: 150, cat: 'Writings' },
  { title: 'Proverbs', chapters: 31, cat: 'Writings' },
  { title: 'Pirkei Avot', chapters: 6, cat: 'Mishnah' },
  { title: 'Mishnah Berakhot', chapters: 9, cat: 'Mishnah' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function clean(s) {
  if (Array.isArray(s)) s = s.join(' ');
  if (typeof s !== 'string') return '';
  return s
    .replace(/<i[^>]*class="footnote"[^>]*>.*?<\/i>/gis, '')
    .replace(/<sup[^>]*>.*?<\/sup>/gis, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&thinsp;/g, ' ')
    .replace(/ /g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchChapter(book, ch, tries = 3) {
  const url = `https://www.sefaria.org/api/texts/${encodeURIComponent(book)}.${ch}?context=0&commentary=0`;
  for (let t = 0; t < tries; t++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'jude-demo-builder' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (t === tries - 1) {
        console.warn(`  ! ${book}.${ch} failed: ${e.message}`);
        return null;
      }
      await sleep(800);
    }
  }
}

const segments = [];
for (const b of BOOKS) {
  process.stdout.write(`Fetching ${b.title} (${b.chapters} ch): `);
  for (let ch = 1; ch <= b.chapters; ch++) {
    const d = await fetchChapter(b.title, ch);
    if (!d) continue;
    const en = Array.isArray(d.text) ? d.text : [d.text];
    const he = Array.isArray(d.he) ? d.he : [d.he];
    const baseRef = d.ref || `${b.title} ${ch}`;
    for (let i = 0; i < en.length; i++) {
      const enT = clean(en[i]);
      const heT = clean(he[i]);
      if (!enT) continue;
      segments.push({ ref: `${baseRef}:${i + 1}`, book: b.title, cat: b.cat, en: enT, he: heT });
    }
    process.stdout.write('.');
    await sleep(120);
  }
  process.stdout.write(` ✓ (${segments.length} total)\n`);
}

console.log(`\nCollected ${segments.length} passages. Embedding…`);
const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
const DIM = 384;
const vectors = new Float32Array(segments.length * DIM);
const BATCH = 64;
for (let i = 0; i < segments.length; i += BATCH) {
  const batch = segments.slice(i, i + BATCH).map((s) => s.en);
  const out = await extractor(batch, { pooling: 'mean', normalize: true });
  vectors.set(out.data, i * DIM);
  if (i % (BATCH * 16) === 0) process.stdout.write(`  ${i}/${segments.length}\r`);
}
console.log(`  ${segments.length}/${segments.length} embedded.`);

mkdirSync('public/jude', { recursive: true });
const meta = {
  model: 'Xenova/all-MiniLM-L6-v2',
  dim: DIM,
  count: segments.length,
  books: BOOKS.map((b) => b.title),
  source: 'Sefaria (https://www.sefaria.org)',
  note: 'Curated demo slice. The full Jude indexes 288,737 Sefaria passages.',
  segments,
};
writeFileSync('public/jude/corpus.json', JSON.stringify(meta));
writeFileSync('public/jude/vectors.bin', Buffer.from(vectors.buffer));

const mb = (n) => (n / 1e6).toFixed(1) + ' MB';
const corpusBytes = Buffer.byteLength(JSON.stringify(meta));
console.log(`\nWrote public/jude/corpus.json  (${mb(corpusBytes)})`);
console.log(`Wrote public/jude/vectors.bin  (${mb(vectors.byteLength)})`);
console.log(`Total ~${mb(corpusBytes + vectors.byteLength)} · ${segments.length} passages`);
