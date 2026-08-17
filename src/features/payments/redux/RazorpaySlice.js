/**
 * RazorpaySlice.js — Phase 7 Payments state machine
 *
 * Payment status machine:
 *   idle → initiating → paymentOpen → confirming → enrolled | failed
 *
 * The `confirming` state is new in Phase 7 — it bridges the gap between
 * the Razorpay modal closing (paymentOpen) and the webhook-confirmed
 * enrollment (enrolled). The CheckoutSuccess page must wait in this state
 * before showing "you're enrolled".
 */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import paymentService from "../../../core/services/payment.service";

// ── Status machine values ──────────────────────────────────────────────────────
export const PAYMENT_STATUS = Object.freeze({
  IDLE:         'idle',
  INITIATING:   'initiating',
  PAYMENT_OPEN: 'paymentOpen',
  CONFIRMING:   'confirming',    // Phase 7: awaiting webhook/socket confirmation
  ENROLLED:     'enrolled',
  FAILED:       'failed',
});

const initialState = {
  key: "",
  subscription_id: "",
  status: PAYMENT_STATUS.IDLE,   // Phase 7 state machine
  isPaymentVerified: false,
  idempotencyKey: null,           // Phase 7: set before checkout
  allPayments: {},
  finalMonths: {},
  monthlySalesRecord: [],
};

// ── Thunks ─────────────────────────────────────────────────────────────────────

export const getRazorPayId = createAsyncThunk("/razorpay/getId", async () => {
  try {
    const response = await paymentService.getRazorpayKey();
    return response.data.data;
  } catch (error) {
    toast.error(error?.response?.data?.error?.message || 'Failed to load payment key');
    throw error;
  }
});

export const purchaseCourseBundle = createAsyncThunk("/purchaseCourse", async () => {
  try {
    const response = await paymentService.purchaseCourseBundle();
    return response.data.data;
  } catch (error) {
    toast.error(error?.response?.data?.error?.message || 'Failed to initiate payment');
    throw error;
  }
});

export const verifyUserPayment = createAsyncThunk(
  "/payments/verify",
  async ({ paymentData, idempotencyKey }) => {
    try {
      const response = await paymentService.verifyUserPayment(
        paymentData,
        idempotencyKey // Phase 7: passed as Idempotency-Key header in the service
      );
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || 'Payment verification failed');
      throw error;
    }
  }
);

export const getPaymentRecord = createAsyncThunk("/payments/record", async () => {
  try {
    const response = await paymentService.getPaymentRecord();
    return response.data.data;
  } catch (error) {
    toast.error(error?.response?.data?.error?.message || 'Failed to load payment records');
    throw error;
  }
});

export const cancelCourseBundle = createAsyncThunk("/payments/cancel", async () => {
  try {
    const response = await paymentService.cancelCourseBundle();
    toast.success('Subscription cancelled successfully');
    return response.data.data;
  } catch (error) {
    toast.error(error?.response?.data?.error?.message || 'Failed to cancel subscription');
    throw error;
  }
});

// ── Slice ──────────────────────────────────────────────────────────────────────

const razorpaySlice = createSlice({
  name: "razorpay",
  initialState,
  reducers: {
    setIdempotencyKey(state, action) {
      state.idempotencyKey = action.payload;
    },
    setPaymentStatus(state, action) {
      state.status = action.payload;
    },
    resetPayment(state) {
      state.status = PAYMENT_STATUS.IDLE;
      state.idempotencyKey = null;
      state.subscription_id = '';
      state.isPaymentVerified = false;
    },
    // Called when socket emits ENROLLMENT_CREATED
    confirmEnrollment(state) {
      state.status = PAYMENT_STATUS.ENROLLED;
      state.isPaymentVerified = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRazorPayId.fulfilled, (state, action) => {
        state.key = action?.payload?.key;
      })
      .addCase(purchaseCourseBundle.pending, (state) => {
        state.status = PAYMENT_STATUS.INITIATING;
      })
      .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
        state.subscription_id = action?.payload?.subscription_id;
        state.status = PAYMENT_STATUS.PAYMENT_OPEN;
      })
      .addCase(purchaseCourseBundle.rejected, (state) => {
        state.status = PAYMENT_STATUS.FAILED;
      })
      .addCase(verifyUserPayment.pending, (state) => {
        state.status = PAYMENT_STATUS.CONFIRMING; // Phase 7: awaiting webhook
      })
      .addCase(verifyUserPayment.fulfilled, (state) => {
        // Client verify recorded — waiting for webhook to confirm
        // Status stays CONFIRMING until socket fires ENROLLMENT_CREATED
        toast.success('Payment recorded. Confirming enrollment…');
      })
      .addCase(verifyUserPayment.rejected, (state) => {
        state.status = PAYMENT_STATUS.FAILED;
        state.isPaymentVerified = false;
      })
      .addCase(getPaymentRecord.fulfilled, (state, action) => {
        state.allPayments = action?.payload?.allPayments;
        state.finalMonths = action?.payload?.finalMonths;
        state.monthlySalesRecord = action?.payload?.monthlySalesRecord;
      });
  },
});

export const {
  setIdempotencyKey,
  setPaymentStatus,
  resetPayment,
  confirmEnrollment,
} = razorpaySlice.actions;

export default razorpaySlice.reducer;