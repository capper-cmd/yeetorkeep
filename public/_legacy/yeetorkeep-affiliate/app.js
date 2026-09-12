// YeetOrKeep Deals - Product Display Logic

// Configuration
const API_ENDPOINT = '/data/products.json';

// DOM Elements
const productsGrid = document.getElementById('products-grid');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadRecentProducts();
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts[0] === 'category' && pathParts[1]) {
        const cat = pathParts[1];
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(c => c.classList.remove('active'));
        const activeCard = document.querySelector(`.category-card[data-category="${cat}"]`);
        if (activeCard) activeCard.classList.add('active');
        filterByCategory(cat);
        document.getElementById('trending').scrollIntoView();
    } else {
        loadProducts();
    }
    initCategoryFilters();
});

// Load products from API or static JSON
async function loadProducts() {
    try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) throw new Error('Failed to load products');
        
        const data = await response.json();
        // Handle both array (static JSON) and object with products property (API)
        const products = Array.isArray(data) ? data : (data.products || []);
        renderProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        // Fall back to sample data if API not available
        renderProducts(getSampleProducts());
    }
}

// Render product cards
function renderProducts(products) {
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="loading-state">
                <p>No products yet. Check back soon!</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Create a single product card
function createProductCard(product) {
    const verdictClass = product.research?.verdict || 'suspect';
    const verdictEmoji = verdictClass === 'legit' ? '✅' : verdictClass === 'caution' ? '⚠️' : '❌';
    const verdictText = verdictClass.toUpperCase();

    const alternativesHTML = (product.research.alternatives || []).slice(0, 3).map(alt => {
        const affiliateUrl = createAffiliateLink(alt.url);
        return `
            <div class="alternative-item">
                <div class="alternative-info">
                    <span class="alternative-name">${escapeHtml(alt.name || 'Product')}</span>
                    <span class="alternative-price">
                        ${escapeHtml(alt.price || 'See price')}
                    </span>
                </div>
                <a href="${affiliateUrl}" class="buy-button" target="_blank" rel="noopener sponsored">
                    View on Amazon
                </a>
            </div>
        `;
    }).join('');

    return `
        <article class="product-card">
            <div class="product-header">
                <span class="product-verdict ${verdictClass}">
                    ${verdictEmoji} ${verdictText}
                </span>
                <p class="original-product">
                    <strong>Original:</strong> ${escapeHtml(product.title || 'Unknown Product')}
                    ${product.research.originalPrice ? `• ${escapeHtml(product.research.originalPrice)}` : ''}
                </p>
                <p class="product-summary">${escapeHtml(product.research.summary || 'No summary available.')}</p>
            </div>
            <div class="alternatives-section">
                <div class="alternatives-title">
                    ✨ Better Alternatives on Amazon
                </div>
                ${alternativesHTML || '<p style="color: var(--gray); font-size: 14px;">No alternatives found</p>'}
            </div>
        </article>
    `;
}
// Create affiliate link (placeholder for Amazon Associates tag)
function createAffiliateLink(url) {
    if (!url) return '#';
    
    // TODO: Add Amazon Associates tag when account is approved
    // const AFFILIATE_TAG = 'yeetorkeep-20';
    // if (url.includes('amazon.com')) {
    //     const separator = url.includes('?') ? '&' : '?';
    //     return `${url}${separator}tag=${AFFILIATE_TAG}`;
    // }
    
    return url;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load recently analyzed products
async function loadRecentProducts() {
    try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) throw new Error('Failed to load recent products');
        const data = await response.json();
        const products = Array.isArray(data) ? data : (data.products || []);
        // Get last 10 items
        renderRecentProducts(products.slice(0, 10));
    } catch (error) {
        console.error('Error loading recent products:', error);
    }
}

// Render recent items
function renderRecentProducts(products) {
    const recentGrid = document.getElementById('recent-grid');
    if (!recentGrid) return;
    if (products.length === 0) {
        recentGrid.innerHTML = '<p>No recent items yet.</p>';
        return;
    }
    recentGrid.innerHTML = products.map(product => {
        const verdictClass = product.verdict || 'suspect';
        const verdictEmoji = verdictClass === 'legit' ? '✅' : verdictClass === 'caution' ? '⚠️' : '❌';
        const savings = computeSavings(product);
        return `
            <div class="recent-item">
                <span class="product-verdict ${verdictClass}">${verdictEmoji}</span>
                <span class="recent-title">${escapeHtml(product.title)}</span>
                <span class="recent-savings">${savings}</span>
            </div>
        `;
    }).join('');
}

// Compute savings string
function computeSavings(product) {
    const orig = parseFloat((product.research.originalPrice || '').replace(/[^0-9.]/g, ''));
    const altPrice = product.research.alternatives && product.research.alternatives[0]
        ? parseFloat((product.research.alternatives[0].price || '').replace(/[^0-9.]/g, ''))
        : 0;
    if (orig && altPrice) {
        const diff = orig - altPrice;
        const percent = Math.round((diff / orig) * 100);
        return `Save $${diff.toFixed(2)} (${percent}%)`;
    }
    return '';
}

// Initialize category filters
function initCategoryFilters() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterByCategory(category);
            
            // Visual feedback
            categoryCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
}

// Filter products by category (client-side filtering)
async function filterByCategory(category) {
    try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) throw new Error('Failed to filter products');
        const data = await response.json();
        const products = Array.isArray(data) ? data : (data.products || []);
        // Filter by category client-side
        const filtered = products.filter(p => p.category === category || category === 'all');
        renderProducts(filtered);
    } catch (error) {
        console.error('Error filtering products:', error);
    }
}

// Sample data for when API is not available
function getSampleProducts() {
    return [
        {
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
        },
        {
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
        }
    ];
}
