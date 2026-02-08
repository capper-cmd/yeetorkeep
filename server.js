const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuration
const PORT = process.env.PORT || 3001;
const PUBLIC_DIR = path.join(__dirname, 'public');
const BOT_DATA_DIR = path.join(__dirname, '..', 'shopping-bot', 'data');

// MIME types for static files
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Create HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Enable CORS for API endpoints
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // API endpoints
    if (pathname === '/api/products') {
        handleProductsAPI(req, res);
        return;
    }

    if (pathname === '/api/stats') {
        handleStatsAPI(req, res);
        return;
    }

    // Serve static files
    serveStaticFile(pathname, res);
});

// Get all products from bot data
function getProductsFromBotData() {
    const products = [];
    
    try {
        const files = fs.readdirSync(BOT_DATA_DIR);
        
        for (const file of files) {
            if (!file.startsWith('user_') || !file.endsWith('.json')) continue;
            
            const filePath = path.join(BOT_DATA_DIR, file);
            const userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            for (const item of (userData.items || [])) {
                // Only include analyzed items with alternatives
                if (!item.research || !item.research.alternatives) continue;
                
                products.push({
                    id: item.id,
                    title: item.title || item.url,
                    originalUrl: item.url,
                    originalPrice: item.research.originalPrice,
                    verdict: item.research.verdict,
                    summary: item.research.summary,
                    domainAge: item.research.domainAge,
                    pros: item.research.pros || [],
                    cons: item.research.cons || [],
                    alternatives: item.research.alternatives || [],
                    analyzedAt: item.research.analyzedAt
                });
            }
        }
        
        // Sort by most recently analyzed
        products.sort((a, b) => (b.analyzedAt || 0) - (a.analyzedAt || 0));
        
    } catch (error) {
        console.error('Error reading bot data:', error.message);
    }
    
    return products;
}

// API: Get all products
function handleProductsAPI(req, res) {
    try {
        const products = getProductsFromBotData();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            count: products.length,
            products
        }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
}

// API: Get stats
function handleStatsAPI(req, res) {
    try {
        const products = getProductsFromBotData();
        
        const stats = {
            totalProducts: products.length,
            byVerdict: {
                legit: products.filter(p => p.verdict === 'legit').length,
                caution: products.filter(p => p.verdict === 'caution').length,
                suspect: products.filter(p => p.verdict === 'suspect').length
            },
            totalAlternatives: products.reduce((sum, p) => sum + (p.alternatives?.length || 0), 0)
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stats));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
}

// Serve static files
function serveStaticFile(pathname, res) {
    // Default to index.html
    if (pathname === '/') pathname = '/index.html';
    
    const filePath = path.join(PUBLIC_DIR, pathname);
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain';
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Try index.html for SPA routing
                fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (err2, data2) => {
                    if (err2) {
                        res.writeHead(404);
                        res.end('Not Found');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data2);
                });
                return;
            }
            res.writeHead(500);
            res.end('Server Error');
            return;
        }
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

// Start server
server.listen(PORT, () => {
    console.log(`
🛒 YeetOrKeep Deals - Affiliate Website
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Website: http://localhost:${PORT}
📡 API:     http://localhost:${PORT}/api/products
📊 Stats:   http://localhost:${PORT}/api/stats
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
});
