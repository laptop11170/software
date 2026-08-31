// ==============================================================================
// KOBIRUL SOFTWARES - PRODUCTION PAYMENT SERVICE (RAZORPAY & UPI SDK)
// ==============================================================================

export class PaymentService {
  constructor() {
    this.upiId = "kobirul@upi";
    this.merchantName = "Kobirul Softwares";
    this.razorpayKey = window.VITE_RAZORPAY_KEY_ID || "rzp_live_demo_key";
  }

  // Trigger Razorpay Instant Checkout modal if SDK loaded
  initiateRazorpayPayment({ amountINR, orderId, customerName, customerEmail, customerPhone, onSuccess, onFailure }) {
    if (typeof window.Razorpay !== 'undefined') {
      const options = {
        key: this.razorpayKey,
        amount: amountINR * 100, // Amount in paise
        currency: "INR",
        name: this.merchantName,
        description: `License Activation - ${orderId}`,
        image: "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=KobirulSoftwares",
        handler: function (response) {
          onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: orderId,
            signature: response.razorpay_signature
          });
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone
        },
        theme: {
          color: "#da7756" // Claude Terracotta brand color
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        onFailure(response.error);
      });
      rzp.open();
      return true;
    } else {
      console.log("[Payment SDK] Razorpay SDK fallback to Manual UPI QR Code");
      return false;
    }
  }

  // Generate UPI Deep Link URL for GPay / PhonePe / Paytm mobile apps
  getUPIDeepLink(amountINR, orderId) {
    const note = encodeURIComponent(`Kobirul Order ${orderId}`);
    const name = encodeURIComponent(this.merchantName);
    return `upi://pay?pa=${this.upiId}&pn=${name}&am=${amountINR}&cu=INR&tn=${note}`;
  }
}

export const paymentService = new PaymentService();
window.paymentService = paymentService;
