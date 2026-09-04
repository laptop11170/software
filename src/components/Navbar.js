// ==============================================================================
// KOBIRUL SOFTWARES - FLIPKART STYLE NAVBAR
// ==============================================================================

import { escapeHtml } from '../utils/security.js';

export function renderNavbar(appInstance) {
  const header = document.querySelector(".navbar");
  if (!header) return;

  const customer = window.supabaseService.getCurrentCustomer();

  header.innerHTML = `
    <div class="container nav-wrapper">
      <div class="brand-group">
        <button class="mobile-menu-btn" onclick="app.toggleMobileDrawer()" aria-label="Toggle Mobile Menu">
          <i class="fa-solid fa-bars"></i>
        </button>
        
        <a href="#" class="logo-link" onclick="app.switchView('store'); return false;">
          <div class="logo-main">
            Kobirul <span>Softwares</span>
          </div>
          <div class="logo-sub">
            <span>Explore</span>
            <span class="plus-badge">Plus</span>
            <i class="fa-solid fa-star plus-icon"></i>
          </div>
        </a>
      </div>

      <div class="search-box">
        <input 
          type="text" 
          id="global-search" 
          placeholder="Search for software, AI tools, Windows keys, and more..." 
          oninput="app.filterProducts()"
          autocomplete="off"
        >
        <i class="fa-solid fa-magnifying-glass search-btn-icon"></i>
      </div>

      <div class="nav-actions">
        ${customer ? `
          <button class="user-badge-btn" onclick="app.openCustomerAuthModal()" title="${escapeHtml(customer.email)}">
            <i class="fa-solid fa-circle-user"></i>
            <span>${escapeHtml(customer.email.split('@')[0])}</span>
          </button>
        ` : `
          <button class="nav-action-btn" onclick="app.openCustomerAuthModal()">
            <i class="fa-solid fa-user"></i> <span class="login-text">Login</span>
          </button>
        `}

        <a href="#" class="nav-link-item" onclick="app.navigateToCustomerDashboard(); return false;">
          <i class="fa-solid fa-box-open"></i>
          <span>My Orders</span>
        </a>

        <a href="#" class="nav-link-item" onclick="app.filterByCategory('Bundles'); return false;">
          <i class="fa-solid fa-layer-group text-warning"></i>
          <span>Bundles</span>
        </a>

        <button class="theme-toggle-btn" onclick="app.toggleTheme()" title="Toggle Light / Dark Mode">
          <i class="fa-solid fa-sun icon-sun"></i>
          <i class="fa-solid fa-moon icon-moon"></i>
        </button>
      </div>
    </div>
  `;
}
