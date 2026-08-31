// ==============================================================================
// KOBIRUL SOFTWARES - CORE APPLICATION LOGIC
// ==============================================================================

class App {
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
    // Apply initial theme
    document.documentElement.className = this.theme;

    // Load catalog data
    const data = await window.supabaseService.fetchCatalog();
    if (data) {
      this.catalog = data.products || [];
      this.bundles = data.bundles || [];
    }

    this.renderProducts();
    this.renderAdminOrders();
    this.renderCustomerOrders();
    this.startSocialProofToasts();
  }

  // Theme Toggler (Light / Dark)
  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
    document.documentElement.className = this.theme;
    localStorage.setItem("kobirul_theme", this.theme);
  }

  // INR Currency Formatter
  formatPrice(inrAmount) {
    return `₹${Number(inrAmount).toLocaleString('en-IN')}`;
  }

  // Category & Search Filters
  filterByCategory(cat) {
    this.currentCategory = cat;
    
    document.querySelectorAll(".cat-chip").forEach(btn => {
      btn.classList.toggle("active", btn.textContent.trim().includes(cat) || (cat === "All" && btn.textContent.includes("All")));
    });

    this.renderProducts();
  }

  filterProducts() {
    this.renderProducts();
  }

  renderProducts() {
    const grid = document.getElementById("products-grid");
    const searchQuery = (document.getElementById("global-search").value || "").toLowerCase();

    let itemsToRender = [];

    if (this.currentCategory === "Bundles") {
      itemsToRender = this.bundles.map(b => ({
        ...b,
        category: "Value Bundle",
        features: ["Multi-tool Access", "Instant Bundle Activation", "Maximum Discount"]
      }));
    } else {
      itemsToRender = this.catalog.filter(p => {
        const matchesCategory = this.currentCategory === "All" || p.category === this.currentCategory;
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

      const featuresHtml = (p.features || []).slice(0, 3).map(f => `
        <li><i class="fa-solid fa-circle-check"></i> ${f}</li>
      `).join("");

      return `
        <div class="product-card">
          <div class="product-img-wrap">
            <img src="${p.image_url}" alt="${p.name}" class="product-img">
            ${p.badge ? `<span class="badge-tag">${p.badge}</span>` : ""}
          </div>
          <div class="product-body">
            <span class="product-category">${p.category}</span>
            <h3 class="product-title">${p.name}</h3>
            <p class="product-desc">${p.description}</p>
            <ul class="feature-list">
              ${featuresHtml}
            </ul>
            <div class="product-footer">
              <div class="price-box">
                ${strikePrice ? `<span class="strike-price">${this.formatPrice(strikePrice)}</span>` : ""}
                <span class="current-price">${this.formatPrice(currentPrice)}</span>
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

  // Open Product Modal
  openProductModal(slug) {
    let p = this.catalog.find(item => item.slug === slug);
    if (!p) p = this.bundles.find(item => item.slug === slug);
    if (!p) return;

    this.activeProduct = p;
    this.activeVariant = p.variants ? p.variants[0] : { title: "Standard Activation", price: p.sale_price || p.price };

    const content = document.getElementById("modal-product-content");

    const variantsHtml = (p.variants || []).map((v, idx) => `
      <label class="payment-chip ${idx === 0 ? 'active' : ''}" style="text-align:left; justify-content:space-between; flex:1;" onclick="app.selectVariant(${idx}, this)">
        <div>
          <strong>${v.title}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${v.type || 'Personal License'}</div>
        </div>
        <div style="text-align:right;">
          <strong class="text-success">${this.formatPrice(v.sale_price || v.price)}</strong>
        </div>
      </label>
    `).join("");

    content.innerHTML = `
      <div style="grid-column: 1/-1;">
        <div style="display:flex; gap:16px; align-items:center; margin-bottom:18px;">
          <img src="${p.image_url}" style="width:80px; height:80px; border-radius:var(--radius-md); object-fit:cover;">
          <div>
            <span class="product-category">${p.category}</span>
            <h2 style="font-size:1.5rem; color:var(--text-main);">${p.name}</h2>
            <div style="color:var(--warning); font-weight:700; font-size:0.85rem; margin-top:2px;">
              <i class="fa-solid fa-star"></i> ${p.rating_avg || 4.9} (${p.rating_count || 320}+ Verified Ratings)
            </div>
          </div>
        </div>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:20px;">${p.description}</p>
        
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
            ${(p.features || []).map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join("")}
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
            <strong>${item.product.name}</strong>
            <div style="font-size:0.75rem; color:var(--text-muted);">${item.variant.title}</div>
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

    window.supabaseService.saveOrder(newOrder);

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
        <p style="color:var(--text-muted); font-size:0.88rem;">Order Reference ID: <strong class="text-terracotta">${order.id}</strong></p>
      </div>

      <div class="payment-instructions-box" style="margin:16px 0;">
        <div class="instruction-row"><span>Customer:</span><strong>${order.customer_name} (${order.customer_email})</strong></div>
        <div class="instruction-row"><span>Product:</span><strong>${order.product_name}</strong></div>
        <div class="instruction-row"><span>Plan:</span><strong>${order.variant}</strong></div>
        <div class="instruction-row"><span>Total Paid:</span><strong class="text-success">${this.formatPrice(order.total_amount)}</strong></div>
        <div class="instruction-row"><span>Verification Status:</span><span class="status-badge status-pending">Under Verification</span></div>
      </div>

      <p style="font-size:0.83rem; color:var(--text-muted); text-align:center; margin-bottom:18px;">
        Our team is verifying your payment screenshot. Account login details will be dispatched to <strong>${order.customer_email}</strong> and updated in your Customer Dashboard within 5-10 minutes.
      </p>

      <button class="btn btn-block btn-primary" onclick="app.switchView('dashboard'); app.closeModal('receipt-modal');">
        <i class="fa-solid fa-user-check"></i> View My Customer Dashboard & Credentials
      </button>
    `;
    document.getElementById("receipt-modal").classList.add("active");
  }

  // Render Customer Dashboard
  renderCustomerOrders() {
    const listEl = document.getElementById("customer-orders-list");
    const orders = window.supabaseService.getOrders();

    if (orders.length === 0) {
      listEl.innerHTML = `<p style="color:var(--text-muted);">No active subscriptions found.</p>`;
      return;
    }

    listEl.innerHTML = orders.map((o, idx) => `
      <div style="background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div>
            <strong style="font-size:1.05rem; color:var(--text-main);">${o.product_name}</strong>
            <div style="font-size:0.78rem; color:var(--text-muted);">${o.variant} • ${new Date(o.created_at).toLocaleDateString('en-IN')}</div>
          </div>
          <span class="status-badge ${o.fulfillment_status === 'fulfilled' ? 'status-paid' : 'status-pending'}">
            ${o.fulfillment_status === 'fulfilled' ? 'Active / Delivered' : 'Under Verification'}
          </span>
        </div>

        ${o.credentials ? `
          <div style="background:var(--bg-card); padding:12px; border-radius:var(--radius-sm); border:1px dashed var(--success); margin-top:10px;">
            <div style="font-size:0.78rem; color:var(--success); font-weight:700; margin-bottom:4px;"><i class="fa-solid fa-key"></i> Active Credentials:</div>
            <div style="display:flex; gap:16px; flex-wrap:wrap; font-size:0.83rem;">
              <div><span>Email / Account:</span> <strong>${o.credentials.email}</strong></div>
              <div><span>Password / Key:</span> 
                <span id="pass-${idx}" style="filter:blur(4px); transition:all 0.3s; cursor:pointer;" onclick="this.style.filter='none'">
                  ${o.credentials.password}
                </span>
                <small style="color:var(--terracotta); cursor:pointer;" onclick="document.getElementById('pass-${idx}').style.filter='none'">(Click to reveal)</small>
              </div>
            </div>
            ${o.credentials.notes ? `<div style="font-size:0.78rem; color:var(--text-muted); margin-top:4px;">Note: ${o.credentials.notes}</div>` : ''}
          </div>
        ` : `
          <div style="font-size:0.78rem; color:var(--text-muted); margin-top:6px;">
            <i class="fa-solid fa-hourglass-half text-warning"></i> Payment verification in progress. Credentials will appear here upon admin approval.
          </div>
        `}
      </div>
    `).join("");
  }

  // Render Admin ERP Table
  renderAdminOrders() {
    const tableEl = document.getElementById("admin-orders-table");
    const orders = window.supabaseService.getOrders();

    tableEl.innerHTML = `
      <table class="orders-table">
        <thead>
          <tr>
            <th>Order Ref</th>
            <th>Customer</th>
            <th>Product & Plan</th>
            <th>Amount (INR)</th>
            <th>Method</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(o => `
            <tr>
              <td><strong>${o.id}</strong></td>
              <td>${o.customer_name}<br><small style="color:var(--text-dim);">${o.customer_email}</small></td>
              <td>${o.product_name}<br><small style="color:var(--text-muted);">${o.variant}</small></td>
              <td class="text-success"><strong>${this.formatPrice(o.total_amount)}</strong></td>
              <td style="text-transform:uppercase;">${o.payment_method}</td>
              <td>
                <span class="status-badge ${o.fulfillment_status === 'fulfilled' ? 'status-paid' : 'status-pending'}">
                  ${o.fulfillment_status}
                </span>
              </td>
              <td>
                ${o.fulfillment_status !== 'fulfilled' ? `
                  <button class="btn btn-sm btn-primary" onclick="app.approveOrder('${o.id}')">
                    <i class="fa-solid fa-check"></i> Approve & Deliver
                  </button>
                ` : `<span class="text-success" style="font-size:0.78rem;"><i class="fa-solid fa-circle-check"></i> Delivered</span>`}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    document.getElementById("admin-pending-count").textContent = orders.filter(o => o.fulfillment_status !== "fulfilled").length;
    document.getElementById("admin-fulfilled-count").textContent = orders.filter(o => o.fulfillment_status === "fulfilled").length;
  }

  approveOrder(orderId) {
    const mockCreds = {
      email: "activated.user." + Math.floor(Math.random() * 100) + "@kobirul.com",
      password: "KobirulKey#" + Math.floor(100000 + Math.random() * 900000),
      notes: "Official license key assigned and verified by admin."
    };

    window.supabaseService.updateOrderStatus(orderId, "fulfilled", mockCreds);
    alert(`Order ${orderId} has been approved! Credentials dispatched to customer dashboard.`);

    this.renderAdminOrders();
    this.renderCustomerOrders();
  }

  // Floating Social Proof Notifications
  startSocialProofToasts() {
    const names = ["Rohan from Mumbai", "Ananya from Bengaluru", "Amit from Delhi", "Priya from Hyderabad", "Vikram from Pune", "Sneha from Kolkata"];
    const tools = ["Adobe Creative Cloud", "Canva Pro 1 Year", "ChatGPT Plus", "Claude Pro 3.5", "Midjourney v6", "GitHub Copilot Pro"];

    setInterval(() => {
      const toast = document.getElementById("social-toast");
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

  // View Switcher
  switchView(viewName) {
    document.querySelectorAll(".main-view").forEach(v => v.classList.remove("active"));
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));

    document.getElementById(`view-${viewName}`).classList.add("active");
    if (document.getElementById(`nav-${viewName}`)) {
      document.getElementById(`nav-${viewName}`).classList.add("active");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  closeModal(modalId) {
    document.getElementById(modalId).classList.remove("active");
  }

  copyText(text) {
    navigator.clipboard.writeText(text);
    alert(`Copied to clipboard: ${text}`);
  }
}

window.app = new App();
