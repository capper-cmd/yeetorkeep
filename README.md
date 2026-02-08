# YeetOrKeep Deals - Amazon Affiliate Website

A sleek affiliate website that showcases Amazon alternatives discovered by the YeetOrKeep Bot community. Users submit suspicious Facebook/Instagram ad products, and we find verified Amazon alternatives at better prices.

## 🚀 Quick Start

```bash
cd yeetorkeep-affiliate
npm start
```

Then open http://localhost:3001

## 📁 Project Structure

```
yeetorkeep-affiliate/
├── public/
│   ├── index.html    # Main website
│   ├── styles.css    # Sleek dark theme styles
│   └── app.js        # Product loading logic
├── server.js         # Node.js server with API
├── package.json
└── README.md
```

## 🔗 Integration with YeetOrKeep Bot

The website automatically pulls analyzed products from `../shopping-bot/data/`:
- Reads all `user_*.json` files
- Extracts products with research results
- Displays Amazon alternatives with affiliate links

## 📡 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/products` | Get all analyzed products with alternatives |
| `GET /api/stats` | Get aggregate statistics |

## 🛒 Amazon Associates Setup

### Requirements to Join
1. **Website Requirements:**
   - Public site with original content
   - 10+ social media posts OR 500+ followers
   - Must make 3+ sales in first 180 days

2. **Apply at:** [Amazon Associates Central](https://affiliate-program.amazon.com/)

### After Approval
Edit `public/app.js` and uncomment the affiliate tag code:

```javascript
function createAffiliateLink(url) {
    const AFFILIATE_TAG = 'your-tag-20';  // Your Associates tag
    if (url.includes('amazon.com')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}tag=${AFFILIATE_TAG}`;
    }
    return url;
}
```

### High-Commission Categories (Focus Areas)
| Category | Commission Rate |
|----------|-----------------|
| Luxury Beauty | 10% |
| Amazon Coins | 10% |
| Digital Music/Games | 5% |
| Physical Video Games | 1% |
| Electronics | 4% |
| Home & Kitchen | 3% |

### Bounty Events
Participate in Amazon bounty programs for fixed payouts:
- **Prime Sign-ups:** $3 per new subscription
- **Audible Trials:** $5 per trial
- **Wedding Registry:** Up to $25

## ⚖️ FTC Compliance

The website includes required affiliate disclosures:
1. **Header banner** - Visible on every page
2. **Footer section** - Detailed disclosure explaining the affiliate relationship
3. **Link attributes** - All affiliate links include `rel="noopener sponsored"`

### Required Disclosure Text
> "YeetOrKeep Deals is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com."

## 💰 Payout Options

| Method | Minimum |
|--------|---------|
| Direct Deposit | $10 |
| Amazon Gift Card | $10 |
| Check | $100 |

## 🛠️ Development

### Adding New Products
Products are automatically imported when users analyze items via the Telegram bot. The bot saves research data to `../shopping-bot/data/user_*.json`.

### Customizing Styles
Edit `public/styles.css` - uses CSS custom properties for easy theming:
```css
:root {
    --primary: #6366f1;
    --success: #10b981;
    --danger: #ef4444;
}
```

### Production Deployment
1. Set up a domain (required for Amazon Associates)
2. Deploy to hosting (Vercel, Railway, DigitalOcean)
3. Update CORS settings if needed
4. Apply for Amazon Associates with your live URL

## 📊 Analytics (Future)

Track clicks and conversions:
- Add Amazon's OneLink for mobile optimization
- Use SiteStripe browser extension for quick link creation
- Monitor clicks via Associates Central dashboard

---

**Status:** Ready for deployment. Amazon Associates application pending.
