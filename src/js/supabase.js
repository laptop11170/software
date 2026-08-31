// ==============================================================================
// DSRQ DIGITALS - SUPABASE INTEGRATION LAYER
// ==============================================================================

class SupabaseService {
  constructor() {
    // Configurable Supabase credentials
    this.supabaseUrl = "https://tkfzwivbvidwbpshnwph.supabase.co";
    this.anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
    this.useLocalStorageFallback = true;
  }

  // Load Catalog Data from local catalog.json or Supabase REST endpoint
  async fetchCatalog() {
    try {
      const response = await fetch("public/data/catalog.json");
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (e) {
      console.warn("Using fallback static catalog data:", e);
    }
    return null;
  }

  // Save Order to LocalStorage & Sync
  saveOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order);
    localStorage.setItem("dsrq_orders", JSON.stringify(orders));
    return order;
  }

  getOrders() {
    const data = localStorage.getItem("dsrq_orders");
    if (!data) {
      // Default mock orders
      return [
        {
          id: "ORD-9842",
          customer_name: "Ali Raza",
          customer_email: "ali.raza@gmail.com",
          customer_phone: "0301 2345678",
          product_name: "Adobe Creative Cloud All Apps",
          variant: "1 Year Full Plan",
          total_amount: 5999,
          payment_method: "easypaisa",
          payment_status: "paid",
          fulfillment_status: "fulfilled",
          credentials: {
            email: "ali.raza.adobe@gmail.com",
            password: "TeamInviteSent#2026",
            notes: "Check your email inbox for official Adobe Team invite link."
          },
          created_at: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
          id: "ORD-9843",
          customer_name: "Hamza Tariq",
          customer_email: "hamza.tariq@gmail.com",
          customer_phone: "0300 8765432",
          product_name: "ChatGPT Plus (GPT-4o)",
          variant: "1 Month Shared Profile",
          total_amount: 1299,
          payment_method: "jazzcash",
          payment_status: "under_verification",
          fulfillment_status: "pending",
          credentials: null,
          created_at: new Date(Date.now() - 1800000).toISOString()
        }
      ];
    }
    return JSON.parse(data);
  }

  updateOrderStatus(orderId, status, credentials = null) {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].payment_status = status === "fulfilled" ? "paid" : status;
      orders[idx].fulfillment_status = status;
      if (credentials) {
        orders[idx].credentials = credentials;
      }
      localStorage.setItem("dsrq_orders", JSON.stringify(orders));
    }
    return orders;
  }
}

window.supabaseService = new SupabaseService();
