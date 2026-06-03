import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import superAdminService from "../../../core/services/superAdmin.service";
import toast from "react-hot-toast";

const initialState = {
  data: {},
};

export const getLearnerDashboardData = createAsyncThunk(
  "/dashboard/learner",
  async () => {
    try {
      const response = await superAdminService.getLearnerDashboardData();
      toast.promise(Promise.resolve(response), {
        loading: "Loading dashboard data...",
        success: "Dashboard loaded successfully",
        error: "Failed to load dashboard data",
      });
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLearnerDashboardData.fulfilled, (state, action) => {
      if (action.payload) {
        state.data = action.payload.data;
      }
    });
  },
});

export default dashboardSlice.reducer;
