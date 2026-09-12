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

## Project structure

```
public/
├── index.html, styles.css, script.js, images/   # Eric Samuel Timm (homepage)
├── ha/                                           # Helm & Able
├── dromos/                                       # Dromos Discipleship
└── _legacy/
    └── yeetorkeep-affiliate/                     # original YeetOrKeep Deals affiliate site (retired from homepage, kept for reference)
api/
└── products.js                                   # serverless function for the legacy affiliate site's /api/products
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
