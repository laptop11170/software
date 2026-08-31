// ==============================================================================
// KOBIRUL SOFTWARES - CLEAN NAVBAR & CUSTOMER DASHBOARD LINK
// ==============================================================================

import { escapeHtml } from '../utils/security.js';

export function renderNavbar(appInstance) {
  const header = document.querySelector(".navbar");
  if (!header) return;

  const customer = window.supabaseService.getCurrentCustomer();

  header.innerHTML = `
    <div class="container nav-wrapper">
      <div style="display:flex; align-items:center; gap:12px;">
        <button class="mobile-menu-btn" onclick="app.toggleMobileDrawer()" aria-label="Toggle Mobile Menu">
          <i class="fa-solid fa-bars"></i>
        </button>
        
        <a href="#" class="logo" onclick="app.switchView('store'); return false;">
          <div class="logo-mark">K</div>
          <div class="logo-text">Kobirul <span class="logo-serif">Softwares</span></div>
        </a>
      </div>

      <div class="search-box">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input type="text" id="global-search" placeholder="Search 250+ software, AI tools & streaming..." oninput="app.filterProducts()">
      </div>

      <nav class="nav-links">
        <a href="#" class="nav-link active" id="nav-store" onclick="app.switchView('store'); return false;"><i class="fa-solid fa-border-all"></i> Catalog (250+)</a>
        <a href="#" class="nav-link" id="nav-bundles" onclick="app.filterByCategory('Bundles'); return false;"><i class="fa-solid fa-layer-group"></i> Bundles</a>
        <a href="#" class="nav-link" id="nav-dashboard" onclick="app.navigateToCustomerDashboard(); return false;"><i class="fa-solid fa-user"></i> Dashboard</a>
      </nav>

      <div class="header-actions">
        <button class="theme-toggle-btn" onclick="app.toggleTheme()" title="Toggle Light / Dark Theme">
          <i class="fa-solid fa-sun icon-sun"></i>
          <i class="fa-solid fa-moon icon-moon"></i>
        </button>

        ${customer ? `
          <button class="auth-btn-user" onclick="app.openCustomerAuthModal()" title="${escapeHtml(customer.email)}">
            <i class="fa-solid fa-circle-user"></i>
            <span>${escapeHtml(customer.email.split('@')[0])}</span>
          </button>
        ` : `
          <button class="auth-btn-login" onclick="app.openCustomerAuthModal()">
            <i class="fa-solid fa-right-to-bracket"></i> <span class="login-text">Sign In</span>
          </button>
        `}
      </div>
    </div>
  `;
}
