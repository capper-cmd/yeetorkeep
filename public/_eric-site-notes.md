# Eric Samuel Timm — Painter Portfolio & Shop

Live at `/` (the homepage) on this deployment — and `/` on
`yeetorkeep.io` is **staging**, so that's where work-in-progress shows
up for review before `npm run promote` pushes it to the branded
domains (see the root `README.md`) — it replaced the old
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

- **Instagram**: `@ericsamueltimm` is still inferred from his known
  domain, not confirmed. **Email is confirmed**: `eric@ericsamueltimm.com`
  (Eric's call, "for now"), used in the contact section on all four page
  variants and in the mailto handler in `script.js`.
- **Existing shop**: a web search turned up an existing storefront at
  `shop.ericsamueltimm.com`. Worth asking whether this page should link
  out to that shop for checkout, replace it, or stay a separate
  portfolio-style landing page feeding inquiries by email.
- **Existing shop** (above) is still open. **Medium/materials** is
  resolved: Eric confirmed "Wood, Acrylic, Charcoal, Marker, Spray
  Paint", now on all ten pieces. It's applied uniformly — if individual
  pieces actually differ (the Griffey '89 was previously listed as
  paper, Brady as a wood panel), those lines need Eric's per-piece call.

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

## Never crop the artwork

Eric's first review note, twice over: *"a number of images need to be
cropped correct so we can see it all, right now they are all cut off"*
and *"these need to be able to be seen. Rather than cropped."* So the
rule for anything showing a painting is **`object-fit: contain`, not
`cover`**:

- `.piece-frame img` — a 3/4 mat box, art contained inside it. The
  paintings range from ratio 0.68 to 0.84, so no single box fits them
  all; the leftover margin is deliberate and reads as mat board. The
  old hover zoom (`scale(1.045)`) was dropped, since scaling inside a
  fixed frame re-crops the art — the frame now lifts on a shadow instead.
- `.marquee-slide img` — contained, and inset *less* than the arc's
  overlap so the curve cuts through the white frame and into the
  painting's own colour. That is deliberate: the client wants the strip
  to read as circulating past the viewer, and the arc only sells that
  if it hits paint rather than stopping at a clean margin. It is the one
  place on the site where artwork is allowed to be covered — the grid,
  the editions and the scale band all still show every piece whole. Two tunables on `.marquee-section` drive the whole thing:
  `--mask-h` (96px desktop / 56px mobile) is how deep the arc's tip
  reaches, and `--curve-overlap` (48px / 28px) is how far that tip
  crosses each card's top and bottom edge. The cards are inset by
  `--mask-h - --curve-overlap`, and the image padding is
  `--curve-overlap + 2px` — derived, not hard-coded, so raising the
  overlap can't quietly start clipping artwork.

  Three vars on `.marquee-section` drive it: `--mask-h` (how far the arc
  travels), `--curve-overlap` (how far its tip crosses each card's edge)
  and `--art-inset` (the white frame before the painting starts). Cards
  sit at `--mask-h - --curve-overlap`; the bite into paint is
  `--curve-overlap - --art-inset`. Currently 150 / 96 / 8 on desktop and
  78 / 52 / 6 on mobile.

  **How deep the arc can go is set by Ohtani, and it is solved, not
  eyeballed.** His cap sits 4.5% down his card — higher than any other
  face in the strip — so if the arc clears his hairline every face is
  safe. The arc's deepest point is `--mask-h`; his hairline sits at
  `(--mask-h - --curve-overlap) + --art-inset + slack + 0.045 x art
  height`. They meet when `--curve-overlap = --art-inset + slack +
  head`. Slack comes from the slide height, so the heights are derived:
  a taller slide starts the art lower and buys a deeper arc. And
  `--curve-overlap` has to stay above `--mask-h / 2` or the arc stops
  touching the cards at the far left and right.

  Current desktop: mask 120, overlap 66, inset 8, slide 439 — verified
  in the browser at hairline y = 120 against arc depth 120. Mobile:
  80 / 46 / 6 / 298. `scripts/` has no helper for this; re-derive with
  the three relations above if the slide width, inset or his crop
  changes, and re-measure the 4.5% if `ohtani-marquee.jpg` is recropped.

  Because the arc reaches its full depth only at the exact centre and
  half that at the edges, the overlap has to *exceed* half the mask
  height before the curve touches the cards near the left and right of
  the strip at all. At exactly half it is tangent there — visually it
  looks like it misses. 58px against a 96px mask puts it 10px over at
  the sides and 58px over at the centre.

  Three dead ends worth not repeating. Flattening the arcs to 50px
  bought clearance by destroying the curve, which is the whole point of
  the section. A small overlap (4-14px) is effectively invisible for the
  reason above. And `.marquee-track` used to carry its own
  `padding: 24px 0`, which silently pushed the cards 24px below where
  the section's padding put them — so the arc missed them everywhere
  except dead centre no matter what the overlap was set to. The track's
  vertical padding is now 0 and `.marquee-section` is the single source
  of truth for that inset; don't reintroduce a second one.
- `.edition-thumb img` — contained, and `align-self: flex-start` so the
  thumb keeps its ratio instead of stretching to the card's height
  (a stretched box + contain = the art floating in dead space).

**One deliberate exception: `ohtani-marquee.jpg`.** Ohtani's painting is
the widest of the set (ratio 0.837 against the others' ~0.70), so in the
tall marquee slide it letterboxed and shrank — and because his is the
only full-figure batting pose rather than a head-and-shoulders portrait,
his face ended up tiny next to every card beside it. The marquee now
uses a copy trimmed 48px from each side (8% total, centred so both the
"MAJOR LEAGUE" and "BUBBLE GUM" nameplates survive), which fills the
slide at the same scale as its neighbours. The Selected Work grid and
the edition card still use the full uncropped `ohtani.jpg` — the
no-cropping rule holds where the piece is actually being sold; the
marquee is a teaser. If another piece ever reads small in the strip,
this is the pattern: a `-marquee` crop in `assets/originals/`, never a
change to the shared CSS.

Photographs of *rooms* are the exception and still use `cover`:
`.installed-item img`, `.lifestyle-media img`, `.detail-shot` (macro
texture crops), `.about-portrait img`. There the room is the subject.

## In-situ shots (the `.installed` row)
Eric: *"we need to have a few more spots where the art is shown on the
wall or home... this kind of stuff really sells it."* Three shots under
the Collector's Wall split, one per location in the Dropbox:
`installed-solo.jpg` (House location 1 / IMG_9165 — Mantle in a wide
white frame), `installed-door.jpg` (House Location 2 / IMG_9179 —
Griffey beside a sliding barn door), `installed-ledge.jpg` (House
Lcoation 3 / IMG_9185 — Gretzky on a picture ledge with a signed
jersey). Cropped 4:5 with `ImageOps.exif_transpose` applied first —
these are iPhone shots and carry EXIF orientation.

There are ~19 more in those three folders if the row should grow or
rotate; the contact sheet is worth regenerating before picking, since
most are the same wall with a different painting swapped in.

## Still open from Eric's review
- **sport vs sports** in the domain/brand name — his open question.
- **Original dimensions in inches** — he's adding them to the Dropbox
  master. They'd go on the `.piece-meta` line next to the medium.
- **Copy pass** — he offered to rewrite the copy himself.

## Watermarks
Every image the site serves is watermarked — a tiled
`© ERIC SAMUEL TIMM` at ~10% opacity, running bottom-left to top-right,
with a dark pass under a light one so it reads over both pale mat board
and near-black studio photos. Weighted to vanish at grid size and be
unmistakable at full resolution.

Pristine originals live in `assets/originals/` (not deployed);
`python3 scripts/watermark.py` regenerates `public/images/` from them,
so re-running never double-stamps. Details and the reason it covers the
branded domains too are in the root `README.md`.

When Eric sends new artwork, the original goes in `assets/originals/`
and the script stamps it — don't drop an unwatermarked file straight
into `public/images/`.

## Low-resolution serving
yeetorkeep.io serves `images/lowres/` — the same watermarked images
capped at 900px on the long edge (about 2x3 inches at 300dpi, so not
reproducible). The branded domains still serve the full-size set, so
the two can be compared. `installed-wall.jpg` is exempted up to 1800px
because the Collector's Wall split shows it half-viewport wide and the
cap visibly upscaled it.

Downscaling is what actually protects the work; the watermark only
deters. While both sets are live the full-size files are still
reachable at `/images/<name>.jpg`, so this is a preview of the look
rather than protection — that needs `public/images/` capped too.

## Eric's copy pass (web copy master.pdf)
Eric replaced `card icon art idea.pdf` in the Dropbox with `web copy
master.pdf` / `.pages`. It carries the original dimensions he owed us,
three new piece titles, and a rewrite of most of the page copy. Pricing
is unchanged — every number still matches what's live.

Dimensions now lead the `.piece-meta` line (materials moved to a
quieter `.piece-materials` line beneath), because the originals run
four to five feet and that is the fact a buyer needs first — it also
makes the 16x20 prints read as a different product rather than a
cheaper one.

| Piece | Size |
|---|---|
| Mantle '52, Griffey "The Kid" | 45" x 64" |
| Griffey '89 Star, Mantle "The Mick" | 41" x 58.5" |
| Jordan, Brady, Gretzky, Kobe | 42" x 60" |
| Ohtani Goudey, Jackie Robinson | 49" x 58" |

### Assumptions made — check these with Eric
His document left real ambiguities. Rather than block, these calls were
made and should be confirmed:

1. **The quote appears twice, worded differently.** Used the version
   from his "Web copy" section (the one headed for the site), not the
   one in his "Bio" section. Changed "invites my viewers inspiration"
   to "invites my viewers *toward* inspiration" — one word, to fix the
   grammar without touching his meaning.
2. **Typos fixed:** "LIMTED EDITIONS" -> "Limited Editions"; "it is
   just speaks beauty, class and iconic success" -> "it just speaks
   beauty, class, and iconic success."
3. **"The Mick 89 Star — $3500"** in his Originals list reads as two
   entries merged — his own dimensions list keeps them separate, and
   the site sells them as two pieces at $3,500 each. Left as two.
4. **"hand-built frames"** in the new teaser copy is kept verbatim.
   Unclear whether he means he builds the physical frames or paints the
   card frames; either reading is his claim to make, so it wasn't
   altered.
5. **"THE ORIGINAL COLLECTION"** became the section `<h2>`, and the
   eyebrow above it changed from "The Collection" to "Originals" so the
   two don't say the same thing twice.
6. **"Goudy"** in his document is spelled "Goudey" on the site — the
   actual card brand. Kept the site's spelling.
7. His bio says the work is rebuilt "in acrylic, ink and effort" while
   the medium line reads "Wood, acrylic, charcoal, marker, spray
   paint", and his hero says "Every canvas starts..." while the pieces
   are on wood. Both are his own words in his own document, so they
   stand — but they contradict each other if read side by side. The
   Process detail-strip caption still says "raw canvas grain" for the
   same reason.

## Eric's answers (15 Sep) — prints vs originals
He confirmed the rule: **if it is framed like a print, it is a print.**
That covers every in-situ shot on the page — the four-piece wall beside
the kitchen included — so all of those now say "print" in their alt text
and captions. They had briefly said "original", which was wrong.

He also confirmed the originals are large. Note he wrote "all originals
are big 45*64" as shorthand for the scale, not as a correction to the
per-piece list in `web copy master.pdf` — the site keeps his specific
per-piece dimensions (45x64, 41x58.5, 42x60, 49x58), which are more
precise than one flat number. Worth a second confirmation if it matters.

Two images approved and added:
- `brady.jpg` is now IMG_7974, a clean straight-on shot, replacing the
  handheld one. Same crop treatment: to the wood panel's own edge.
- `booth.jpg` (IMG_6918) is new — five originals standing at full height
  on a lit display wall. It drives the new `.scale` band directly under
  the collection, because "45in x 64in" on a card means nothing without
  something to measure against. Cropped above the table graphics so no
  logo or wordmark is clipped; exempted to 1800px in
  `DISPLAY_OVERRIDES` since it runs full width.

This also resolves a tension worth remembering: the in-situ row sells
the **prints**, and the scale band sells the **originals**. Keep those
straight in any future copy — a 16x20 framed print and a 45x64 original
are not the same product.

## Per-piece detail close-ups — tried and removed
Thumbnails of each piece's close-ups were added under the painting in
Selected Work and then taken out: the client didn't want them there, and
the texture strip in the Process section already covers that ground.
**Don't re-add them per piece without asking.**

The crops survive in `assets/unused/` — deliberately outside
`assets/originals/`, since `scripts/watermark.py` globs that folder and
would otherwise keep regenerating them into `public/images/` where they
would ship unused. (`--check` reports served files with no original, so
it catches that class of leftover.) To bring them back, move them into
`assets/originals/` and re-run the script.

| Piece | Close-ups | From |
|---|---|---|
| Wayne Gretzky | helmet/face, Oilers crest | IMG_6449, IMG_6451 |
| Shohei Ohtani | face/helmet, Major League nameplate | IMG_6759, IMG_6754 |
| Tom Brady | the hand-built card frame | IMG_7977 |
| Ken Griffey Jr. '89 Star | the panel seen edge-on | IMG_6327 |

**"Hand-built frames" is settled.** In Eric's copy that phrase means the
*painted card frame* he builds around each portrait — the striped,
gilded border you can see in `detail-brady-1.jpg` — not physical framing
for prints. The caption on that piece says so directly. Don't rewrite it
to sound like framing services.

### Still open
- Two close-ups could not be matched to a piece: **IMG_6656** (grey,
  monochrome, an ear against a faint city skyline) and **IMG_6658** (a
  smiling face in warm browns). Neither matches any of the ten paintings
  confidently — 6656 in particular may be from work that isn't on the
  site. Ask Eric before using them.
- Six pieces have no close-up yet: Griffey "The Kid", Jordan, Kobe,
  Mantle "The Mick", Jackie Robinson, Mantle '52. Worth asking Eric for
  one or two each if he wants full coverage.
- Eric removed `IMG_7983` and `IMG_7986` from that Dropbox folder on
  15 Sep. Our copies survive as `detail-brushwork-*.jpg` in
  `assets/originals/`, which is the only reason the Process strip still
  works — another reason never to treat Dropbox as the backup.

## Selected Work now uses Eric's photographs of the originals
All ten pieces in the grid (and the marquee, and the edition thumbnails,
which share the same files) come from Eric's Dropbox `Original Photos`
folder — photographs of the actual paintings — replacing the six
professional captures that were used before.

Worth recording, because it argues the other way: there are exactly six
professional captures and they match exactly the six pieces that have
print editions. Those captures were almost certainly made *in order to
produce the prints*, which means they are high-quality reproductions of
the originals rather than images of the prints. They are brighter,
cleaner and evenly lit; the photographs are underexposed, carry the
room's warm cast, and vignette into the corners. The client chose the
photographs anyway, as shot, with no correction.

`/fix` serves the same page from a colour-corrected copy of the same
photographs so the two can be compared live. The correction is a
per-channel percentile stretch in `scripts/watermark.py` — it pulls out
the cast and recovers exposure without inventing colour, and it cannot
fix the vignette, which is lighting rather than grading. The corrected
set is a third variant of the image pipeline, so it regenerates with
everything else.

`public/fix/index.html` is generated by `scripts/build-fix-page.mjs`
from `public/index.html`. **Re-run it after any change to the root
page**, or `/fix` quietly stops being a copy of the thing it exists to
be compared against.

Note Ohtani's cap moved from 4.5% to 7.1% down his card in the new
photograph. The marquee arc is solved against that number (see the
watermark section above); it was left at the more conservative setting,
so there is now spare headroom if the arc should ever sweep deeper.

## Prints vs originals: which image goes where
- **Selected Work / marquee** — Eric's photographs of the originals, from
  Dropbox `Original Photos`, used at **full frame with no trim**. An
  earlier pass shaved 1.8% off each edge and that cut into the painted
  borders, so the whole photo goes in, dark surround and all. That
  surround is wanted: it shows where the painting ends.
- **Limited Edition Prints** — photographs of the *framed prints* from
  Dropbox `Print Acutal Photos Framed` (`print-<piece>.jpg`), not the
  artwork files. The section sells prints, so it should show prints as
  they arrive: matted and framed.

Three of the six framed prints are in **black** frames (Gretzky, Kobe,
Ohtani); only Griffey, Jordan and Mantle are white. All six have a white
mat. If consistency matters, those three need reshooting in white — the
photos don't exist yet.

Jordan and Kobe are deliberately **not adjacent** in either grid: both
are near-identical dunk compositions and read as repetitive side by
side. Kobe and Gretzky are swapped in both the work grid and the
editions grid to break that up. The `reveal-delay-*` stagger is
positional, so it is reassigned after any reorder rather than travelling
with the card.

## The Process quote, and the signature that goes under it
The blockquote is now Eric's first-person line: *"I start every canvas
with a single frame — the swing, the stance, the knockout, your vision —
and the moment becomes an original painting built to outlast the
highlight reel to inspire you."* It replaced the mirror/window/door
quote.

`<p class="signature">— Eric Samuel Timm</p>` sits directly beneath it.
Eric is putting a signature image in the Dropbox to go there; when it
lands, drop it in `assets/originals/signature.png` (keep the alpha — the
watermark pipeline is JPEG-only, so a transparent signature needs to
bypass `scripts/watermark.py` and be copied straight into
`public/images/`), then swap the typed attribution for the image.

**Flagged, unresolved:** the same idea is now on the page three times.
The hero lede is almost word-for-word the new quote, in third person
("Every canvas starts with a single frame — the swing, the stance, the
knockout — and becomes an original painting built to outlast the
highlight reel and inspire you"), and the bio paragraph *directly above
the quote* opens "Each portrait begins the same way — pulling a single
frame...". Two of the three are adjacent. All three are Eric's own
words, so none were changed; it needs his call on which survives.

## Signature, and the nine texture icons
`assets/originals/signature.png` is Eric's real signature, black on
transparent, sitting under the Process quote in place of the typed
"— Eric Samuel Timm". It is height-capped (46px) rather than
width-capped: it is a very wide, short mark and a width rule makes it
tower on narrow screens. It reaches `public/images/` through the PNG
passthrough in `scripts/watermark.py` — **never route it through the
stamper**, which is JPEG-only and would flatten the alpha into a white
box on the cream.

The Process texture strip went from three icons to **nine**, at Eric's
request ("nine little zoomed in icons that kinda sell the art"). Six of
them are the per-piece crops that were built, removed from under the
paintings, and parked in `assets/unused/` — they are back in
`assets/originals/` now and serve the purpose Eric actually wanted, as
a texture wall rather than per-piece thumbnails. `assets/unused/` is
gone.

The caption widened with the set: it used to say "acrylic, ink, and raw
canvas grain", which no longer covers the Brady frame edge or the
Griffey panel seen edge-on, and "canvas" contradicts the wood medium
anyway.

`brady.jpg` is now `Original Photos/IMG_7974.jpeg` — note the **.jpeg**
extension, a different and later file than the `IMG_7974.jpg` sitting
beside it. It is smaller (950x1280 against 1400x1887) but has the
contrast and the gold frame edge the earlier one lost.

## sportslegendsart.com is the live site as of 16 Sep
Promoted staging to the branded domains, so `sportslegendsart.com` now
carries everything: the photographs of the originals at full frame, the
dimensions, Eric's rewritten copy, the signature, the nine texture
icons, the scale band, the framed-print thumbnails, the deep marquee arc
and the Jordan/Kobe separation.

**yeetorkeep.io stays staging.** That is the point of the split — new
work lands there first and only reaches the branded domains on the next
`npm run promote`. `/fix` is still the colour-corrected comparison of
whatever staging is currently showing.

Note the promote updated **all three** branded domains, not just
sportslegendsart.com — `sportslegends.art` and `sportlegendsart.com` now
show the same current site under their own wordmarks. The branding
comparison they existed for is settled, so they are redundant; nothing
points at them and no decision has been made about redirecting them to
the winner or letting them lapse.

It also did the thing flagged when the pipeline was built: the
per-domain `hello@<domain>` contact addresses those pages used to carry
are gone, replaced by `eric@ericsamueltimm.com` on all three. That was
Eric's call and is now live.

## Dark bottom teaser (staging only, 16 Sep)
The teaser under the marquee is on `var(--ink)` with cream text, echoing
the Collector's Wall panel further down.

The part that made it work: **the marquee's bottom arc had to be filled
ink too**. `.mask-fill` is cream for both arcs, so darkening only the
section below left a hard cream-to-black horizontal seam right under the
cards. `.marquee-mask-bottom .mask-fill` is now `var(--ink)`, so the
black sweeps up in a curve and the paintings appear to rise out of it.
Any future section colour change under the marquee needs the same
treatment — the arc has to carry the colour of whatever it sweeps into.

**This is on staging only.** `promote:check` reports one file behind by
design; `sportslegendsart.com` is unaffected until someone promotes.

## Grid tail, waitlist bar, detail strip (staging only, 16 Sep)
Three asks in one pass, all on yeetorkeep.

**"Who's next?" card.** The originals grid ran 10 pieces into a 3-column
layout, leaving two dead cells beside Brady. An 11th card fills the first
one: a dashed frame, brass eyebrow, linking to `#contact`. It is not a
loose box — `.piece-next-frame` mirrors `.piece-frame` exactly (same 14px
mat, an inner `.piece-next-inner` at the same 3/4 ratio) so its top and
bottom line up with the paintings beside it to the pixel. Measured: both
frames 329x429 at the same y. If the piece count ever changes so the grid
fills evenly, this card should move or the row will look crowded.

**Teaser text centred to the arc.** "Center to the arc" means centred
against the black shape *including* the curve's deepest point, not against
the section box. The arc reaches full `--mask-h` only at dead centre,
which is where the text is, so the top reference is
`teaser.top - var(--mask-h)`. That is why `--mask-h` lives on `:root` —
`.bottom-teaser` needs it for its own padding:
`padding: var(--teaser-pad) 0 calc(var(--mask-h) + var(--teaser-pad))`.
Measured 140/140 desktop, 92/92 mobile.

**Waitlist on a black bar.** It used to float in cream inside `#work`,
with a large gap before the booth photo — it read as unattached to
anything. It is now its own `.work-more` section on `var(--ink)`, and
`.scale` lost its top padding so the photo butts flush against the bar.
The bar anchors the CTA to the picture it is selling.

**Detail strip.** Eric's nine zoomed-in icons were crowded under the
signature at the tail of the Process column. They now have their own
full-bleed `.detail-strip` on `var(--ink)`, with the tiles switched to
translucent cream borders since the old `var(--line)` was invisible on
black. `.about` gained bottom padding to replace the spacing the strip
used to provide.

**This is on staging only.** `sportslegendsart.com` is unaffected until
someone promotes.

## Brady was running at half resolution (17 Sep)
Eric flagged the Brady original as "the wrong Brady". It is not a
different painting — IMG_7974 in `Original Photos` is the only Brady in
the Dropbox, and it is the same frame the site was already showing
(mean pixel difference 3.5/255 after rescaling, i.e. identical).

What *was* wrong: `assets/originals/brady.jpg` held a 950x1280 copy —
the version pasted into chat — while Dropbox has the real 2040x2750
file. Every other original sources at roughly 1900px tall, so Brady was
the one soft image in the grid. The pipeline source is now IMG_7974 at
full size.

The remaining complaint is likely the photograph itself, not the file:
Brady is a dim room shot with the canvas propped against a dark wall and
the white jersey pushed to grey, where the other nine are flat, evenly
lit captures. No amount of resampling fixes that — it needs a reshoot to
match the rest of the set. `/fix` shows how far colour correction gets
it, which is some of the way but not all.

## Marquee: eight paintings, and the loop now sizes itself (17 Sep)
Eric asked for Kobe and "The Mick" out of the top scroll. Both are still
in the originals grid and the print editions below, so nothing is lost
from the site.

Dropping to eight exposed a bug in how the loop was built. The old code
wrapped on `track.scrollWidth / 2` and relied on the markup carrying a
hand-duplicated second half. That only looks seamless while
`total >= period + viewport`. Eight paintings made one set 2378px, so a
2560px monitor showed a blank wedge at the wrap. Ten paintings would
have done the same thing on a 4K display -- the bug was already there,
just not yet visible.

The markup now carries **one** set, and `script.js` clones it until the
strip is wide enough, wrapping on the measured set width. Verified with
no gap at 390 / 1440 / 2560 / 3840px by sampling 60 offsets across a
full cycle. Add or remove paintings freely; do not re-introduce a
duplicated half in the HTML.
