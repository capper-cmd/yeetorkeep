// Vercel Serverless Function - Get Products
// Note: In production, this would pull from a database
// For now, returns sample data (bot data is local only)
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // Load products from static JSON
    let products = [];
    try {
        const json = fs.readFileSync(path.join(process.cwd(), 'public/data/products.json'), 'utf8');
        products = JSON.parse(json);
    } catch (err) {
        console.error('Error loading products JSON:', err);
    }
    // Apply query parameters
    const { category, limit } = req.query;
    if (category) {
        products = products.filter(p => p.category === category);
    }
    if (limit) {
        const n = parseInt(limit, 10);
        if (!isNaN(n)) {
            products = products.slice(0, n);
        }
    }
    res.status(200).json({
        success: true,
        count: products.length,
        products
    });
}
