import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
    learnerData: null,
    loading: false,
};

export const getLearnerDashboardData = createAsyncThunk("/dashboard/learner", async () => {
    try {
        const response = axiosInstance.get("/dashboard/learner");
        toast.promise(response, {
            loading: "Loading dashboard data...",
            success: (res) => res.data.message,
            error: "Failed to load dashboard data",
        });
        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getLearnerDashboardData.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getLearnerDashboardData.fulfilled, (state, action) => {
            state.learnerData = action.payload?.data;
            state.loading = false;
        });
        builder.addCase(getLearnerDashboardData.rejected, (state) => {
            state.loading = false;
        });
    }
});

export default dashboardSlice.reducer;
