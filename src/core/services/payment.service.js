/**
 * payment.service.js — Phase 7 hardened payment API calls.
 * Phase 7.2: verifyUserPayment sends idempotency key as header.
 */
import axiosInstance from '../config/axiosInstance';

class PaymentService {
  getRazorpayKey() {
    return axiosInstance.get('/payments/razorpay-key');
  }

  purchaseCourseBundle() {
    return axiosInstance.post('/payments/subscribe');
  }

  /**
   * Phase 7.2: accepts an idempotency key and sends it as `Idempotency-Key` header.
   * The backend will de-duplicate retries using this key.
   */
  verifyUserPayment(paymentData, idempotencyKey = null) {
    const headers = {};
    if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
    return axiosInstance.post('/payments/verify', paymentData, { headers });
  }

  getPaymentRecord() {
    return axiosInstance.get('/payments?count=100');
  }

  cancelCourseBundle() {
    return axiosInstance.post('/payments/unsubscribe');
  }
}

export default new PaymentService();
