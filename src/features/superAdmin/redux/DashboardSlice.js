import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import superAdminService from "../../../core/services/superAdmin.service";

const initialState = {
  data: {},
};

export const getLearnerDashboardData = createAsyncThunk(
  "/dashboard/learner",
  async (_, { rejectWithValue }) => {
    try {
      const response = await superAdminService.getLearnerDashboardData();
      return response.data?.data ?? response.data;
    } catch (error) {
      const message = error?.response?.data?.error?.message || 'Failed to load dashboard data';
      toast.error(message);
      return rejectWithValue(message);
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
