#!/usr/bin/env node
/**
 * Build /fix — the same page as the root, served from the colour-corrected
 * image set, so the two can be compared live rather than through screenshots.
 *
 * Generated from public/index.html the way the branded pages are generated:
 * relative asset paths become absolute (the page sits one directory down) and
 * images/lowres/ is swapped for images/fix/. Re-run after any change to
 * public/index.html, or /fix silently falls behind the page it is meant to
 * be a copy of.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'public', 'index.html');
const OUT = join(ROOT, 'public', 'fix', 'index.html');

let s = readFileSync(SRC, 'utf8');

const must = (needle) => {
  if (!s.includes(needle)) throw new Error(`build-fix-page: missing ${needle}`);
};
must('"styles.css"'); must('"script.js"'); must('"images/lowres/');

s = s.replaceAll('"images/lowres/', '"/images/fix/');
s = s.replace('"styles.css"', '"/styles.css"');
s = s.replace('"script.js"', '"/script.js"');
s = s.replace(
  '<!-- Built from a MotionSites.ai "Lumen" layout, then updated with a',
  '<!-- GENERATED FILE — do not edit by hand. Built by scripts/build-fix-page.mjs\n' +
  '     from public/index.html. This is /fix: the same page served from the\n' +
  '     colour-corrected image set, for comparison against the root.\n\n' +
  '     Built from a MotionSites.ai "Lumen" layout, then updated with a');

const banner = `<div style="background:#171511;color:#faf7f2;font:500 12px/1.5 Inter,system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;text-align:center;padding:9px 16px;">
  Colour-corrected comparison &middot; <a href="/" style="color:#d8b978;">see the originals as shot &rarr;</a>
</div>
`;
s = s.replace('<body>', '<body>\n' + banner);
if (!s.includes('Colour-corrected comparison')) {
  // the root page may not carry a literal <body> tag; fall back to the nav
  throw new Error('build-fix-page: could not place the comparison banner');
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, s);
console.log(`  built public/fix/index.html  (${(s.match(/\/images\/fix\//g) || []).length} corrected image refs)`);
