// ==============================================================================
// KOBIRUL SOFTWARES - CUSTOMER AUTHENTICATION MODAL
// ==============================================================================

import { escapeHtml } from '../utils/security.js';

export function renderCustomerAuthModal(appInstance) {
  const overlay = document.getElementById("auth-modal");
  if (!overlay) return;

  const customer = window.supabaseService.getCurrentCustomer();

  if (customer) {
    overlay.querySelector(".modal-card").innerHTML = `
      <button class="modal-close" onclick="app.closeModal('auth-modal')">&times;</button>
      <div style="text-align:center; padding:20px 0;">
        <i class="fa-solid fa-circle-user text-terracotta" style="font-size:3.2rem; margin-bottom:12px;"></i>
        <h2>Welcome, ${escapeHtml(customer.email)}</h2>
        <span class="badge-tag mt-2" style="position:static; display:inline-block;">Verified Customer</span>
        
        <p style="color:var(--text-muted); margin:16px 0; font-size:0.9rem;">
          You are signed in to your customer account. Access your active tool licenses, password unmasker, and order history in your Customer Dashboard.
        </p>

        <button class="btn btn-block btn-primary mb-2" onclick="app.closeModal('auth-modal'); app.switchView('dashboard');">
          <i class="fa-solid fa-key"></i> Go to My Dashboard & Licenses
        </button>

        <button class="btn btn-block btn-outline mt-2" onclick="app.customerLogout()">
          <i class="fa-solid fa-right-from-bracket"></i> Sign Out
        </button>
      </div>
    `;
  } else {
    overlay.querySelector(".modal-card").innerHTML = `
      <button class="modal-close" onclick="app.closeModal('auth-modal')">&times;</button>
      <div class="auth-box">
        <h2 style="margin-bottom:6px;"><i class="fa-solid fa-user-lock text-terracotta"></i> Customer Account Portal</h2>
        <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:20px;">Sign in or create an account to view your purchased licenses and active subscriptions.</p>
        
        <div class="form-group">
          <label>Email Address *</label>
          <input type="email" id="cust-auth-email" placeholder="e.g. rahul@gmail.com" required>
        </div>

        <div class="form-group">
          <label>Password *</label>
          <input type="password" id="cust-auth-password" placeholder="••••••••" required>
        </div>

        <button class="btn btn-block btn-primary mt-3" onclick="app.handleCustomerAuthSubmit()">
          <i class="fa-solid fa-right-to-bracket"></i> Sign In / Create Account
        </button>

        <div style="background:var(--bg-input); padding:12px; border-radius:var(--radius-sm); margin-top:20px; border:1px solid var(--border-color); font-size:0.78rem; color:var(--text-muted);">
          <strong style="color:var(--terracotta); display:block; margin-bottom:4px;"><i class="fa-solid fa-circle-info"></i> Customer Access Note:</strong>
          Sign in with any email to instantly view and manage your software orders and licenses.
        </div>
      </div>
    `;
  }
}
