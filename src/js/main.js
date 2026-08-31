// ==============================================================================
// KOBIRUL SOFTWARES - PRODUCTION ROUTER & SEPARATED AUTH HANDLERS
// ==============================================================================

import { supabaseService } from '../services/supabaseClient.js';
import { paymentService } from '../services/paymentService.js';
import { escapeHtml } from '../utils/security.js';
import { getToolBrandImage } from '../utils/brandIcons.js';
import { renderNavbar } from '../components/Navbar.js';
import { renderProductGrid } from '../components/ProductGrid.js';
import { renderCustomerPortal } from '../components/CustomerPortal.js';
import { renderAdminERP } from '../components/AdminERP.js';
import { renderAdminLogin } from '../components/AdminLogin.js';
import { renderCustomerAuthModal } from '../components/AuthModal.js';

class KobirulProductionApp {
  constructor() {
    this.catalog = [];
    this.bundles = [];
    this.currentCategory = "All";
    this.currency = "INR";
    this.theme = localStorage.getItem("kobirul_theme") || "light";
    this.cart = [];
    this.activeProduct = null;
    this.activeVariant = null;

    this.init();
  }

  async init() {
    document.documentElement.className = this.theme;

    // Render Navbar & Auth Modals
    renderNavbar(this);
    renderCustomerAuthModal(this);

    // Fetch catalog
    const data = await supabaseService.getCatalog();
    if (data) {
      this.catalog = data.products || [];
      this.bundles = data.bundles || [];
    }

    // Attach Hash Router listener for URL route changes (e.g. #admin-login-1)
    window.addEventListener("hashchange", () => this.handleRoute());

    this.renderProducts();
    this.handleRoute();
    this.startSocialProofToasts();
  }

  // URL Hash Router: Handles #admin-login-1, #admin, #dashboard, #store
  handleRoute() {
    const hash = window.location.hash.toLowerCase();

    if (hash === "#admin-login-1" || hash === "#/admin-login-1") {
      this.switchView("admin-login");
    } else if (hash === "#admin" || hash === "#/admin") {
      if (!supabaseService.isAdminLoggedIn()) {
        window.location.hash = "#admin-login-1";
      } else {
        this.switchView("admin");
      }
    } else if (hash === "#dashboard" || hash === "#/dashboard") {
      this.navigateToCustomerDashboard();
    } else {
      this.switchView("store");
    }
  }

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
    document.documentElement.className = this.theme;
    localStorage.setItem("kobirul_theme", this.theme);
  }

  toggleMobileDrawer() {
    const drawer = document.getElementById("mobile-drawer");
    const overlay = document.getElementById("mobile-drawer-overlay");
    if (drawer && overlay) {
      drawer.classList.toggle("active");
      overlay.classList.toggle("active");
    }
  }

  closeMobileDrawer() {
    const drawer = document.getElementById("mobile-drawer");
    const overlay = document.getElementById("mobile-drawer-overlay");
    if (drawer && overlay) {
      drawer.classList.remove("active");
      overlay.classList.remove("active");
    }
  }

  // Customer Auth Handlers
  openCustomerAuthModal() {
    renderCustomerAuthModal(this);
    document.getElementById("auth-modal")?.classList.add("active");
  }

  handleCustomerAuthSubmit() {
    const email = document.getElementById("cust-auth-email")?.value.trim();
    const password = document.getElementById("cust-auth-password")?.value.trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    const result = supabaseService.customerLogin(email, password);
    if (!result.success) {
      alert(result.message);
      return;
    }

    this.closeModal("auth-modal");
    renderNavbar(this);
    this.switchView("dashboard");
    alert(`Signed in successfully as ${result.user.email}!`);
  }

  customerLogout() {
    supabaseService.customerLogout();
    renderNavbar(this);
    this.switchView("store");
    alert("You have signed out of your customer account.");
  }

  navigateToCustomerDashboard() {
    if (!supabaseService.isCustomerLoggedIn()) {
      this.openCustomerAuthModal();
    } else {
      this.switchView("dashboard");
    }
  }

  // Admin Dedicated Auth Handlers (/admin-login-1)
  handleAdminLoginSubmit() {
    const email = document.getElementById("admin-login-email")?.value.trim();
    const password = document.getElementById("admin-login-password")?.value.trim();

    const result = supabaseService.adminLogin(email, password);
    if (!result.success) {
      alert(result.message);
      return;
    }

    alert("Administrator Authenticated! Unlocking Back-Office ERP...");
    window.location.hash = "#admin";
    this.switchView("admin");
  }

  adminLogout() {
    supabaseService.adminLogout();
    window.location.hash = "#admin-login-1";
    this.switchView("admin-login");
    alert("Admin session terminated.");
  }

  formatPrice(inrAmount) {
    return `₹${Number(inrAmount).toLocaleString('en-IN')}`;
  }

  filterByCategory(cat) {
    this.currentCategory = cat;
    document.querySelectorAll(".cat-chip").forEach(btn => {
      btn.classList.toggle("active", btn.textContent.trim().includes(cat) || (cat === "All" && btn.textContent.includes("All")));
    });
    this.renderProducts();
    this.closeMobileDrawer();
  }

  filterProducts() {
    this.renderProducts();
  }

  renderProducts() {
    renderProductGrid(this);
  }

  renderCustomerOrders() {
    renderCustomerPortal(this);
  }

  renderAdminOrders() {
    renderAdminERP(this);
  }

  openProductModal(slug) {
    let p = this.catalog.find(item => item.slug === slug);
    if (!p) p = this.bundles.find(item => item.slug === slug);
    if (!p) return;

    this.activeProduct = p;
    this.activeVariant = p.variants ? p.variants[0] : { title: "Standard Activation", price: p.sale_price || p.price };

    const content = document.getElementById("modal-product-content");
    const brandLogo = getToolBrandImage(p.slug, p.image_url);

    const variantsHtml = (p.variants || []).map((v, idx) => `
      <label class="payment-chip ${idx === 0 ? 'active' : ''}" style="text-align:left; justify-content:space-between; flex:1;" onclick="app.selectVariant(${idx}, this)">
        <div>
          <strong>${escapeHtml(v.title)}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(v.type || 'Personal License')}</div>
        </div>
        <div style="text-align:right;">
          <strong class="text-success">${this.formatPrice(v.sale_price || v.price)}</strong>
        </div>
      </label>
    `).join("");

    content.innerHTML = `
      <div style="grid-column: 1/-1;">
        <div style="display:flex; gap:16px; align-items:center; margin-bottom:18px;">
          <img src="${brandLogo}" style="width:70px; height:70px; border-radius:var(--radius-md); object-fit:contain; background:var(--bg-input); padding:10px;">
          <div>
            <span class="product-category">${escapeHtml(p.category)}</span>
            <h2 style="font-size:1.5rem; color:var(--text-main);">${escapeHtml(p.name)}</h2>
            <div style="color:var(--warning); font-weight:700; font-size:0.85rem; margin-top:2px;">
              <i class="fa-solid fa-star"></i> ${p.rating_avg || 4.9} (${p.rating_count || 320}+ Verified Ratings)
            </div>
          </div>
        </div>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:20px;">${escapeHtml(p.description)}</p>
        
        <h4 style="margin-bottom:10px; font-size:0.95rem;">Select License Duration & Plan:</h4>
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:20px;">
          ${variantsHtml || `
            <div class="payment-chip active" style="justify-content:space-between;">
              <span>Full License Access</span>
              <strong class="text-success">${this.formatPrice(p.sale_price || p.price)}</strong>
            </div>
          `}
        </div>

        <div style="background:var(--bg-input); padding:14px; border-radius:var(--radius-md); margin-bottom:20px; border:1px solid var(--border-color);">
          <h4 style="font-size:0.85rem; color:var(--terracotta); margin-bottom:6px;"><i class="fa-solid fa-shield-check"></i> Package Features & Warranty:</h4>
          <ul class="feature-list" style="margin:0;">
            ${(p.features || []).map(f => `<li><i class="fa-solid fa-check"></i> ${escapeHtml(f)}</li>`).join("")}
            <li><i class="fa-solid fa-check"></i> 100% Replacement Warranty & WhatsApp Support</li>
          </ul>
        </div>

        <button class="btn btn-block btn-primary" onclick="app.buyNow('${p.slug}')">
          <i class="fa-solid fa-cart-shopping"></i> Proceed to Checkout (${this.formatPrice(this.activeVariant.sale_price || this.activeVariant.price)})
        </button>
      </div>
    `;

    document.getElementById("product-modal").classList.add("active");
  }

  selectVariant(idx, el) {
    if (!this.activeProduct || !this.activeProduct.variants) return;
    this.activeVariant = this.activeProduct.variants[idx];
    document.querySelectorAll("#modal-product-content .payment-chip").forEach(c => c.classList.remove("active"));
    el.classList.add("active");
  }

  buyNow(slug) {
    this.closeModal("product-modal");
    this.cart = [{
      product: this.activeProduct,
      variant: this.activeVariant
    }];
    this.openCheckoutModal();
  }

  openCheckoutModal() {
    const listEl = document.getElementById("checkout-items-list");
    const totalEl = document.getElementById("checkout-total-price");

    let total = 0;
    listEl.innerHTML = this.cart.map(item => {
      const price = item.variant.sale_price || item.variant.price || item.product.price;
      total += price;
      return `
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.88rem;">
          <div>
            <strong>${escapeHtml(item.product.name)}</strong>
            <div style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(item.variant.title)}</div>
          </div>
          <strong class="text-success">${this.formatPrice(price)}</strong>
        </div>
      `;
    }).join("");

    totalEl.textContent = this.formatPrice(total);
    document.getElementById("checkout-modal").classList.add("active");
  }

  switchPaymentDetails(type) {
    document.querySelectorAll(".payment-chip").forEach(c => c.classList.remove("active"));
    event.target.closest(".payment-chip").classList.add("active");

    const box = document.getElementById("payment-instructions");
    if (type === "upi") {
      box.innerHTML = `
        <div class="instruction-row"><span>Account Name:</span><strong>KOBIRUL SOFTWARES INDIA</strong></div>
        <div class="instruction-row"><span>UPI ID:</span><strong id="pay-acc-number">kobirul@upi</strong><button class="copy-btn" onclick="app.copyText('kobirul@upi')">Copy UPI</button></div>
        <div style="margin-top:10px; text-align:center;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=kobirul@upi&pn=KobirulSoftwares" alt="UPI QR Code" style="width:120px; height:120px; border-radius:8px; margin:0 auto; display:block; border:1px solid var(--border-color);">
          <small style="color:var(--text-muted); font-size:0.75rem; margin-top:4px; display:block;">Scan with GPay, PhonePe, Paytm, or BHIM app</small>
        </div>
      `;
    } else {
      box.innerHTML = `
        <div class="instruction-row"><span>Bank Name:</span><strong>HDFC Bank Ltd</strong></div>
        <div class="instruction-row"><span>Account Name:</span><strong>KOBIRUL SOFTWARES PRIVATE LIMITED</strong></div>
        <div class="instruction-row"><span>Account Number:</span><strong>50200012345678</strong></div>
        <div class="instruction-row"><span>IFSC Code:</span><strong>HDFC0001234</strong><button class="copy-btn" onclick="app.copyText('HDFC0001234')">Copy IFSC</button></div>
      `;
    }
  }

  submitOrder() {
    const name = document.getElementById("cust-name").value.trim();
    const email = document.getElementById("cust-email").value.trim();
    const phone = document.getElementById("cust-phone").value.trim();

    if (!name || !email || !phone) {
      alert("Please fill in your Name, Email, and WhatsApp number.");
      return;
    }

    const orderId = "KS-" + Math.floor(1000 + Math.random() * 9000);
    const item = this.cart[0];
    const totalAmount = item.variant.sale_price || item.variant.price || item.product.price;

    const newOrder = {
      id: orderId,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      product_name: item.product.name,
      variant: item.variant.title,
      total_amount: totalAmount,
      payment_method: document.querySelector('input[name="pay-method"]:checked').value,
      payment_status: "under_verification",
      fulfillment_status: "pending",
      credentials: null,
      created_at: new Date().toISOString()
    };

    supabaseService.saveOrder(newOrder);

    this.closeModal("checkout-modal");
    this.showReceipt(newOrder);

    this.renderAdminOrders();
    this.renderCustomerOrders();
  }

  showReceipt(order) {
    const content = document.getElementById("receipt-modal-content");
    content.innerHTML = `
      <div style="text-align:center; padding:16px 0;">
        <i class="fa-solid fa-circle-check text-success" style="font-size:3.2rem; margin-bottom:12px;"></i>
        <h2 style="color:var(--text-main);">Payment Screenshot Received!</h2>
        <p style="color:var(--text-muted); font-size:0.88rem;">Order Reference ID: <strong class="text-terracotta">${escapeHtml(order.id)}</strong></p>
      </div>

      <div class="payment-instructions-box" style="margin:16px 0;">
        <div class="instruction-row"><span>Customer:</span><strong>${escapeHtml(order.customer_name)} (${escapeHtml(order.customer_email)})</strong></div>
        <div class="instruction-row"><span>Product:</span><strong>${escapeHtml(order.product_name)}</strong></div>
        <div class="instruction-row"><span>Plan:</span><strong>${escapeHtml(order.variant)}</strong></div>
        <div class="instruction-row"><span>Total Paid:</span><strong class="text-success">${this.formatPrice(order.total_amount)}</strong></div>
        <div class="instruction-row"><span>Verification Status:</span><span class="status-badge status-pending">Under Verification</span></div>
      </div>

      <p style="font-size:0.83rem; color:var(--text-muted); text-align:center; margin-bottom:18px;">
        Our team is verifying your payment screenshot. Account login details will be dispatched to <strong>${escapeHtml(order.customer_email)}</strong> and updated in your Customer Dashboard within 5-10 minutes.
      </p>

      <button class="btn btn-block btn-primary" onclick="app.navigateToCustomerDashboard(); app.closeModal('receipt-modal');">
        <i class="fa-solid fa-user-check"></i> View My Customer Dashboard & Credentials
      </button>
    `;
    document.getElementById("receipt-modal").classList.add("active");
  }

  approveOrder(orderId) {
    if (!supabaseService.isAdminLoggedIn()) {
      alert("Unauthorized action. Admin session required.");
      window.location.hash = "#admin-login-1";
      this.switchView("admin-login");
      return;
    }

    const mockCreds = {
      email: "activated.user." + Math.floor(Math.random() * 100) + "@kobirul.com",
      password: "KobirulKey#" + Math.floor(100000 + Math.random() * 900000),
      notes: "Official license key assigned and verified by admin."
    };

    supabaseService.updateOrderStatus(orderId, "fulfilled", mockCreds);
    alert(`Order ${orderId} has been approved! Credentials dispatched to customer dashboard.`);

    this.renderAdminOrders();
    this.renderCustomerOrders();
  }

  startSocialProofToasts() {
    const names = ["Rohan from Mumbai", "Ananya from Bengaluru", "Amit from Delhi", "Priya from Hyderabad", "Vikram from Pune", "Sneha from Kolkata"];
    const tools = ["Adobe Creative Cloud", "Canva Pro 1 Year", "ChatGPT Plus", "Claude Pro 3.5", "Midjourney v6", "GitHub Copilot Pro"];

    setInterval(() => {
      const toast = document.getElementById("social-toast");
      if (!toast) return;
      const name = names[Math.floor(Math.random() * names.length)];
      const tool = tools[Math.floor(Math.random() * tools.length)];

      document.getElementById("toast-name").textContent = name;
      document.getElementById("toast-action").innerHTML = `just activated <strong>${tool}</strong>`;

      toast.classList.add("show");

      setTimeout(() => {
        toast.classList.remove("show");
      }, 5000);
    }, 14000);
  }

  switchView(viewName) {
    document.querySelectorAll(".main-view").forEach(v => v.classList.remove("active"));
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));

    if (viewName === 'admin-login') {
      renderAdminLogin(this);
    } else if (viewName === 'admin') {
      if (!supabaseService.isAdminLoggedIn()) {
        renderAdminLogin(this);
        viewName = 'admin-login';
      } else {
        renderAdminERP(this);
      }
    } else if (viewName === 'dashboard') {
      renderCustomerPortal(this);
    }

    document.getElementById(`view-${viewName}`)?.classList.add("active");
    if (document.getElementById(`nav-${viewName}`)) {
      document.getElementById(`nav-${viewName}`).classList.add("active");
    }

    this.closeMobileDrawer();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove("active");
  }

  copyText(text) {
    navigator.clipboard.writeText(text);
    alert(`Copied to clipboard: ${text}`);
  }
}

window.app = new KobirulProductionApp();
