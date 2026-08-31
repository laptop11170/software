// ==============================================================================
// KOBIRUL SOFTWARES - DUAL SEPARATED AUTHENTICATION SERVICE
// ==============================================================================

import { escapeHtml } from '../utils/security.js';

export class SupabaseClientService {
  constructor() {
    this.supabaseUrl = window.VITE_SUPABASE_URL || "https://tkfzwivbvidwbpshnwph.supabase.co";
    this.anonKey = window.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
    
    // 2 SEPARATE SESSIONS
    this.customerUser = JSON.parse(localStorage.getItem("kobirul_customer_session")) || null;
    this.adminUser = JSON.parse(localStorage.getItem("kobirul_admin_session")) || null;
  }

  // Customer Auth Methods
  getCurrentCustomer() {
    return this.customerUser;
  }

  isCustomerLoggedIn() {
    return this.customerUser !== null;
  }

  customerLogin(email, password) {
    if (!email || !password) {
      return { success: false, message: "Email and password are required." };
    }

    this.customerUser = {
      email: escapeHtml(email),
      role: "customer",
      token: "cust_token_" + Math.random().toString(36).substring(2),
      loginTime: new Date().toISOString()
    };

    localStorage.setItem("kobirul_customer_session", JSON.stringify(this.customerUser));
    return { success: true, user: this.customerUser };
  }

  customerLogout() {
    this.customerUser = null;
    localStorage.removeItem("kobirul_customer_session");
  }

  // Admin Dedicated Auth Methods
  getCurrentAdmin() {
    return this.adminUser;
  }

  isAdminLoggedIn() {
    return this.adminUser !== null && this.adminUser.role === "admin";
  }

  adminLogin(email, password) {
    if (email === "admin@kobirul.com" && password === "admin123") {
      this.adminUser = {
        email: escapeHtml(email),
        role: "admin",
        token: "admin_secure_token_" + Math.random().toString(36).substring(2),
        loginTime: new Date().toISOString()
      };

      localStorage.setItem("kobirul_admin_session", JSON.stringify(this.adminUser));
      return { success: true, user: this.adminUser };
    }
    return { success: false, message: "Invalid Administrator credentials." };
  }

  adminLogout() {
    this.adminUser = null;
    localStorage.removeItem("kobirul_admin_session");
  }

  // Catalog Loader (With Vercel Path Resiliency)
  async getCatalog() {
    const paths = ["public/data/catalog.json", "./public/data/catalog.json", "/public/data/catalog.json"];
    for (const path of paths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        // try next path
      }
    }
    console.warn("[Kobirul SDK] Unable to fetch catalog.json");
    return { products: [], bundles: [] };
  }

  // Retrieve stored customer & admin orders
  getOrders() {
    const data = localStorage.getItem("kobirul_orders");
    if (!data) {
      return [
        {
          id: "KS-1092",
          customer_name: "Rahul Sharma",
          customer_email: "rahul.sharma@gmail.com",
          customer_phone: "+91 98765 43210",
          product_name: "Adobe Creative Cloud All Apps",
          variant: "1 Year Full Plan",
          total_amount: 3999,
          payment_method: "upi",
          payment_status: "paid",
          fulfillment_status: "fulfilled",
          credentials: {
            email: "rahul.adobe.license@kobirul.com",
            password: "Adobe#TeamInvite2026",
            notes: "Check your email inbox for official Adobe Team invite link."
          },
          created_at: new Date(Date.now() - 3600000 * 4).toISOString()
        },
        {
          id: "KS-1093",
          customer_name: "Ananya Iyer",
          customer_email: "ananya.iyer@gmail.com",
          customer_phone: "+91 98123 45678",
          product_name: "Claude Pro (Anthropic AI)",
          variant: "1 Month Shared Profile",
          total_amount: 599,
          payment_method: "upi",
          payment_status: "under_verification",
          fulfillment_status: "pending",
          credentials: null,
          created_at: new Date(Date.now() - 1200000).toISOString()
        }
      ];
    }
    return JSON.parse(data);
  }

  saveOrder(order) {
    const sanitizedOrder = {
      ...order,
      customer_name: escapeHtml(order.customer_name),
      customer_email: escapeHtml(order.customer_email),
      customer_phone: escapeHtml(order.customer_phone),
      product_name: escapeHtml(order.product_name),
      variant: escapeHtml(order.variant)
    };

    const orders = this.getOrders();
    orders.unshift(sanitizedOrder);
    localStorage.setItem("kobirul_orders", JSON.stringify(orders));
    return sanitizedOrder;
  }

  updateOrderStatus(orderId, status, credentials = null) {
    if (!this.isAdminLoggedIn()) {
      throw new Error("Unauthorized action. Admin session required.");
    }

    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].payment_status = status === "fulfilled" ? "paid" : status;
      orders[idx].fulfillment_status = status;
      if (credentials) {
        orders[idx].credentials = credentials;
      }
      localStorage.setItem("kobirul_orders", JSON.stringify(orders));
    }
    return orders;
  }
}

export const supabaseService = new SupabaseClientService();
window.supabaseService = supabaseService;
