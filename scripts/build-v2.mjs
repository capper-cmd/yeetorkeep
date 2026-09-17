#!/usr/bin/env node
/**
 * Generate public/v2/index.html from staging (public/index.html).
 *
 * /v2 is Eric's 17 Sep review pass: the changes from his "Few ideas. Changes"
 * email, applied to a copy of the site so the live pages stay untouched while
 * he looks at it. Same idea as scripts/promote.mjs -- a generator rather than
 * a hand-edited fork, so v2 cannot silently drift from staging, and so the
 * same substitutions can be replayed onto staging once he approves.
 *
 * Every substitution is guarded by must(): if staging changes underneath,
 * this fails loudly instead of quietly producing a half-applied page.
 *
 * Deliberately NOT here: the $50 numbered-print drop. Eric is still doing the
 * math and asked Chad what he thinks -- it is not a build instruction yet.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');

let checks = 0;
function must(src, needle, where) {
  if (!src.includes(needle)) throw new Error(`build-v2: ${where} — could not find:\n  ${needle}`);
  checks++;
}
function sub(s, from, to, where) {
  must(s, from, where);
  return s.replace(from, to);
}

/* v2-only CSS. Kept inline so staging's styles.css is untouched; when Eric
   approves, these rules move into styles.css with the markup. */
const V2_CSS = `<style>
  /* Eric asked for "red or an accent color" on the two keywords he thinks
     sell the work. Brass is the existing accent, so red is a second one --
     deep enough to sit beside brass on cream without turning into a warning. */
  :root { --accent-red: #a8271b; }
  .hero-lede .kw { color: var(--accent-red); font-weight: 500; }

  /* His signature on the black teaser. The asset is pure black on
     transparent (luminance 0/255), so it must be inverted or it renders
     invisible on the ink band. Height-capped like the other two placements. */
  .teaser-signature { margin: 26px 0 0; }
  .teaser-signature img {
    width: auto; height: 44px; max-width: min(280px, 100%);
    object-fit: contain; filter: invert(1); opacity: 0.92;
    display: inline-block;
  }
  .bottom-teaser-links { margin-top: 22px; }

  /* Jackie Robinson is commission-only, numbered /42, and will never have
     a print edition. That is a rule about the piece, not a price. */
  .piece-rule {
    display: block; margin: -8px 0 14px;
    font-size: 12.5px; letter-spacing: 0.04em; color: var(--accent-red);
  }
</style>`;

let s = readFileSync(join(PUBLIC, 'index.html'), 'utf8');

/* ---------- paths: /v2/ is one level down, assets live at the root ---------- */
s = s.replaceAll('"images/', '"/images/');
s = sub(s, '"styles.css"', '"/styles.css"', 'stylesheet');
s = sub(s, '"script.js"', '"/script.js"', 'script');

/* ---------- head: mark it generated, keep it out of search results ---------- */
s = sub(s,
  '<link rel="stylesheet" href="/styles.css">',
  `<meta name="robots" content="noindex, nofollow">\n<link rel="stylesheet" href="/styles.css">\n${V2_CSS}`,
  'head');
s = sub(s,
  '<!-- Built from a MotionSites.ai "Lumen" layout, then updated with a',
  `<!-- GENERATED FILE — do not edit by hand.\n     Built by scripts/build-v2.mjs from public/index.html (staging).\n     Any edit here is overwritten on the next build; change staging or the\n     generator instead.\n\n     This is Eric's 17 Sep review pass. See public/_eric-site-notes.md.\n\n     Built from a MotionSites.ai "Lumen" layout, then updated with a`,
  'header comment');

/* ---------- 3. hero: Eric's line verbatim, keywords in red ---------- */
s = sub(s,
  '<p class="hero-lede">Every canvas starts with a single frame — the swing, the stance, the knockout — and becomes an original painting built to outlast the highlight reel and inspire you.</p>',
  '<p class="hero-lede">Every canvas starts with a <span class="kw">custom frame</span> then — the swing, the stance, the knockout — becomes an <span class="kw">original canvas</span> painting built to outlast the highlight reel and inspire you.</p>',
  'hero lede');

/* ---------- 4. teaser: first person, signature on the black ---------- */
s = sub(s,
  '<p class="bottom-teaser-copy">Eric paints the athletes who defined the game — hand-built frames, one canvas at a time, each one unique. No print runs pretending to be originals. Eric can do this for your favorite player or sports moment.</p>',
  '<p class="bottom-teaser-copy">I paint the athletes who defined the game — hand-built frames, one canvas at a time, each one unique. No print runs pretending to be originals. I can do this for your favorite player or sports moment, I would be honored.</p>\n      <p class="teaser-signature"><img src="/images/lowres/signature.png" alt="Eric Samuel Timm" width="1200" height="232" loading="lazy"></p>',
  'teaser copy');

/* ---------- 5. original collection copy ---------- */
s = sub(s,
  '<p>A running collection of custom originals and small, signed and numbered print edition runs. New pieces are added as each painting is finished for the buyer — check back often, or order your own custom original.</p>',
  '<p>A running collection of custom originals and signed, jersey matched numbered print edition runs. New collectible pieces are added as each painting is finished for the buyer — check back often, or order your own custom original by Eric.</p>',
  'collection copy');

/* ---------- 1. "One of one" -> "#1" on every original ---------- */
const onesBefore = (s.match(/&middot; One of one/g) || []).length;
if (onesBefore !== 10) throw new Error(`build-v2: expected 10 "One of one" metas, found ${onesBefore}`);
s = s.replaceAll('&middot; One of one', '&middot; #1');

/* ---------- 12. collection statement: cut the middle clause ---------- */
s = sub(s,
  'Sports legends meet fine art. Nothing about it reads like a print off the internet — it just speaks beauty, class, and iconic success.',
  'Sports legends meet fine art — it just speaks beauty, class, and iconic success.',
  'collection statement');

/* ---------- 13. editions headline ---------- */
s = sub(s,
  '<h2>Signed, numbered, and gone once they\'re gone.</h2>',
  '<h2>Collectible Jersey Match Print Editions</h2>',
  'editions headline');

/* ---------- 11. shipping ---------- */
s = sub(s,
  'Prices include freight shipping to the continental US. Alaska, Hawaii, and international orders are quoted individually.',
  'All prices include professional rapid or freight shipping to the continental US. Alaska, Hawaii, and international original orders are quoted individually.',
  'shipping note');

/* ---------- 14. process quote ---------- */
const quoteStart = s.indexOf('<blockquote class="process-quote">');
const quoteEnd = s.indexOf('</blockquote>', quoteStart);
if (quoteStart === -1 || quoteEnd === -1) throw new Error('build-v2: no process quote');
checks++;
s = s.slice(0, quoteStart) +
  '<blockquote class="process-quote">&ldquo;I see my sports legends art as three fold: a mirror that reflects your connected memories and moments, a window that shows you your own greatness as possibility, and a door that invites my viewers inspiration despite the failures and flaws these icons all had.&rdquo;' +
  s.slice(quoteEnd);

/* ---------- 10. who's next copy ---------- */
s = sub(s,
  '<span class="piece-next-copy">Your player, your moment, your card &mdash; painted at the same size as everything above.</span>',
  '<span class="piece-next-copy">Painting with same or custom dimensions for your space.</span>',
  "who's next copy");

/* ---------- 15. budget dropdown: two rows become one ---------- */
s = sub(s,
  '<option>$2,000 – $5,000</option>\n              <option>$5,000+ / Custom Commission</option>',
  '<option>$2,000 to $5,000+ Custom Commission</option>',
  'budget select');


/* ==========================================================================
   The originals grid: per-piece edits, then Eric's ordering.

   Blocks are keyed by image filename rather than title text, because titles
   carry HTML entities and are the thing most likely to be reworded. The
   reorder is a pure permutation -- asserted below -- so a piece can never
   end up wearing another piece's caption, which is exactly what went wrong
   the last time this grid was reordered by regex.
   ========================================================================== */
const GRID_OPEN = '      <div class="work-grid">\n';
const gridStart = s.indexOf(GRID_OPEN);
if (gridStart === -1) throw new Error('build-v2: no work grid');
const gridInnerStart = gridStart + GRID_OPEN.length;
const gridEnd = s.indexOf('\n      </div>\n\n    </div>\n  </section>', gridInnerStart);
if (gridEnd === -1) throw new Error('build-v2: could not find the end of the work grid');

const gridInner = s.slice(gridInnerStart, gridEnd);
const blocks = gridInner.split(/\n(?=        <div class="piece |        <a href="#contact" class="piece piece-next)/);
const pieces = blocks.filter(b => b.includes('<div class="piece '));
const nextCard = blocks.filter(b => b.includes('piece-next'));
if (pieces.length !== 10) throw new Error(`build-v2: expected 10 pieces, got ${pieces.length}`);
if (nextCard.length !== 1) throw new Error(`build-v2: expected 1 "who's next" card, got ${nextCard.length}`);
if (pieces.length + nextCard.length !== blocks.length) throw new Error('build-v2: unrecognised block in the grid');

const keyOf = b => (b.match(/images\/lowres\/([a-z0-9-]+)\.jpg/) || [])[1];
const byKey = new Map();
for (const b of pieces) {
  const k = keyOf(b);
  if (!k) throw new Error('build-v2: a piece has no image');
  if (byKey.has(k)) throw new Error(`build-v2: duplicate piece image ${k}`);
  byKey.set(k, b);
}

/* --- 2, 7, 8, 9: per-piece edits ------------------------------------------ */
function edit(key, from, to, where) {
  const b = byKey.get(key);
  if (!b) throw new Error(`build-v2: no piece ${key}`);
  if (!b.includes(from)) throw new Error(`build-v2: ${where} (${key}) — could not find:\n  ${from}`);
  byKey.set(key, b.replace(from, to));
  checks++;
}
const price = (key, from, to) =>
  edit(key, `<span class="piece-price">${from}</span>`, `<span class="piece-price">${to}</span>`, `price ${from}->${to}`);

/* Sold originals get "Commission Similar". Both of these still carry their
   "Prints from $X" line above, so the print route stays visible too --
   Eric's three-step logic in one card. */
const commissionSimilar = (key, href) =>
  edit(key, `<a href="${href}" class="piece-link">See Prints &rarr;</a>`,
            '<a href="#contact" class="piece-link">Commission Similar &rarr;</a>',
            'sold CTA');
commissionSimilar('gretzky', '#edition-gretzky');
commissionSimilar('mantle-1952', '#edition-mantle-52');

price('kobe', '$4,000', '$5,000');
price('ohtani', '$5,000', '$4,000');
price('griffey-studio', '$5,000', '$4,000');
price('griffey-rookie', '$3,500', '$2,500');
price('mantle-themick', '$3,500', '$2,500');

edit('jackie-robinson',
  '<p class="piece-materials">Wood, acrylic, charcoal, marker, spray paint</p>',
  '<p class="piece-materials">Wood, acrylic, charcoal, marker, spray paint</p>\n          <span class="piece-rule">Commissioned originals only &middot; numbered /42 &middot; no print editions</span>',
  'Robinson rule');

/* --- 6: Eric's ordering ---------------------------------------------------- */
const ORDER = ['jordan', 'gretzky', 'kobe', 'jackie-robinson', 'ohtani',
               'mantle-1952', 'griffey-studio', 'griffey-rookie', 'mantle-themick', 'brady'];
if (ORDER.length !== byKey.size || !ORDER.every(k => byKey.has(k)))
  throw new Error('build-v2: the order list and the grid do not describe the same ten pieces');

/* The stagger is positional, so delays are reassigned by column rather than
   travelling with the piece -- otherwise the reveal fires out of sequence. */
let ordered = ORDER.map((k, i) => {
  const delay = [' reveal', ' reveal reveal-delay-1', ' reveal reveal-delay-2'][i % 3];
  return byKey.get(k).replace(/ reveal(?: reveal-delay-[12])?/, delay);
});
const nextWithDelay = nextCard[0].replace(/ reveal(?: reveal-delay-[12])?/,
  [' reveal', ' reveal reveal-delay-1', ' reveal reveal-delay-2'][ORDER.length % 3]);

const newGrid = ordered.concat([nextWithDelay]).join('\n');
s = s.slice(0, gridInnerStart) + newGrid + s.slice(gridEnd);

/* --- the reorder must be a permutation, nothing lost or duplicated --------- */
for (const k of ORDER) {
  const n = (s.match(new RegExp(`images/lowres/${k}\\.jpg`, 'g')) || []).length;
  const expected = k === 'ohtani' ? 1 : 1;
  if (n < 1) throw new Error(`build-v2: ${k} vanished from the page`);
}
const finalPieces = (s.match(/<div class="piece /g) || []).length;
if (finalPieces !== 10) throw new Error(`build-v2: ${finalPieces} pieces after reorder, expected 10`);
const titles = [...s.matchAll(/<h3 class="piece-title">(.*?)<\/h3>/g)].map(m => m[1]);
if (new Set(titles).size !== 10) throw new Error('build-v2: duplicate or missing piece titles after reorder');

/* --- pair every title with the image directly above it, as a final guard --- */
const pairs = [...s.matchAll(/images\/lowres\/([a-z0-9-]+)\.jpg[\s\S]{0,400}?<h3 class="piece-title">(.*?)<\/h3>/g)]
  .map(m => [m[1], m[2].replace(/&[a-z]+;/g, '').trim()]);
const EXPECT = {
  'jordan': 'Michael Jordan', 'gretzky': 'Wayne Gretzky', 'kobe': 'Kobe Bryant',
  'jackie-robinson': 'Jackie Robinson', 'ohtani': 'Shohei Ohtani',
  'mantle-1952': 'Mickey Mantle', 'griffey-studio': 'Ken Griffey Jr.',
  'griffey-rookie': 'Ken Griffey Jr.', 'mantle-themick': 'Mickey Mantle', 'brady': 'Tom Brady',
};
for (const [img, title] of pairs) {
  if (EXPECT[img] && !title.startsWith(EXPECT[img]))
    throw new Error(`build-v2: ${img}.jpg is captioned "${title}" — expected ${EXPECT[img]}`);
  if (EXPECT[img]) checks++;
}

mkdirSync(join(PUBLIC, 'v2'), { recursive: true });
writeFileSync(join(PUBLIC, 'v2', 'index.html'), s);
console.log(`  built public/v2/index.html  (${checks} guarded checks passed)`);
console.log(`  order: ${ORDER.join(' > ')} > who's next`);
