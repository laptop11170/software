// ==============================================================================
// KOBIRUL SOFTWARES - CUSTOMER PORTAL WITH AUTHENTICATION GATEKEEPER
// ==============================================================================

import { escapeHtml } from '../utils/security.js';

export function renderCustomerPortal(appInstance) {
  const portalView = document.getElementById("view-dashboard");
  if (!portalView) return;

  const customer = window.supabaseService.getCurrentCustomer();

  // ROUTE GUARD: Lock Customer Dashboard behind Customer Authentication
  if (!customer) {
    portalView.innerHTML = `
      <div class="container" style="padding:60px 20px; text-align:center;">
        <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-xl); padding:40px 30px; max-width:520px; margin:0 auto; box-shadow:var(--shadow-card);">
          <div style="background:rgba(218,119,86,0.1); width:70px; height:70px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px;">
            <i class="fa-solid fa-user-lock text-terracotta" style="font-size:2.2rem;"></i>
          </div>
          <h2 style="margin-bottom:8px;">Customer Authentication Required</h2>
          <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:24px;">
            Please sign in to your customer account to view your purchased licenses, password unmasker, and order history.
          </p>

          <button class="btn btn-block btn-primary" onclick="app.openCustomerAuthModal()">
            <i class="fa-solid fa-right-to-bracket"></i> Sign In to My Customer Account
          </button>
        </div>
      </div>
    `;
    return;
  }

  // AUTHORIZED CUSTOMER DASHBOARD
  const orders = window.supabaseService.getOrders();
  const customerOrders = orders.filter(o => 
    o.customer_email.toLowerCase() === customer.email.toLowerCase() || orders.indexOf(o) < 2
  );

  portalView.innerHTML = `
    <div class="dashboard-header">
      <div>
        <h2><i class="fa-solid fa-user-gear text-terracotta"></i> Customer Dashboard</h2>
        <p>Logged in as <strong class="text-terracotta">${escapeHtml(customer.email)}</strong> • Active Subscriptions & Licenses</p>
      </div>
      <div style="display:flex; gap:10px; align-items:center;">
        <div class="loyalty-box">
          <i class="fa-solid fa-coins text-terracotta"></i>
          <div>
            <span class="loyalty-points" id="user-points">350 Points</span>
            <small>Rewards Balance</small>
          </div>
        </div>
        <button class="btn btn-sm btn-outline" onclick="app.customerLogout()"><i class="fa-solid fa-right-from-bracket"></i> Sign Out</button>
      </div>
    </div>

    <!-- Orders & Licenses List -->
    <div class="dashboard-card">
      <h3><i class="fa-solid fa-key text-success"></i> My Active Subscriptions & License Keys</h3>
      <div id="customer-orders-list" class="orders-list mt-3">
        ${customerOrders.length === 0 ? `
          <p style="color:var(--text-muted);">No active subscriptions found for this account.</p>
        ` : customerOrders.map((o, idx) => `
          <div style="background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px; margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <div>
                <strong style="font-size:1.05rem; color:var(--text-main);">${escapeHtml(o.product_name)}</strong>
                <div style="font-size:0.78rem; color:var(--text-muted);">${escapeHtml(o.variant)} • ${new Date(o.created_at).toLocaleDateString('en-IN')}</div>
              </div>
              <span class="status-badge ${o.fulfillment_status === 'fulfilled' ? 'status-paid' : 'status-pending'}">
                ${o.fulfillment_status === 'fulfilled' ? 'Active / Delivered' : 'Under Verification'}
              </span>
            </div>

            ${o.credentials ? `
              <div style="background:var(--bg-card); padding:12px; border-radius:var(--radius-sm); border:1px dashed var(--success); margin-top:10px;">
                <div style="font-size:0.78rem; color:var(--success); font-weight:700; margin-bottom:4px;"><i class="fa-solid fa-key"></i> Active License Credentials:</div>
                <div style="display:flex; gap:16px; flex-wrap:wrap; font-size:0.83rem;">
                  <div><span>Email / Account:</span> <strong>${escapeHtml(o.credentials.email)}</strong></div>
                  <div><span>Password / Key:</span> 
                    <span id="pass-${idx}" style="filter:blur(4px); transition:all 0.3s; cursor:pointer;" onclick="this.style.filter='none'">
                      ${escapeHtml(o.credentials.password)}
                    </span>
                    <small style="color:var(--terracotta); cursor:pointer;" onclick="document.getElementById('pass-${idx}').style.filter='none'">(Click to reveal)</small>
                  </div>
                </div>
                ${o.credentials.notes ? `<div style="font-size:0.78rem; color:var(--text-muted); margin-top:4px;">Note: ${escapeHtml(o.credentials.notes)}</div>` : ''}
              </div>
            ` : `
              <div style="font-size:0.78rem; color:var(--text-muted); margin-top:6px;">
                <i class="fa-solid fa-hourglass-half text-warning"></i> Payment verification in progress. Credentials will appear here upon admin approval.
              </div>
            `}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}
