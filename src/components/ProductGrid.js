// ==============================================================================
// KOBIRUL SOFTWARES - FLIPKART STYLE PRODUCT GRID COMPONENT
// Zero text misalignment, uniform card heights, Flipkart ratings & discount tags
// ==============================================================================

import { escapeHtml } from '../utils/security.js';
import { getToolBrandImage } from '../utils/brandIcons.js';

export function renderProductGrid(appInstance) {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  const searchQuery = (document.getElementById("global-search")?.value || "").toLowerCase();

  let itemsToRender = [];

  if (appInstance.currentCategory === "Bundles") {
    itemsToRender = appInstance.bundles.map(b => ({
      ...b,
      category: "Value Bundle",
      features: ["Multi-tool Access", "Instant Activation", "Maximum Savings"]
    }));
  } else {
    itemsToRender = appInstance.catalog.filter(p => {
      const matchesCategory = appInstance.currentCategory === "All" || p.category === appInstance.currentCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery) || 
                            p.description.toLowerCase().includes(searchQuery) ||
                            p.category.toLowerCase().includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }

  if (itemsToRender.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-sm); text-align: center; padding: 60px 20px;">
        <i class="fa-solid fa-box-open" style="font-size: 3rem; color: var(--text-dim); margin-bottom: 16px;"></i>
        <h3 style="font-size:1.25rem; margin-bottom:6px;">No software licenses found matching your search</h3>
        <p style="color: var(--text-muted); font-size:0.9rem;">Try searching for Adobe, Canva, ChatGPT, Claude Pro, or select another category from the top bar.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = itemsToRender.map(p => {
    const mainVariant = p.variants ? p.variants[0] : { price: p.price, sale_price: p.sale_price };
    const currentPrice = Number(mainVariant.sale_price || mainVariant.price || p.price || 0);
    const strikePrice = mainVariant.sale_price ? Number(mainVariant.price || 0) : (p.sale_price && p.price ? Number(p.price) : null);
    const discountPercent = (strikePrice && strikePrice > currentPrice) 
      ? Math.round(((strikePrice - currentPrice) / strikePrice) * 100) 
      : 40; // Default attractive discount percentage if not explicitly calculated

    const brandLogo = getToolBrandImage(p.slug, p.image_url);
    const ratingScore = p.rating_avg || (4.5 + ((p.name.charCodeAt(0) % 5) / 10)).toFixed(1);
    const reviewCount = (p.rating_count || (120 + (p.name.charCodeAt(0) * 8))).toLocaleString('en-IN');

    const featuresHtml = (p.features || ["Instant Activation", "100% Replacement Warranty"]).slice(0, 2).map(f => `
      <li><i class="fa-solid fa-circle-check"></i> ${escapeHtml(f)}</li>
    `).join("");

    return `
      <div class="product-card">
        <div class="product-img-wrap">
          ${p.badge ? `<span class="badge-tag">${escapeHtml(p.badge)}</span>` : `<span class="badge-tag" style="background:#2874f0;">Top Deal</span>`}
          <img src="${brandLogo}" alt="${escapeHtml(p.name)}" class="brand-logo-img" onerror="this.src='${p.image_url}'" loading="lazy">
        </div>

        <div class="product-body">
          <div class="product-category-row">
            <span class="product-category">${escapeHtml(p.category)}</span>
            <span class="assured-badge"><i class="fa-solid fa-shield-check"></i> Assured</span>
          </div>

          <h3 class="product-title" title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</h3>

          <div class="rating-row">
            <span class="rating-pill">
              ${ratingScore} <i class="fa-solid fa-star" style="font-size:0.65rem;"></i>
            </span>
            <span class="rating-count">(${reviewCount})</span>
          </div>

          <p class="product-desc" title="${escapeHtml(p.description)}">${escapeHtml(p.description)}</p>

          <ul class="feature-list">
            ${featuresHtml}
          </ul>
        </div>

        <div class="product-footer">
          <div class="price-row">
            <span class="current-price">${appInstance.formatPrice(currentPrice)}</span>
            ${strikePrice ? `<span class="strike-price">${appInstance.formatPrice(strikePrice)}</span>` : ""}
            <span class="discount-tag">${discountPercent}% off</span>
          </div>
          
          <div class="delivery-tag">
            <i class="fa-solid fa-bolt" style="color:var(--fk-yellow-gold);"></i> <strong>Free Instant Delivery</strong> in 5 mins
          </div>

          <button class="btn-buy" onclick="app.openProductModal('${p.slug}')">
            <i class="fa-solid fa-cart-shopping"></i> Buy Now
          </button>
        </div>
      </div>
    `;
  }).join("");
}
