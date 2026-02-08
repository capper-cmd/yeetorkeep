// Vercel Serverless Function - Get Products
// Note: In production, this would pull from a database
// For now, returns sample data (bot data is local only)

export default function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // Sample products (in production, pull from database/API)
    const products = [
        {
            id: 1,
            title: "Ultrasonic Retainer Cleaner - $99",
            verdict: "suspect",
            originalPrice: "$99",
            summary: "Domain is only 2.5 months old yet claims 52,000 customers; massive markup over identical Amazon alternatives.",
            alternatives: [
                {
                    name: "CXRUY Ultrasonic Retainer Cleaner UV 45kHz",
                    url: "https://amazon.com/dp/B0DHNKQWLC",
                    price: "$29.98",
                    perUnit: "$29.98/unit"
                },
                {
                    name: "Dental Ultrasonic Retainer Cleaner 45kHz",
                    url: "https://amazon.com/dp/B0F325MBB8",
                    price: "$39.99",
                    perUnit: "$39.99/unit"
                }
            ]
        },
        {
            id: 2,
            title: "Bunion Corrector Splint - $49.90",
            verdict: "caution",
            originalPrice: "$49.90",
            summary: "Domain is 4 years old with 4.2/5 Trustpilot but product is 3x Amazon prices with refund complaints.",
            alternatives: [
                {
                    name: "Caretras 2-Pack Bunion Corrector",
                    url: "https://amazon.com/dp/B07HGTG6L5",
                    price: "$29.98 for 2",
                    perUnit: "$14.99/unit"
                },
                {
                    name: "Dr. Scholl's Bunion Relief & Toe Corrector",
                    url: "https://amazon.com/dp/B0BL86HZ2G",
                    price: "$15-20 for pair",
                    perUnit: "$7.50-10/unit"
                }
            ]
        },
        {
            id: 3,
            title: "Remineralizing Gum 135 Pieces - $25.49",
            verdict: "suspect",
            originalPrice: "$25.49 for 135 pieces",
            summary: "Domain only 5 months old, no Trustpilot presence, fake urgency tactics and unverifiable reviews.",
            alternatives: [
                {
                    name: "crait Hydroxyapatite Gum (Amazon's Choice)",
                    url: "https://amazon.com/dp/B0DPXVDF7M",
                    price: "$19.99 for 60 pieces",
                    perUnit: "$0.33/piece"
                },
                {
                    name: "Dentagum Nano-Hydroxyapatite Gum",
                    url: "https://amazon.com/dp/B0FH77JJ7J",
                    price: "$30 for 60 pieces",
                    perUnit: "$0.50/piece"
                }
            ]
        }
    ];

    res.status(200).json({
        success: true,
        count: products.length,
        products
    });
}
