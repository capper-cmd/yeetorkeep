# Eric Samuel Timm — Painter Portfolio & Shop

Live at `/` (the homepage) on this deployment — it replaced the old
YeetOrKeep affiliate homepage, which is now archived at
`public/_legacy/yeetorkeep-affiliate/` (see the root `README.md`). A
minimal, high-end, single-page site for Eric Samuel Timm, a painter who
hand-paints portraits of pro athletes. Layout is based on MotionSites.ai's
**"Lumen"** template — a cinematic, minimal, whitespace-forward portfolio
treatment — rebuilt as plain static HTML/CSS/JS to match this repo's
existing pattern (see `/public/ha`, `/public/dromos`), so there's no
build step or framework to install.

`/gallery` (this site's original path, before it became the homepage)
redirects to `/` — see `vercel.json`.

## Files
- `index.html` — the whole one-page site (nav, hero, image marquee,
  bottom teaser, work grid, lifestyle, process, commission form, footer)
- `styles.css` — all styling (CSS variables at the top for quick
  re-theming)
- `script.js` — nav scroll state, drawer menu open/close + stagger,
  image-marquee drag physics, scroll-reveal animation, commission form
  → mailto handoff
- `images/` — product shots used in the marquee and "Selected Work" grid:
  `griffey-studio.jpg`, `jordan.jpg`, `kobe.jpg`, `gretzky.jpg`,
  `mantle-1952.jpg`, `ohtani.jpg` are professional flatbed art scans from
  Eric's Dropbox (`card art web/Art Scans/`), cropped tight to the canvas
  — these replaced earlier handheld-photo crops of the same six pieces.
  `mantle-themick.jpg`, `jackie-robinson.jpg`, `griffey-rookie.jpg` are
  still handheld studio-easel photos (no clean scan was available for
  these three) — swap them in if Eric sends scans later, same crop
  treatment. `installed-wall.jpg` (used in "Collector's Wall") is a
  photo from Eric's Dropbox (`card art web/House location 1/`) of four
  framed originals — Mantle, Gretzky, Ohtani, Jordan — hung together in
  a client's home. `collector-wall.jpg` (the original memorabilia-shelf
  photo, no longer referenced in `index.html`) and `griffey-portrait.jpg`
  (the original barn-door hero shot, also no longer referenced) are kept
  in the folder unused, in case either is wanted again.
  `artist-portrait.jpg` (used in "The Process") is unchanged.

  Eric's Dropbox also has two more "House location" folders (single
  paintings rotated through a shelf display and a barn-door wall) and an
  "Original Phots" folder of additional studio shots — not all pulled in
  yet; worth another pass if more variety is wanted later.

## The nav / hero / marquee / bottom-CTA pattern
The top of the page (fixed nav with a two-line hamburger, a full-screen /
right-drawer menu, a centered no-image hero, a draggable auto-scrolling
image marquee with curved white top/bottom masks, then a short two-link
CTA strip) follows a structural spec the client supplied from an
unrelated "Bespoke Architecture Studio" React/Tailwind project. Reused
here: the layout shape and the interaction physics (rAF auto-scroll +
pointer-drag momentum + seamless duplicated-strip loop, the drawer's
staggered link entrance, the hamburger→X morph). Not reused: that
project's stack (this stays plain HTML/CSS/JS, no React/Vite/Tailwind
build step, to match the rest of this repo), its fonts (kept
Fraunces/Inter, not Geist), its literal black/white/no-brass palette
(kept Eric's cream/ink/brass palette), its copy, its logo glyph (swapped
for a small three-stroke brush mark), and its architecture photos
(swapped for nine of Eric's own paintings, duplicated once for the
marquee's seamless loop).

The Selected Work shop grid — the part that actually carries pricing,
availability, and "Inquire" links — was kept as its own section below
the marquee rather than folded into the reference layout, since that
spec was a pure marketing teaser with no shop functionality of its own.

## Still worth confirming with Eric
A couple of details here are reasonable placeholders, not confirmed facts
— worth a real check before this goes live:

- **Email / Instagram**: `hello@ericsamueltimm.com` and
  `@ericsamueltimm` were inferred from his known domain
  (ericsamueltimm.com) — not given directly, so confirm the real
  addresses (footer, contact section, and the mailto handler in
  `script.js`).
- **Existing shop**: a web search turned up an existing storefront at
  `shop.ericsamueltimm.com`. Worth asking whether this page should link
  out to that shop for checkout, replace it, or stay a separate
  portfolio-style landing page feeding inquiries by email.
- **Medium/materials** on each piece (currently "Mixed media on
  canvas/paper") is still a rough placeholder — the pricing PDF (see
  below) didn't specify exact materials per piece.

The **artist bio** placeholder above is resolved — see "Real pricing,
scarcity, and bio" below.

## Adding more artwork
The "Selected Work" grid (`#work` in `index.html`) now shows ten real
pieces (two Griffey Jr. paintings, Jordan, Kobe, Gretzky, two Mantle
paintings, Jackie Robinson, Ohtani, and Tom Brady). To add a new one,
copy a `.piece` block, drop a new photo in `images/`, and fill in
title / medium / status / price — and add a matching `<div
class="marquee-slide">` to both halves of the marquee track (it's
duplicated once for the seamless loop, so a new piece goes in both
copies).

New pieces don't need the same crop treatment: Brady's painting
(`brady.jpg`) is mounted on a shaped wood panel rather than matted like
the trading-card-style pieces, so it was cropped to the panel's own
edge instead of to a canvas/mat boundary — look at the source photo
first to see which applies before cropping a new one.

## Brushwork detail strip (Process section)
`detail-brushwork-1/2/3.jpg` are macro close-ups of paint texture and
canvas grain (helmet, jersey fabric, and a face, from three different
paintings) — shown as a small triptych under the process copy to back
up the "hand-painted, no filters" claim with something a print couldn't
show. They're deliberately generic in the alt text since identifying
the exact painting isn't the point of a texture shot. Swap in different
detail crops any time by replacing those three files (square-ish crops
work best, `.detail-shot` crops to 1:1 with `object-fit: cover`).

## Real pricing, scarcity, and bio
Eric's Dropbox added `card art web/card icon art idea.pdf` with real
per-piece status/pricing and his actual bio + a quote. This replaced
placeholders throughout:

- **Selected Work status pills, prices, and links** now reflect the
  real state from the PDF: Sold (Gretzky, Mantle '52, Jackie Robinson,
  Tom Brady — shown with a desaturated image via `.piece.is-sold`),
  Available at a fixed price (Griffey "The Kid" $5,000, Kobe $4,000,
  Ohtani $5,000, Mantle "The Mick" $3,500, Griffey "'89 Star" $3,500),
  or Available/Make Offer (Jordan — no fixed price given).
- **New "Limited Edition Prints" section** (`#editions`, between
  Selected Work and Collector's Wall, linked from the nav) covers the
  six pieces with a numbered print run: Griffey "The Kid", Jordan,
  Kobe, Gretzky, Ohtani, and Mantle '52. Each has three tiers — Artist
  Proof (always 1/1), Jersey Match (numbered to the player's own
  jersey number — e.g. Gretzky's is 9.9/9.9 for his No. 99, Jordan's
  23/23), and a numbered print run below that. This "numbered to the
  jersey number" detail is Eric's own scarcity mechanic — surfaced as
  the `.edition-sub` line on each card since it's the whole point.
  "Edition 2" (30% price increase, no artist proofs, starts once
  Edition 1 sells out) is called out in the section intro as the
  built-in urgency mechanic — don't undercut it by discounting Edition
  1 elsewhere on the site.
- Pieces with an edition also get a "Prints from $X →" link
  (`.piece-prints-note`) on their Selected Work card, anchored to their
  `#edition-*` card. Sold pieces that still have prints available (Gretzky,
  Mantle '52) get "See Prints →" as their primary link instead of "Inquire".
  Sold pieces with no edition (Robinson, Brady) get "Commission Similar →".
- **Bio and quote** in the Process section are now Eric's real words
  from the PDF (20+ years, 39 countries, the "mirror / window / door"
  quote) — replacing the earlier generic, deliberately-non-biographical
  copy.
- **Commission form budget ranges** updated to match the real spread
  ($200 print minimum up to $5,000+ originals/custom).

If Eric sends an updated version of that PDF (new sold status, a
restock, Edition 2 going live), the pieces to touch are: the relevant
`.piece` status-pill/price/link in `#work`, the matching
`.edition-original` line in `#editions`, and — if editions actually
sell out — the `.editions .section-head` copy, since it currently
promises Edition 1 is still open.

## Selling art
The commission form currently opens the visitor's email client with the
inquiry pre-filled (`mailto:`) rather than submitting anywhere — there's
no backend in this repo. That's a deliberate "inquire to purchase" model,
which is standard for one-of-one fine art at this price point (galleries
rarely do instant checkout for originals). If real-time checkout is
wanted instead (e.g. for signed print editions), swap the form action for
a form service (Formspree/Getform), wire up Stripe Checkout / Shopify Buy
Buttons for the print SKUs, or link out to the existing
shop.ericsamueltimm.com storefront.
