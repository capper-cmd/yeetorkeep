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
  canvas/paper") and the **budget ranges** in the commission form are
  both rough placeholders, not confirmed specifics.
- **Artist bio** paragraph in the "Process" section is written to be
  true of the work shown, not a biography — it doesn't draw on his
  public speaking/authorship background, since that wasn't confirmed as
  relevant to this specific painting collection.

## Adding more artwork
The "Selected Work" grid (`#work` in `index.html`) now shows nine real
pieces (two Griffey Jr. paintings, Jordan, Kobe, Gretzky, two Mantle
paintings, Jackie Robinson, and Ohtani). To add a new one, copy a
`.piece` block, drop a new photo in `images/`, and fill in
title / medium / status / price.

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
