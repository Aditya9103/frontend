/**
 * phase5.payments.test.jsx
 *
 * Frontend Vitest Suite for Phase 5:
 *  - 5.1 RazorpaySlice State Machine & Action Reducers
 *  - 5.2 PaymentService HTTP & Idempotency Header Integration
 *  - 5.3 Asynchronous Verification & Enrollment Confirmation
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

import razorpayReducer, {
  PAYMENT_STATUS,
  getRazorPayId,
  purchaseCourseBundle,
  verifyUserPayment,
  getPaymentRecord,
  cancelCourseBundle,
  setIdempotencyKey,
  setPaymentStatus,
  resetPayment,
  confirmEnrollment,
} from '../redux/RazorpaySlice';
import paymentService from '../../../core/services/payment.service';
import axiosInstance from '../../../core/config/axiosInstance';

vi.mock('../../../core/config/axiosInstance', () => {
  const instance = vi.fn();
  instance.get = vi.fn();
  instance.post = vi.fn();
  instance.delete = vi.fn();
  instance.put = vi.fn();
  return { default: instance };
});

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

describe('=== Phase 5 Frontend: Payment Gateway, Webhooks & Idempotency ===', () => {
  describe('5.1 RazorpaySlice State Machine', () => {
    let store;

    beforeEach(() => {
      store = configureStore({
        reducer: {
          razorpay: razorpayReducer,
        },
      });
    });

    it('initializes in IDLE status with empty keys and unverified flag', () => {
      const state = store.getState().razorpay;
      expect(state.status).toBe(PAYMENT_STATUS.IDLE);
      expect(state.key).toBe('');
      expect(state.subscription_id).toBe('');
      expect(state.isPaymentVerified).toBe(false);
      expect(state.idempotencyKey).toBeNull();
    });

    it('handles getRazorPayId.fulfilled by updating razorpay key', () => {
      store.dispatch({
        type: getRazorPayId.fulfilled.type,
        payload: { key: 'rzp_test_public_key_12345' },
      });

      const state = store.getState().razorpay;
      expect(state.key).toBe('rzp_test_public_key_12345');
    });

    it('transitions status: IDLE -> INITIATING -> PAYMENT_OPEN on subscription purchase', () => {
      // 1. Pending
      store.dispatch({ type: purchaseCourseBundle.pending.type });
      expect(store.getState().razorpay.status).toBe(PAYMENT_STATUS.INITIATING);

      // 2. Fulfilled
      store.dispatch({
        type: purchaseCourseBundle.fulfilled.type,
        payload: { subscription_id: 'sub_rzp_mock_888' },
      });
      const state = store.getState().razorpay;
      expect(state.status).toBe(PAYMENT_STATUS.PAYMENT_OPEN);
      expect(state.subscription_id).toBe('sub_rzp_mock_888');
    });

    it('transitions to FAILED on purchase rejection', () => {
      store.dispatch({ type: purchaseCourseBundle.rejected.type });
      expect(store.getState().razorpay.status).toBe(PAYMENT_STATUS.FAILED);
    });

    it('transitions to CONFIRMING on verifyUserPayment.pending', () => {
      store.dispatch({ type: verifyUserPayment.pending.type });
      expect(store.getState().razorpay.status).toBe(PAYMENT_STATUS.CONFIRMING);
    });

    it('transitions to ENROLLED and sets isPaymentVerified to true on confirmEnrollment', () => {
      store.dispatch(confirmEnrollment());
      const state = store.getState().razorpay;
      expect(state.status).toBe(PAYMENT_STATUS.ENROLLED);
      expect(state.isPaymentVerified).toBe(true);
    });

    it('manages idempotency key and full state reset cleanly', () => {
      store.dispatch(setIdempotencyKey('idem_unique_test_uuid'));
      expect(store.getState().razorpay.idempotencyKey).toBe('idem_unique_test_uuid');

      store.dispatch(resetPayment());
      const state = store.getState().razorpay;
      expect(state.status).toBe(PAYMENT_STATUS.IDLE);
      expect(state.idempotencyKey).toBeNull();
      expect(state.subscription_id).toBe('');
      expect(state.isPaymentVerified).toBe(false);
    });
  });

  describe('5.2 PaymentService API Layer & Idempotency Header', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('getRazorpayKey sends GET to /payments/razorpay-key', async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: { success: true, data: { key: 'rzp_live_k1' } } });
      const res = await paymentService.getRazorpayKey();
      expect(axiosInstance.get).toHaveBeenCalledWith('/payments/razorpay-key');
      expect(res.data.data.key).toBe('rzp_live_k1');
    });

    it('purchaseCourseBundle sends POST to /payments/subscribe', async () => {
      axiosInstance.post.mockResolvedValueOnce({
        data: { success: true, data: { subscription_id: 'sub_123' } },
      });
      const res = await paymentService.purchaseCourseBundle();
      expect(axiosInstance.post).toHaveBeenCalledWith('/payments/subscribe');
      expect(res.data.data.subscription_id).toBe('sub_123');
    });

    it('verifyUserPayment attaches Idempotency-Key header when provided', async () => {
      const paymentData = {
        razorpay_payment_id: 'pay_001',
        razorpay_subscription_id: 'sub_001',
        razorpay_signature: 'sig_001',
      };
      const idempotencyKey = 'uuid-idem-key-777';

      axiosInstance.post.mockResolvedValueOnce({
        data: { success: true, message: 'Payment verified successfully' },
      });

      await paymentService.verifyUserPayment(paymentData, idempotencyKey);

      expect(axiosInstance.post).toHaveBeenCalledWith(
        '/payments/verify',
        paymentData,
        { headers: { 'Idempotency-Key': 'uuid-idem-key-777' } }
      );
    });

    it('cancelCourseBundle sends POST to /payments/unsubscribe', async () => {
      axiosInstance.post.mockResolvedValueOnce({
        data: { success: true, message: 'Subscription canceled successfully' },
      });
      await paymentService.cancelCourseBundle();
      expect(axiosInstance.post).toHaveBeenCalledWith('/payments/unsubscribe');
    });

    it('getPaymentRecord sends GET to /payments?count=100', async () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: { success: true, data: { allPayments: { count: 5 } } },
      });
      const res = await paymentService.getPaymentRecord();
      expect(axiosInstance.get).toHaveBeenCalledWith('/payments?count=100');
      expect(res.data.data.allPayments.count).toBe(5);
    });
  });
});
