#!/usr/bin/env node
/**
 * Promote staging to the branded domains.
 *
 * yeetorkeep.io serves public/index.html + public/styles.css + public/script.js
 * directly — that's staging, and it changes whenever we push.
 *
 * The branded domains (sportslegendsart.com, sportslegends.art,
 * sportlegendsart.com) serve generated pages that reference
 * public/release/styles.css and public/release/script.js instead, so they
 * sit still until someone runs this.
 *
 * Promoting does two things, together:
 *   1. snapshots staging's CSS/JS into public/release/
 *   2. regenerates each branded page from public/index.html
 *
 * Run with --check to verify the generator reproduces the committed pages
 * without writing anything (useful after hand-editing a variant).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const brands = JSON.parse(readFileSync(join(ROOT, 'scripts/brands.json'), 'utf8'));
const check = process.argv.includes('--check');

const LOGO_CSS = `<style>
  .logo-mark { display: inline-flex; align-items: center; gap: 10px; }
  .logo-wordmark { font-family: 'Fraunces', 'Iowan Old Style', Georgia, serif; font-size: 19px; letter-spacing: 0.01em; font-weight: 500; color: var(--ink); }
  .logo-wordmark em { font-style: italic; color: var(--brass-deep); }
</style>`;

function must(src, needle, where) {
  if (!src.includes(needle)) throw new Error(`promote: ${where} — could not find:\n  ${needle}`);
  return true;
}

function render(slug, brand, staging) {
  let s = staging;

  // Branded pages live one directory down and pull shared assets from the
  // root, so every relative asset path becomes absolute. CSS and JS point at
  // the frozen release snapshot; images are shared and additive.
  s = s.replaceAll('"images/', '"/images/');
  must(s, '"styles.css"', `${slug} stylesheet`);
  s = s.replace('"styles.css"', '"/release/styles.css"');
  must(s, '"script.js"', `${slug} script`);
  s = s.replace('"script.js"', '"/release/script.js"');

  const subs = [
    ['<title>Eric Samuel Timm — Original Paintings of Iconic Athletes</title>',
     `<title>${brand.name} — Original Paintings of Iconic Athletes</title>`],

    ['<meta name="description" content="Hand-painted, one-of-one portraits of legendary athletes by Eric Samuel Timm. Originals and signed editions, built for the collector\'s wall.">',
     `<meta name="description" content="${brand.name} — hand-painted, one-of-one portraits of legendary athletes by Eric Samuel Timm. Originals and signed editions, built for the collector's wall.">`],

    ['<!-- Built from a MotionSites.ai "Lumen" layout, then updated with a',
     `<!-- GENERATED FILE — do not edit by hand.\n     Built by scripts/promote.mjs from public/index.html (staging).\n     Any edit here is overwritten on the next promote; change staging instead.\n\n     Branding: "${brand.name}" for ${brand.domain}.\n\n     Built from a MotionSites.ai "Lumen" layout, then updated with a`],

    ['<link rel="stylesheet" href="/release/styles.css">',
     `<link rel="stylesheet" href="/release/styles.css">\n${LOGO_CSS}`],

    ['<a href="#top" class="logo-mark" aria-label="Eric Samuel Timm — home">',
     `<a href="#top" class="logo-mark" aria-label="${brand.name} — home">`],

    ['<a href="#" id="instagramLink">@ericsamueltimm</a>',
     `<a href="#" id="instagramLink">${brand.instagram}</a>`],

    ['<a href="#top" class="wordmark">Eric Samuel <span>Timm</span></a>',
     `<a href="#top" class="wordmark">${brand.footerHtml}</a>`],

    ['<p class="footer-fine">&copy; <span id="year"></span> Eric Samuel Timm. All originals.</p>',
     `<p class="footer-fine">&copy; <span id="year"></span> ${brand.name} — paintings by Eric Samuel Timm.</p>`],
  ];

  for (const [from, to] of subs) {
    must(s, from, `${slug} substitution`);
    s = s.replace(from, to);
  }

  // The wordmark sits after the brush-stroke SVG inside .logo-mark; the root
  // page has no wordmark there, so it's inserted rather than substituted.
  const anchor = `<a href="#top" class="logo-mark" aria-label="${brand.name} — home">`;
  const svgEnd = s.indexOf('</svg>', s.indexOf(anchor));
  const close = s.indexOf('</a>', svgEnd);
  if (svgEnd === -1 || close === -1) throw new Error(`promote: ${slug} — no logo mark to insert a wordmark into`);
  // `close` sits just after the existing newline + 4 spaces of indentation.
  s = s.slice(0, close) + `  <span class="logo-wordmark">${brand.logoHtml}</span>\n    ` + s.slice(close);

  return s;
}

const staging = readFileSync(join(PUBLIC, 'index.html'), 'utf8');
const assets = ['styles.css', 'script.js'];
let drift = 0;

for (const [slug, brand] of Object.entries(brands)) {
  const out = join(PUBLIC, slug, 'index.html');
  const next = render(slug, brand, staging);
  const prev = readFileSync(out, 'utf8');
  if (check) {
    if (prev !== next) { console.error(`  DRIFT  ${slug}/index.html`); drift++; }
    else console.log(`  ok     ${slug}/index.html`);
  } else {
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, next);
    console.log(`  ${prev === next ? 'unchanged' : 'promoted '}  ${slug}/index.html  (${brand.domain})`);
  }
}

for (const a of assets) {
  const from = join(PUBLIC, a);
  const to = join(PUBLIC, 'release', a);
  const next = readFileSync(from, 'utf8');
  let prev = null;
  try { prev = readFileSync(to, 'utf8'); } catch {}
  if (check) {
    if (prev !== next) { console.error(`  DRIFT  release/${a}`); drift++; }
    else console.log(`  ok     release/${a}`);
  } else {
    mkdirSync(dirname(to), { recursive: true });
    writeFileSync(to, next);
    console.log(`  ${prev === next ? 'unchanged' : 'promoted '}  release/${a}`);
  }
}

if (check && drift) {
  console.error(`\n${drift} file(s) differ from what staging would produce — the branded domains are behind.\nRun: npm run promote`);
  process.exit(1);
}
console.log(check ? '\nBranded domains match staging.' : '\nPromoted. Deploy to push it live.');
