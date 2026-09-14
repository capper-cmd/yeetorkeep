# yeetorkeep.io

This repo hosts several independent, unrelated client sites, each served
from its own path. There's no shared build step — every project is
plain static HTML/CSS/JS served from `public/`, via `server.js` locally
or Vercel in production (see `vercel.json` for routing).

## Quick Start

```bash
npm start
```

Then open http://localhost:3001

## What's live where

| Path | Project |
|---|---|
| `/` | **Eric Samuel Timm** — painter portfolio & shop (hand-painted portraits of pro athletes). This is the current homepage. |
| `/ha` | Helm & Able — password-gated preview |
| `/dromos` | Dromos Discipleship Path brief |
| `/gallery` | Redirects to `/` (Eric's site's old path before it became the homepage) |
| `/sportslegendsart` | Branding variant: same site, rebranded "Sports Legends Art" — also served at the root of `sportslegendsart.com` |
| `/sportslegends` | Branding variant: same site, rebranded "Sports Legends" — also served at the root of `sportslegends.art` |
| `/sportlegendsart` | Branding variant: same site, rebranded "Sport Legends Art" (singular) — also served at the root of `sportlegendsart.com` |

## Staging vs. the branded domains

**`yeetorkeep.io` is staging.** It serves `public/index.html` and the
working `styles.css` / `script.js` directly, so every deploy changes it.
That's the URL to send someone for review.

**The branded domains are the approved build.** They serve generated
pages that reference `public/release/styles.css` and
`public/release/script.js` — a frozen snapshot — so they don't move
when staging does.

```
edit public/index.html, styles.css, script.js   ->  shows on yeetorkeep.io
npm run promote                                 ->  shows on the branded domains
```

`npm run promote` does both halves of that together: it snapshots
staging's CSS/JS into `public/release/`, and regenerates each branded
page from `public/index.html` with that domain's name substituted in
(see `scripts/brands.json`). `npm run promote:check` verifies the two
are in sync without writing anything, and exits non-zero if the branded
domains are behind.

**Right now the branded domains are deliberately behind**, and
`promote:check` reports drift because of it — that's the system working,
not a fault. They sit at the state from commit `b604891`: the artwork
still crops, the medium still reads "Mixed media on canvas", there's no
in-situ row, and each one keeps its own `hello@<domain>` contact
address. Everything from Eric's review lives on staging only, until
someone decides to promote it.

Note what promoting will change beyond the obvious: the generator uses a
single contact address for every branded page (Eric's call —
`eric@ericsamueltimm.com`), so the per-domain `hello@` addresses those
pages currently show disappear on the next promote.

**Don't hand-edit `public/sportslegendsart/index.html` or its siblings**
— the next promote overwrites them from staging. Content changes go in
`public/index.html`. (They're currently checked out from `b604891`
rather than generated, so they don't match what the generator would
produce — see above.)

To roll the branded domains back to some earlier commit again, restore
those three pages and the two release assets from that ref and re-point
the pages' CSS/JS at `/release/`:

```bash
git checkout <ref> -- public/sportslegendsart/index.html public/sportslegends/index.html public/sportlegendsart/index.html
for v in sportslegendsart sportslegends sportlegendsart; do
  sed -i 's|href="/styles\.css"|href="/release/styles.css"|; s|src="/script\.js"|src="/release/script.js"|' public/$v/index.html
done
git show <ref>:public/styles.css > public/release/styles.css
git show <ref>:public/script.js  > public/release/script.js
```

**One leak to know about:** `public/images/` is shared, not snapshotted.
Adding an image is safe (the frozen pages don't reference it yet), but
*replacing* one in place changes the branded domains immediately. To
re-crop something without promoting, save it under a new filename.
(The watermark below is deliberately pushed through that leak — see
why.)

## Per-domain branding (host-based routing)

This project is attached to several domains, and **which domain you
arrive on changes what `/` serves**:

| Domain | Serves | Tracks |
|---|---|---|
| `yeetorkeep.io` | `public/index.html` — "Eric Samuel Timm" branding | staging (current) |
| `sportslegendsart.com` | `public/sportslegendsart/index.html` — "Sports Legends Art" | `b604891` |
| `sportslegends.art` | `public/sportslegends/index.html` — "Sports Legends" | `b604891` |
| `sportlegendsart.com` | `public/sportlegendsart/index.html` — "Sport Legends Art" (singular) | `b604891` |

(`www.` variants of each behave identically.)

This is done with host-conditioned entries at the top of `routes` in
`vercel.json`, using `"has": [{ "type": "host", "value": "..." }]`.
Two things to know before editing them:

- **`vercel dev` ignores `has`** and prints a warning saying so, so
  these rules cannot be tested locally — only against a real
  deployment. Verify on a preview deploy or after promoting.
- **The failure mode is inert, not broken.** If a host rule stops
  matching, the request falls through to the existing catch-all and
  serves `public/index.html` — the same thing every domain showed
  before this was added. A misconfigured host rule shows the wrong
  branding; it doesn't take a site down.

The branding variants share the root site's `images/` by absolute path
rather than duplicating them. Their CSS and JS come from
`public/release/` instead — see "Staging vs. the branded domains" above
for why.

## Watermarking

Every image in `public/images/` carries a tiled
`© ERIC SAMUEL TIMM` watermark, baked into the JPEG. It's weighted so it
disappears at the size the grid renders and is unmistakable at full
resolution — which is the size worth stealing.

```
assets/originals/          pristine, never deployed (.vercelignore)
     |  python3 scripts/watermark.py
     +-> public/images/           watermarked, full size  -> branded domains
     +-> public/images/lowres/    watermarked, <= 900px   -> yeetorkeep.io
```

**Downscaling is the actual protection; the watermark only deters.** At
900px on the long edge a piece prints to about 2x3 inches at 300dpi —
not enough pixels to reproduce a 16x20 painting at any size worth
having. It's also 2.9MB of images instead of 7.5MB.

Staging is on the low-res set and the branded domains are still on the
full-size one, so the two can be compared side by side. Once low-res
wins, `public/images/` should be regenerated at the cap too and the
override list revisited — until then the full-size files are still
reachable at `/images/<name>.jpg`, so the low-res set is a preview of
the look, not yet real protection.

A few images are displayed much larger than the rest and would be
upscaled by the shared cap — soft, with the watermark growing to match.
`DISPLAY_OVERRIDES` in the script raises the cap for those by filename.
Right now that's just `installed-wall.jpg`, which spans half the
viewport in the Collector's Wall split; it's a room photo rather than
artwork, so the protection given up is small. Add to that list if a new
image is ever shown full-bleed.

The script always reads from `assets/originals/`, so **re-running never
double-stamps**. To change the text, angle, opacity or density, edit the
constants at the top of `scripts/watermark.py` and run it again.
`--check` reports coverage without writing, and flags any served image
that has no original behind it (those would be silently unstamped).

**This covers all four domains, not just staging — on purpose.** A
watermark is only worth anything if the clean file isn't sitting one URL
away on the same host. Watermarking staging alone would have left every
original reachable at `/images/<name>.jpg` from any domain, so this is
the one change that intentionally crosses the staging boundary. It
changes the pixels the branded domains serve; it does not touch their
layout, copy or branding, which stay reverted.

Never commit an unwatermarked file into `public/images/` — put it in
`assets/originals/` and run the script.

## Project structure

```
public/
├── index.html, styles.css, script.js, images/   # Eric Samuel Timm — STAGING (yeetorkeep.io)
├── release/styles.css, release/script.js        # frozen snapshot the branded domains serve
├── sportslegendsart/, sportslegends/, sportlegendsart/   # GENERATED by scripts/promote.mjs
├── ha/                                           # Helm & Able
├── dromos/                                       # Dromos Discipleship
└── _legacy/
    └── yeetorkeep-affiliate/                     # original YeetOrKeep Deals affiliate site (retired from homepage, kept for reference)
api/
└── products.js                                   # serverless function for the legacy affiliate site's /api/products
assets/
└── originals/       # pristine unwatermarked images — NOT deployed (.vercelignore)
scripts/
├── promote.mjs      # staging -> branded domains (see above); --check verifies sync
├── brands.json      # the per-domain name substitutions promote.mjs applies
└── watermark.py     # assets/originals/ -> public/images/{,lowres/}, stamped; --check verifies coverage
server.js            # local static file server (mirrors vercel.json's routing for the common cases)
vercel.json          # production routing — source of truth for how paths map to files
```

## Eric Samuel Timm site (homepage)

See `public/_eric-site-notes.md` for build notes: what's a placeholder
(contact info, exact medium/materials, budget ranges) vs. confirmed, how
the "Selected Work" grid is structured, and how the nav/hero/marquee
interaction pattern was put together.

## Legacy: YeetOrKeep Deals (Amazon affiliate site)

This repo's original purpose — a sleek affiliate site showcasing Amazon
alternatives discovered by the YeetOrKeep Bot community — has been moved
out of the homepage slot to `public/_legacy/yeetorkeep-affiliate/` and is
no longer routed to from `vercel.json`. The code (and the notes below)
are kept for reference; nothing was deleted, just relocated. To bring it
back as the homepage, swap the file locations back and restore the old
`vercel.json` catch-all route.

<details>
<summary>Original affiliate site docs (click to expand)</summary>

### Integration with YeetOrKeep Bot
The site automatically pulled analyzed products from `../shopping-bot/data/`:
- Reads all `user_*.json` files
- Extracts products with research results
- Displays Amazon alternatives with affiliate links

### API Endpoints
| Endpoint | Description |
|----------|-------------|
| `GET /api/products` | Get all analyzed products with alternatives |
| `GET /api/stats` | Get aggregate statistics |

### Amazon Associates Setup
1. **Website Requirements:** public site with original content, 10+ social posts or 500+ followers, 3+ sales in first 180 days
2. **Apply at:** [Amazon Associates Central](https://affiliate-program.amazon.com/)

Edit `public/_legacy/yeetorkeep-affiliate/app.js` and uncomment the affiliate tag code:
```javascript
function createAffiliateLink(url) {
    const AFFILIATE_TAG = 'your-tag-20';
    if (url.includes('amazon.com')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}tag=${AFFILIATE_TAG}`;
    }
    return url;
}
```

### FTC Compliance
The site includes required affiliate disclosures (header banner, footer
section, `rel="noopener sponsored"` on links) and this required
disclosure text:
> "YeetOrKeep Deals is a participant in the Amazon Services LLC
> Associates Program, an affiliate advertising program designed to
> provide a means for sites to earn advertising fees by advertising and
> linking to Amazon.com."

</details>
