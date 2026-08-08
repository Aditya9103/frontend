import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import superAdminService from "../../../core/services/superAdmin.service";

const initialState = {
  data: {},
};

export const getLearnerDashboardData = createAsyncThunk(
  "/dashboard/learner",
  async () => {
    try {
      const response = await superAdminService.getLearnerDashboardData();
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || 'Failed to load dashboard data');
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
        // thunk now returns res.data.data directly (the payload object)
        state.data = action.payload;
      }
    });
  },
});

export default dashboardSlice.reducer;
