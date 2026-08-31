// ==============================================================================
// KOBIRUL SOFTWARES - DEDICATED ADMIN LOGIN PORTAL (/admin-login-1)
// ==============================================================================

import { escapeHtml } from '../utils/security.js';

export function renderAdminLogin(appInstance) {
  const adminLoginView = document.getElementById("view-admin-login");
  if (!adminLoginView) return;

  const admin = window.supabaseService.getCurrentAdmin();

  if (admin) {
    adminLoginView.innerHTML = `
      <div class="container" style="padding:60px 20px; text-align:center;">
        <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-xl); padding:40px 30px; max-width:520px; margin:0 auto; box-shadow:var(--shadow-card);">
          <i class="fa-solid fa-user-shield text-terracotta" style="font-size:3.5rem; margin-bottom:12px;"></i>
          <h2>Administrator Session Active</h2>
          <p style="color:var(--text-muted); font-size:0.88rem; margin:10px 0 20px;">
            Logged in as <strong>${escapeHtml(admin.email)}</strong>
          </p>
          
          <button class="btn btn-block btn-primary mb-2" onclick="app.switchView('admin')">
            <i class="fa-solid fa-shield-halved"></i> Open Admin ERP Dashboard
          </button>
          
          <button class="btn btn-block btn-outline mt-2" onclick="app.adminLogout()">
            <i class="fa-solid fa-right-from-bracket"></i> Logout Admin Session
          </button>
        </div>
      </div>
    `;
    return;
  }

  adminLoginView.innerHTML = `
    <div class="container" style="padding:60px 20px;">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-xl); padding:40px 32px; max-width:480px; margin:0 auto; box-shadow:var(--shadow-card);">
        <div style="text-align:center; margin-bottom:24px;">
          <div style="background:rgba(218,119,86,0.1); width:64px; height:64px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 14px;">
            <i class="fa-solid fa-shield-halved text-terracotta" style="font-size:2rem;"></i>
          </div>
          <h2 style="font-size:1.6rem; color:var(--text-main);">Admin Back-Office Portal</h2>
          <p style="color:var(--text-muted); font-size:0.85rem; margin-top:4px;">Protected Administrator Authentication Endpoint (<code>/admin-login-1</code>)</p>
        </div>

        <form onsubmit="app.handleAdminLoginSubmit(); return false;">
          <div class="form-group">
            <label>Admin Email *</label>
            <input type="email" id="admin-login-email" placeholder="admin@kobirul.com" required>
          </div>

          <div class="form-group">
            <label>Admin Secret Password *</label>
            <input type="password" id="admin-login-password" placeholder="••••••••" required>
          </div>

          <button type="submit" class="btn btn-block btn-primary mt-3">
            <i class="fa-solid fa-key"></i> Authenticate Administrator
          </button>
        </form>

        <div style="background:var(--bg-input); padding:14px; border-radius:var(--radius-sm); margin-top:24px; border:1px solid var(--border-color); font-size:0.78rem; color:var(--text-muted);">
          <strong style="color:var(--terracotta); display:block; margin-bottom:4px;"><i class="fa-solid fa-lock"></i> Demo Admin Credentials:</strong>
          <div>• <strong>Email:</strong> <code>admin@kobirul.com</code></div>
          <div>• <strong>Password:</strong> <code>admin123</code></div>
        </div>
      </div>
    </div>
  `;
}
