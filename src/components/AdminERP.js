// ==============================================================================
// KOBIRUL SOFTWARES - ADMIN ERP & FULFILLMENT WITH AUTHENTICATION GUARD
// ==============================================================================

import { escapeHtml } from '../utils/security.js';

export function renderAdminERP(appInstance) {
  const adminView = document.getElementById("view-admin");
  if (!adminView) return;

  const user = window.supabaseService.getCurrentUser();
  const isAdmin = window.supabaseService.isAdmin();

  // ROUTE GUARD: Lock Admin ERP if not authenticated as Admin
  if (!isAdmin) {
    adminView.innerHTML = `
      <div class="container" style="padding:60px 20px; text-align:center;">
        <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-xl); padding:40px 30px; max-width:520px; margin:0 auto; box-shadow:var(--shadow-card);">
          <div style="background:rgba(218,119,86,0.1); width:70px; height:70px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px;">
            <i class="fa-solid fa-lock text-terracotta" style="font-size:2.2rem;"></i>
          </div>
          <h2 style="margin-bottom:8px;">Admin ERP Restricted Access</h2>
          <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:24px;">
            This area is restricted to authorized administrators only. Please log in with your Admin credentials to approve orders and manage stock.
          </p>

          <div style="background:var(--bg-input); padding:16px; border-radius:var(--radius-md); text-align:left; margin-bottom:24px; border:1px solid var(--border-color); font-size:0.82rem;">
            <strong style="color:var(--terracotta); display:block; margin-bottom:6px;"><i class="fa-solid fa-key"></i> Administrator Demo Login:</strong>
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Email:</span> <code>admin@kobirul.com</code></div>
            <div style="display:flex; justify-content:space-between;"><span>Password:</span> <code>admin123</code></div>
          </div>

          <button class="btn btn-block btn-primary" onclick="app.openAuthModal()">
            <i class="fa-solid fa-right-to-bracket"></i> Sign In to Admin ERP
          </button>
        </div>
      </div>
    `;
    return;
  }

  // AUTHORIZED ADMIN VIEW: Full ERP Control Panel
  const orders = window.supabaseService.getOrders();
  const pendingOrders = orders.filter(o => o.fulfillment_status !== "fulfilled");
  const fulfilledOrders = orders.filter(o => o.fulfillment_status === "fulfilled");
  const totalRevenue = orders.reduce((sum, o) => sum + (o.payment_status === "paid" || o.fulfillment_status === "fulfilled" ? o.total_amount : 0), 148500);

  adminView.innerHTML = `
    <div class="dashboard-header">
      <div>
        <h2><i class="fa-solid fa-shield-halved text-terracotta"></i> Kobirul ERP & Fulfillment Center</h2>
        <p>Logged in as <strong class="text-terracotta">${escapeHtml(user.email)}</strong> • Full Administrator Privileges</p>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-sm btn-outline" onclick="app.logout()"><i class="fa-solid fa-right-from-bracket"></i> Logout Admin</button>
      </div>
    </div>

    <!-- Admin Metrics -->
    <div class="metrics-grid">
      <div class="metric-card">
        <span class="metric-title">Total Revenue (INR)</span>
        <h3 class="metric-value text-success" id="admin-total-revenue">${appInstance.formatPrice(totalRevenue)}</h3>
        <small class="metric-sub"><i class="fa-solid fa-arrow-trend-up"></i> +32% growth this month</small>
      </div>
      <div class="metric-card">
        <span class="metric-title">Pending Verification</span>
        <h3 class="metric-value text-warning" id="admin-pending-count">${pendingOrders.length}</h3>
        <small class="metric-sub">Requires Approval</small>
      </div>
      <div class="metric-card">
        <span class="metric-title">Fulfilled Licenses</span>
        <h3 class="metric-value text-terracotta" id="admin-fulfilled-count">${fulfilledOrders.length}</h3>
        <small class="metric-sub">Delivered to Customers</small>
      </div>
      <div class="metric-card">
        <span class="metric-title">Profit Margin</span>
        <h3 class="metric-value text-accent">78%</h3>
        <small class="metric-sub">High Margin License Catalog</small>
      </div>
    </div>

    <!-- Admin Pending Approval Queue (Responsive Desktop & Mobile) -->
    <div class="dashboard-card mt-4">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3><i class="fa-solid fa-clock-rotate-left text-warning"></i> Order Verification & License Dispatch Queue</h3>
        <span class="status-badge status-pending">${pendingOrders.length} Pending Actions</span>
      </div>

      <!-- Desktop Table -->
      <div class="admin-table-wrapper desktop-only">
        <table class="orders-table">
          <thead>
            <tr>
              <th>Order Ref</th>
              <th>Customer</th>
              <th>Product & Plan</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Fulfillment Status</th>
              <th>Admin Actions</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td><strong>${escapeHtml(o.id)}</strong></td>
                <td>
                  <strong>${escapeHtml(o.customer_name)}</strong>
                  <div style="font-size:0.75rem; color:var(--text-dim);">${escapeHtml(o.customer_email)}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(o.customer_phone)}</div>
                </td>
                <td>
                  <strong>${escapeHtml(o.product_name)}</strong>
                  <div style="font-size:0.75rem; color:var(--terracotta);">${escapeHtml(o.variant)}</div>
                </td>
                <td class="text-success"><strong>${appInstance.formatPrice(o.total_amount)}</strong></td>
                <td style="text-transform:uppercase;">
                  <span style="background:var(--bg-input); padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:700;">
                    ${escapeHtml(o.payment_method)}
                  </span>
                </td>
                <td>
                  <span class="status-badge ${o.fulfillment_status === 'fulfilled' ? 'status-paid' : 'status-pending'}">
                    ${escapeHtml(o.fulfillment_status)}
                  </span>
                </td>
                <td>
                  ${o.fulfillment_status !== 'fulfilled' ? `
                    <button class="btn btn-sm btn-primary" onclick="app.approveOrder('${escapeHtml(o.id)}')">
                      <i class="fa-solid fa-check-double"></i> Approve & Deliver Keys
                    </button>
                  ` : `
                    <span class="text-success" style="font-size:0.8rem; font-weight:600;">
                      <i class="fa-solid fa-circle-check"></i> Delivered (${escapeHtml(o.credentials?.email || 'Active')})
                    </span>
                  `}
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="mobile-orders-list mobile-only">
        ${orders.map(o => `
          <div class="admin-mobile-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <strong>${escapeHtml(o.id)}</strong>
              <span class="status-badge ${o.fulfillment_status === 'fulfilled' ? 'status-paid' : 'status-pending'}">${escapeHtml(o.fulfillment_status)}</span>
            </div>
            <div style="font-size:0.85rem; margin-bottom:4px;"><strong>Customer:</strong> ${escapeHtml(o.customer_name)} (${escapeHtml(o.customer_email)})</div>
            <div style="font-size:0.85rem; margin-bottom:4px;"><strong>Product:</strong> ${escapeHtml(o.product_name)} - ${escapeHtml(o.variant)}</div>
            <div style="font-size:0.9rem; margin-bottom:12px;" class="text-success"><strong>Amount:</strong> ${appInstance.formatPrice(o.total_amount)}</div>
            ${o.fulfillment_status !== 'fulfilled' ? `
              <button class="btn btn-block btn-sm btn-primary" onclick="app.approveOrder('${escapeHtml(o.id)}')">
                <i class="fa-solid fa-check-double"></i> Approve & Deliver Credentials
              </button>
            ` : `
              <div class="text-success" style="font-size:0.8rem; font-weight:600;"><i class="fa-solid fa-circle-check"></i> Credentials Dispatched</div>
            `}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}
