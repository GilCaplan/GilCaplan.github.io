// Build a compact JSON of the REAL NoseBook social graph for the ecommerce/HW01
// seed-set-search artifact (github.com/GilCaplan/ecommerce, HW01).
//
// Source (copied verbatim from the HW01 submission):
//   - NoseBook_friendships.csv : the real 4,039-node / 88,234-edge friendship graph
//   - costs.csv                : the real per-user seeding cost (mostly 100, some
//                                more — same field the real greedy/genetic solver reads)
//
// The full real graph ships as-is (every node, every edge) so the in-browser
// diffusion simulation (buy_products / product_exposure_score, ported 1:1 from
// HW01/`solution code.py`) scores against the real network. Only the *candidate
// pool* is trimmed for the live demo: the real assignment ranks candidates by
// degree centrality UNION betweenness centrality (top 600 each); betweenness on
// a graph this size is a multi-minute offline computation in the original code
// too ("Step 1 takes approximately ~3min to run"), so this build keeps the part
// that's cheap to reproduce exactly (degree centrality, real cost filter) and
// takes the top POOL_SIZE by that ranking — a real, disclosed simplification,
// not fabricated data.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data', 'ecommerce');
const OUT_DIR = path.join(__dirname, '..', 'public', 'ecommerce');

const POOL_SIZE = 1000; // live-demo candidate pool: top-1000 by real degree centrality (cost==100 only) — matches the real assignment's ~800-1,000-node pool scale

function parseCsv(text) {
  const lines = text.trim().split('\n');
  const header = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const parts = line.split(',');
    const row = {};
    header.forEach((h, i) => { row[h.trim()] = parts[i]?.trim(); });
    return row;
  });
}

const friendshipsCsv = readFileSync(path.join(DATA_DIR, 'NoseBook_friendships.csv'), 'utf-8');
const costsCsv = readFileSync(path.join(DATA_DIR, 'costs.csv'), 'utf-8');

const edgeRows = parseCsv(friendshipsCsv);
const costRows = parseCsv(costsCsv);

let n = 0;
costRows.forEach((r) => { n = Math.max(n, Number(r.user) + 1); });

const costs = new Array(n).fill(100);
costRows.forEach((r) => { costs[Number(r.user)] = Number(r.cost); });

const adjacency = Array.from({ length: n }, () => new Set());
const edgeFlat = [];
edgeRows.forEach((r) => {
  const u = Number(r.user), v = Number(r.friend);
  if (adjacency[u].has(v)) return; // de-dupe (the source CSV lists each edge once, but guard anyway)
  adjacency[u].add(v);
  adjacency[v].add(u);
  edgeFlat.push(u, v);
});

const degree = adjacency.map((s) => s.size);

// Real degree-centrality ranking, cost==100 filter (matches HW01's genetic-algorithm
// candidate filter — "MUST DO TO RUN GENETIC ALGORITHM" in the source comment).
const poolIds = Array.from({ length: n }, (_, i) => i)
  .filter((i) => costs[i] === 100)
  .sort((a, b) => degree[b] - degree[a])
  .slice(0, POOL_SIZE);

const totalEdges = edgeFlat.length / 2;

const out = {
  n,
  edges: edgeFlat,
  costs,
  poolIds,
  meta: {
    totalNodes: n,
    totalEdges,
    poolSize: poolIds.length,
    realBudget: 1000,
    realSeedCost: 100,
    realK: 10,
    source: 'github.com/GilCaplan/ecommerce/HW01',
  },
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(path.join(OUT_DIR, 'data.json'), JSON.stringify(out));

console.log(`nodes=${n} edges=${totalEdges} pool=${poolIds.length}`);
console.log(`degree range in pool: ${degree[poolIds[poolIds.length - 1]]}..${degree[poolIds[0]]}`);
