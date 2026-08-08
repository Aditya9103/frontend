import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"

import paymentService from "../../../core/services/payment.service";

const initialState = {
    key: "",
    subscription_id: "",
    isPaymentVerified: false,
    allPayments: {},
    finalMonths: {},
    monthlySalesRecord: []
}

export const getRazorPayId = createAsyncThunk("/razorpay/getId", async () => {
    try {
        const response = await paymentService.getRazorpayKey();
        return response.data.data;
    } catch(error) {
        toast.error(error?.response?.data?.error?.message || 'Failed to load payment key');
    }
})


export const purchaseCourseBundle = createAsyncThunk("/purchaseCourse", async () => {
    try {
        const response = await paymentService.purchaseCourseBundle();
        return response.data.data;
    } catch(error) {
        toast.error(error?.response?.data?.error?.message || 'Failed to initiate payment');
    }
});

export const verifyUserPayment = createAsyncThunk("/payments/verify", async (data) => {
    try {
        const response = await paymentService.verifyUserPayment({
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_signature: data.razorpay_signature,
            razorpay_subscription_id: data.razorpay_subscription_id
        });
        return response.data.data;
    } catch(error) {
        toast.error(error?.response?.data?.error?.message || 'Payment verification failed');
    }
});

export const getPaymentRecord = createAsyncThunk("/payments/record", async () => {
    try {
        const response = await paymentService.getPaymentRecord();
        return response.data.data;
    } catch(error) {
        toast.error(error?.response?.data?.error?.message || 'Failed to load payment records');
    }
});

export const cancelCourseBundle = createAsyncThunk("/payments/cancel", async () => {
    try {
        const response = await paymentService.cancelCourseBundle();
        toast.success('Subscription cancelled successfully');
        return response.data.data;
    } catch(error) {
        toast.error(error?.response?.data?.error?.message || 'Failed to cancel subscription');
    }
});

const razorpaySlice = createSlice({
    name: "razorpay",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getRazorPayId.fulfilled, (state, action) => {
            state.key = action?.payload?.key;
        })
        .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
            state.subscription_id = action?.payload?.subscription_id;
        })
        .addCase(verifyUserPayment.fulfilled, (state, action) => {
            toast.success('Payment verified successfully');
            state.isPaymentVerified = action?.payload?.success ?? true;
        })
        .addCase(verifyUserPayment.rejected, (state) => {
            state.isPaymentVerified = false;
        })
        .addCase(getPaymentRecord.fulfilled, (state, action) => {
            state.allPayments = action?.payload?.allPayments;
            state.finalMonths = action?.payload?.finalMonths;
            state.monthlySalesRecord = action?.payload?.monthlySalesRecord;
        })
    }
});

export default razorpaySlice.reducer;