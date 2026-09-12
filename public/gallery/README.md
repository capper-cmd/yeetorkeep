# Form & Figure — Painter Portfolio & Shop

Live at `/gallery` on this deployment. A minimal, high-end, single-page
site for a painter who hand-paints portraits of pro athletes. Layout is
based on MotionSites.ai's **"Lumen"** template — a cinematic, minimal,
whitespace-forward portfolio treatment — rebuilt as plain static
HTML/CSS/JS to match this repo's existing pattern (see `/public/ha`,
`/public/dromos`), so there's no build step or framework to install.

## Files
- `index.html` — the whole one-page site (hero, work grid, lifestyle,
  process, commission form, footer)
- `styles.css` — all styling (CSS variables at the top for quick
  re-theming)
- `script.js` — nav scroll state, mobile menu, scroll-reveal animation,
  commission form → mailto handoff
- `images/` — the two supplied reference photos: a tight product crop of
  the Ken Griffey Jr. piece (`griffey-artwork.jpg`), the same piece
  in-room (`griffey-portrait.jpg`, used in the hero), and a collector's
  wall shot (`collector-wall.jpg`, used in the "Collector's Wall" section)

## Placeholders to swap before going live
This was built without the artist's real name, brand, bio, email, or
socials, so the following are intentional placeholders — search and
replace them:

- **Brand name**: "Form & Figure" (wordmark + `<title>`)
- **Email**: `hello@formandfigure.art` (footer, contact section, and the
  mailto handler in `script.js`)
- **Instagram**: `@formandfigure` / `#` link in the contact section
- **Artist bio** paragraph in the "Process" section — currently generic,
  written to be true of the work shown but not any specific real person
- **Pricing / budget ranges** in the commission form — currently rough
  placeholders, not confirmed pricing

## Adding more artwork
The "Selected Work" grid (`#work` in `index.html`) currently shows one
real piece plus two intentionally-empty "coming soon" tiles. To add a
new piece, copy the `.piece` block, drop a new photo in `images/`, and
fill in title / medium / status / price.

## Selling art
The commission form currently opens the visitor's email client with the
inquiry pre-filled (`mailto:`) rather than submitting anywhere — there's
no backend in this repo. That's a deliberate "inquire to purchase" model,
which is standard for one-of-one fine art at this price point (galleries
rarely do instant checkout for originals). If real-time checkout is
wanted instead (e.g. for signed print editions), swap the form action for
a form service (Formspree/Getform) or wire up Stripe Checkout / Shopify
Buy Buttons for the print SKUs.
