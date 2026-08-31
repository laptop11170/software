// ==============================================================================
// KOBIRUL SOFTWARES - PRODUCT GRID COMPONENT WITH OFFICIAL BRAND ASSETS
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
      features: ["Multi-tool Access", "Instant Activation", "Maximum Discount"]
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
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <i class="fa-solid fa-box-open" style="font-size: 3rem; color: var(--text-dim); margin-bottom: 16px;"></i>
        <h3>No software licenses found matching your search</h3>
        <p style="color: var(--text-muted);">Try searching for Adobe, Canva, ChatGPT, Claude Pro, or select another category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = itemsToRender.map(p => {
    const mainVariant = p.variants ? p.variants[0] : { price: p.price, sale_price: p.sale_price };
    const currentPrice = mainVariant.sale_price || mainVariant.price || p.price;
    const strikePrice = mainVariant.sale_price ? mainVariant.price : null;
    const brandLogo = getToolBrandImage(p.slug, p.image_url);

    const featuresHtml = (p.features || []).slice(0, 3).map(f => `
      <li><i class="fa-solid fa-circle-check"></i> ${escapeHtml(f)}</li>
    `).join("");

    return `
      <div class="product-card">
        <div class="product-img-wrap">
          <div class="brand-logo-container">
            <img src="${brandLogo}" alt="${escapeHtml(p.name)}" class="brand-logo-img" onerror="this.src='${p.image_url}'">
          </div>
          ${p.badge ? `<span class="badge-tag">${escapeHtml(p.badge)}</span>` : ""}
        </div>
        <div class="product-body">
          <span class="product-category">${escapeHtml(p.category)}</span>
          <h3 class="product-title">${escapeHtml(p.name)}</h3>
          <p class="product-desc">${escapeHtml(p.description)}</p>
          <ul class="feature-list">
            ${featuresHtml}
          </ul>
          <div class="product-footer">
            <div class="price-box">
              ${strikePrice ? `<span class="strike-price">${appInstance.formatPrice(strikePrice)}</span>` : ""}
              <span class="current-price">${appInstance.formatPrice(currentPrice)}</span>
            </div>
            <button class="btn btn-primary" onclick="app.openProductModal('${p.slug}')">
              <i class="fa-solid fa-bolt"></i> Activate
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}
