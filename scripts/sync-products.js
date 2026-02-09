#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Paths
const BOT_DATA_DIR = path.resolve(__dirname, '../../shopping-bot/data');
const OUTPUT_DIR = path.resolve(__dirname, '../public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'products.json');

// Category keywords mapping
const CATEGORY_KEYWORDS = {
    beauty: ['beauty','cream','makeup','skincare','lip','mascara','foundation'],
    electronics: ['electronics','charger','headphone','camera','phone','laptop','speaker','earbud'],
    health: ['health','vitamin','supplement','pill','gum','wellness','protein','medicine'],
    home: ['home','kitchen','furniture','vacuum','mop','bedding','cookware','pillow']
};

// Determine category based on title
function categorize(title = '') {
    const lower = title.toLowerCase();
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(kw => lower.includes(kw))) {
            return cat;
        }
    }
    return 'other';
}

// Read and process bot data
function loadBotItems() {
    const products = [];
    if (!fs.existsSync(BOT_DATA_DIR)) {
        console.error('Bot data directory not found:', BOT_DATA_DIR);
        return products;
    }
    const files = fs.readdirSync(BOT_DATA_DIR);
    for (const file of files) {
        if (!file.startsWith('user_') || !file.endsWith('.json')) continue;
        const filePath = path.join(BOT_DATA_DIR, file);
        let userData;
        try {
            userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
            console.warn('Skipping invalid JSON file:', filePath);
            continue;
        }
        for (const item of userData.items || []) {
            if (!item.research || !item.research.alternatives) continue;
            const title = item.title || item.url;
            products.push({
                id: item.id,
                url: item.url,
                title,
                category: categorize(title),
                research: {
                    verdict: item.research.verdict,
                    summary: item.research.summary,
                    originalPrice: item.research.originalPrice,
                    alternatives: item.research.alternatives.map(a => ({
                        name: a.name,
                        url: a.url,
                        price: a.price
                    }))
                }
            });
        }
    }
    // Sort by most recent first if timestamp available
    return products;
}

// Write products.json
function writeOutput(products) {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2));
    console.log('Wrote', products.length, 'products to', OUTPUT_FILE);
}

// Main
function main() {
    const products = loadBotItems();
    writeOutput(products);
}

if (require.main === module) {
    main();
}
