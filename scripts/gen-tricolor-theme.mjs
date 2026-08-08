/**
 * Regenerates the colour-remap half of src/styles/theme-tricolor.css.
 *
 *   npm run theme:gen
 *
 * WHY A GENERATOR
 * The CRM paints its brand with ~1,400 hardcoded Tailwind arbitrary values
 * (bg-[#FB641B], text-[#27AE60], text-[#8E44AD] …). The Independence Day skin
 * re-points the classes Tailwind emits for those values instead of editing 200
 * screens. Writing those overrides by hand would be unreviewable, so this script
 * derives them from two sources:
 *
 *   1. every brand-coloured class actually present in src/ (scanned), so today's
 *      screens are covered exactly, with the right variant and opacity forms;
 *   2. an insurance set (text/bg/border/ring × base/hover/focus/group-hover) so
 *      a newly written class in the usual shape is skinned without a re-run.
 *
 * WHAT TO EDIT
 *   • a colour looks wrong  → PALETTE below (one line; every rule reads it
 *                             through a CSS variable, so no re-run is needed —
 *                             you can also just edit the :root block in the CSS)
 *   • a new brand hex appears in the app → MAP below, then re-run
 *   • the flourishes (ribbon, gradients, chakra chrome) → hand-written in
 *     src/styles/theme-tricolor.head.css, which this script prepends verbatim
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const HEAD = join(SRC, 'styles/theme-tricolor.head.css');
const OUT = join(SRC, 'styles/theme-tricolor.css');

/* ── PALETTE ──────────────────────────────────────────────────────────────────
   Flag saffron (#FF9933) and flag green (#138808) at full strength cannot carry
   white text on a button, so solid surfaces use a deepened saffron and India
   green while the true flag tones are reserved for ribbons and gradients, where
   nothing sits on top of them. */
const PALETTE = {
  saffron: ['#E2761B', 'primary actions'],
  'saffron-deep': ['#C05E10', 'pressed / hover'],
  'saffron-burnt': ['#B4530C', 'dark orange'],
  'saffron-lift': ['#EE8C33', 'top of the button gradient'],
  'saffron-bright': ['#FF9933', 'true flag saffron — ribbons only'],
  'saffron-tint': ['#FFF4E8', 'tinted surfaces'],

  green: ['#138808', 'India green — success, connected, money in'],
  'green-deep': ['#0E6B06', 'dark green'],
  'green-bright': ['#17910C', 'bright green'],
  'green-tint': ['#EDF6EA', 'khadi green surfaces'],

  navy: ['#17376B', 'chakra navy — chrome, headings, focus'],
  'navy-soft': ['#24508F', 'navy hover'],
  'navy-deep': ['#0C2450', 'deep navy'],
  'navy-darkest': ['#08183A', 'deepest navy'],
  'navy-tint': ['#DCE4F2', 'navy tinted surfaces'],
  'navy-pale': ['#A8BEE4', 'inverse navy'],

  gold: ['#B8860B', 'antique gold — the premium accent'],
  'gold-deep': ['#8F6A08', 'gold hover'],
  'gold-soft': ['#DCBB5A', 'soft gold'],
  'gold-tint': ['#FFF8E7', 'gold tinted surfaces'],

  ivory: ['#FFFDF8', 'the white band of the flag'],
};

/* ── MAP: the app's brand hexes → palette entry ───────────────────────────── */
const MAP = new Map([
  ['#fb641b', ['saffron', 'primary action orange']],
  ['#e4540d', ['saffron-deep', 'primary hover']],
  ['#e05615', ['saffron-deep', 'primary hover, alt spelling']],
  ['#d35400', ['saffron-burnt', 'dark orange']],
  ['#fff2eb', ['saffron-tint', 'orange tint surface']],
  ['#fff4ec', ['saffron-tint', 'orange tint surface']],
  ['#27ae60', ['green', 'success / call green']],
  ['#219653', ['green-deep', 'dark green']],
  ['#1e8449', ['green-deep', 'dark green']],
  ['#16a34a', ['green-deep', 'green-600']],
  ['#eafaf1', ['green-tint', 'light green surface']],
  ['#8e44ad', ['navy', 'purple accent']],
  ['#7d3c98', ['navy-deep', 'dark purple']],
  ['#f39c12', ['gold', 'amber']],
  ['#e08e0b', ['gold-deep', 'amber hover']],
  ['#f2c94c', ['gold-soft', 'light amber']],
  ['#fff9e6', ['gold-tint', 'amber tint surface']],
  ['#1a5276', ['navy-deep', 'deep blue']],
  ['#154360', ['navy-darkest', 'deepest blue']],
  // NOT remapped on purpose: #22c55e (Tailwind green-500) only ever appears on
  // the near-black consoles, where India green would drop below 4:1.
]);

/* Named tailwind.config tokens carry the same brand identity as the arbitrary
   hexes — text-primary alone is used 500+ times — so they are remapped too. */
const NAMED = new Map([
  ['primary', ['navy', 'CRM blue']],
  ['primary-container', ['navy-soft', 'CRM blue hover']],
  ['primary-fixed', ['navy-tint', 'blue tint']],
  ['secondary', ['saffron-burnt', 'rust']],
  ['secondary-container', ['saffron', 'bright orange']],
  ['tertiary', ['saffron-burnt', 'dark orange']],
  ['tertiary-container', ['saffron-deep', 'orange container']],
  ['surface-tint', ['navy', 'surface tint']],
  ['inverse-primary', ['navy-pale', 'inverse blue']],
]);

const PROP = {
  text: 'color',
  bg: 'background-color',
  border: 'border-color',
  'border-t': 'border-top-color',
  'border-r': 'border-right-color',
  'border-b': 'border-bottom-color',
  'border-l': 'border-left-color',
  ring: '--tw-ring-color',
  accent: 'accent-color',
  fill: 'fill',
  stroke: 'stroke',
  caret: 'caret-color',
  decoration: 'text-decoration-color',
  outline: 'outline-color',
  shadow: '--tw-shadow-color',
  divide: 'border-color',
  from: 'gradient',
  via: 'gradient',
  to: 'gradient',
};

const VARIANT = {
  '': (s) => s,
  hover: (s) => `${s}:hover`,
  focus: (s) => `${s}:focus`,
  'focus-visible': (s) => `${s}:focus-visible`,
  'focus-within': (s) => `${s}:focus-within`,
  active: (s) => `${s}:active`,
  disabled: (s) => `${s}:disabled`,
  'group-hover': (s) => `.group:hover ${s}`,
  'group-focus': (s) => `.group:focus ${s}`,
  'peer-hover': (s) => `.peer:hover ~ ${s}`,
};

const rgbTriple = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

// ── collect the combos in use ────────────────────────────────────────────────
const combos = new Set(); // "variant|util|colourKey|opacity"

const HEX_TOKEN = /(?:([a-z-]+):)?(border-[trbl]|[a-z-]+)-\[(#[0-9a-fA-F]{6})\](?:\/(\d{1,3}))?/g;
// Longest token first so `bg-primary-container` never matches as `bg-primary`.
const NAMED_TOKEN = new RegExp(
  `(?:([a-z-]+):)?(border-[trbl]|[a-z]+)-(${[...NAMED.keys()]
    .sort((a, b) => b.length - a.length)
    .join('|')})(?:\\/(\\d{1,3}))?(?![\\w-])`,
  'g'
);

const scan = (txt) => {
  for (const m of txt.matchAll(HEX_TOKEN)) {
    const [, variant = '', util, hex, op] = m;
    if (!MAP.has(hex.toLowerCase()) || !(util in PROP) || !(variant in VARIANT)) continue;
    combos.add([variant, util, hex, op || ''].join('|'));
  }
  for (const m of txt.matchAll(NAMED_TOKEN)) {
    const [, variant = '', util, token, op] = m;
    if (!(util in PROP) || !(variant in VARIANT)) continue;
    combos.add([variant, util, token, op || ''].join('|'));
  }
};

const walk = (dir) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?)$/.test(p)) scan(readFileSync(p, 'utf8'));
  }
};

walk(SRC);
const scanned = combos.size;

// Insurance. Tailwind class selectors are case-sensitive, so both spellings of
// each hex are emitted: bg-[#fb641b] and bg-[#FB641B] are different classes.
for (const hex of MAP.keys()) {
  for (const spelling of [hex, '#' + hex.slice(1).toUpperCase()]) {
    for (const util of ['text', 'bg', 'border', 'ring']) {
      for (const variant of ['', 'hover', 'focus', 'group-hover']) {
        combos.add([variant, util, spelling, ''].join('|'));
      }
    }
  }
}

// ── emit ─────────────────────────────────────────────────────────────────────
const esc = (s) => s.replace(/([[\]#/:.])/g, '\\$1');

const palette = [
  '/* ── PALETTE ──────────────────────────────────────────────────────────────',
  '   Change a colour HERE and the whole skin follows — every rule below reads',
  '   these variables. Generated from PALETTE in scripts/gen-tricolor-theme.mjs;',
  '   editing the values in place is safe, the -rgb twin must match its hex. */',
  ':root[data-theme="tricolor"] {',
];
for (const [key, [hex, note]] of Object.entries(PALETTE)) {
  palette.push(`  --tm-${key}: ${hex};`.padEnd(38) + `/* ${note} */`);
  palette.push(`  --tm-${key}-rgb: ${rgbTriple(hex)};`);
}
palette.push('}\n');

const byColour = new Map();
for (const combo of combos) {
  const [variant, util, token, op] = combo.split('|');
  const named = !token.startsWith('#');
  const [key] = named ? NAMED.get(token) : MAP.get(token.toLowerCase());
  const value = op
    ? `rgb(var(--tm-${key}-rgb) / ${String(Number(op) / 100).replace(/^0/, '')})`
    : `var(--tm-${key})`;
  const raw = named ? `${util}-${token}` : `${util}-[${token}]`;
  const sel = VARIANT[variant](`.${esc((variant ? variant + ':' : '') + raw + (op ? '/' + op : ''))}`);

  let decl;
  if (PROP[util] === 'gradient') {
    decl = `--tw-gradient-${util}: ${value} var(--tw-gradient-${util}-position) !important;`;
    if (util === 'from') {
      decl +=
        `\n  --tw-gradient-to: rgb(var(--tm-${key}-rgb) / 0) var(--tw-gradient-to-position) !important;` +
        `\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;`;
    }
  } else {
    decl = `${PROP[util]}: ${value} !important;`;
  }

  const group = named ? `token:${token}` : token.toLowerCase();
  if (!byColour.has(group)) byColour.set(group, new Map());
  const g = byColour.get(group);
  if (!g.has(decl)) g.set(decl, []);
  g.get(decl).push(sel);
}

const rules = [];
for (const [group, groups] of [...byColour].sort()) {
  const named = group.startsWith('token:');
  const token = named ? group.slice(6) : group;
  const [key, note] = named ? NAMED.get(token) : MAP.get(token);
  rules.push(`\n/* ${named ? token : token.toUpperCase()} · ${note} → --tm-${key} */`);
  for (const [decl, sels] of [...groups].sort((a, b) => a[1][0].localeCompare(b[1][0]))) {
    rules.push(
      [...new Set(sels)].sort().map((s) => `[data-theme="tricolor"] ${s}`).join(',\n') + ` {\n  ${decl}\n}`
    );
  }
}

const banner = `/* ─────────────────────────────────────────────────────────────────────────────
   COLOUR REMAP — generated by scripts/gen-tricolor-theme.mjs (npm run theme:gen)
   ${combos.size} class overrides across ${byColour.size} brand colours.
   Selectors mirror what Tailwind emits, so \`hover:\` only paints on :hover and
   slash-opacity forms keep their alpha. Hand edits here are lost on the next
   run — change PALETTE or MAP in the script instead.
   ───────────────────────────────────────────────────────────────────────────── */`;

writeFileSync(OUT, [palette.join('\n'), readFileSync(HEAD, 'utf8'), banner, rules.join('\n')].join('\n') + '\n');

console.log(
  `theme:gen → ${OUT.replace(ROOT + '/', '')}\n` +
    `  ${scanned} classes found in src, ${combos.size} overrides emitted across ${byColour.size} colours`
);
