// Build a compact JSON of REAL city data for the USA trip-cost artifact.
// Sources (from the project's private data repo, GilCaplan/USA_trip_cost_agent_pr):
//   - transportation_data.csv : Numbeo transport costs per US city
//   - city_profiles.csv       : entertainment-venue profile per US city
// We only surface real fields; no modeled/predicted totals are fabricated here.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

function parseCSV(text) {
  const rows = [];
  let i = 0;
  const n = text.length;
  let field = '';
  let record = [];
  let inq = false;
  while (i < n) {
    const c = text[i];
    if (inq) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inq = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inq = true;
      i++;
      continue;
    }
    if (c === ',') {
      record.push(field);
      field = '';
      i++;
      continue;
    }
    if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      record.push(field);
      rows.push(record);
      record = [];
      field = '';
      i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field.length || record.length) {
    record.push(field);
    rows.push(record);
  }
  return rows;
}

function toObjects(rows) {
  const head = rows[0];
  return rows.slice(1).filter((r) => r.length === head.length).map((r) => {
    const o = {};
    head.forEach((h, i) => (o[h] = r[i]));
    return o;
  });
}

const num = (v) => {
  const x = parseFloat(v);
  return Number.isFinite(x) ? x : null;
};

const trans = toObjects(parseCSV(readFileSync('/tmp/usa_data/transportation_data.csv', 'utf8')));
const prof = toObjects(parseCSV(readFileSync('/tmp/usa_data/city_profiles.csv', 'utf8')));

const key = (city, st) => `${(city || '').trim().toLowerCase()}|${(st || '').trim().toUpperCase()}`;

const profByKey = new Map();
for (const p of prof) profByKey.set(key(p.city, p.state), p);

const cities = [];
for (const t of trans) {
  const st = t.abbreviation;
  const p = profByKey.get(key(t.city, st));
  cities.push({
    city: t.city,
    state: st,
    transport: {
      oneWayTicket: num(t['One-Way Ticket (Local Transport)']),
      monthlyPass: num(t['Monthly Public Transport Pass (Regular Price)']),
      taxiStart: num(t['Taxi Start (Standard Tariff)']),
      taxiPerMile: num(t['Taxi 1 mile (Standard Tariff)']),
      gasPerLiter: num(t['Gasoline (1 Liter)']),
    },
    entertainment: p
      ? {
          venueCount: num(p.venue_count),
          avgPrice: num(p.avg_price),
          avgRating: num(p.avg_rating),
          dominantCategory: p.dominant_category || null,
          dominantAudience: p.dominant_audience || null,
          pctKidFriendly: num(p.pct_kid_friendly),
          pctHasDeals: num(p.pct_has_deals),
        }
      : null,
  });
}

// Keep cities that have at least transport data; sort by name.
cities.sort((a, b) => (a.city + a.state).localeCompare(b.city + b.state));

mkdirSync('public/usa-trip-cost-agent', { recursive: true });
const out = {
  source: 'GilCaplan/USA_trip_cost_agent_pr (Numbeo transport + venue profiles)',
  count: cities.length,
  withEntertainment: cities.filter((c) => c.entertainment).length,
  cities,
};
writeFileSync('public/usa-trip-cost-agent/data.json', JSON.stringify(out));
console.log(
  `Wrote ${cities.length} cities (${out.withEntertainment} with entertainment profiles), ` +
    `${(Buffer.byteLength(JSON.stringify(out)) / 1000).toFixed(0)} KB`,
);
