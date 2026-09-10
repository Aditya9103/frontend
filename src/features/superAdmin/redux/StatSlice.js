import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import superAdminService from "../../../core/services/superAdmin.service";

const initialState = {
  allUsersCount: 0,
  subscribedCount: 0,
};

export const getStatsData = createAsyncThunk("stat/get", async (_, { rejectWithValue }) => {
  try {
    const response = await superAdminService.getStatsData();
    return response.data?.data ?? response.data;
  } catch (error) {
    const message = error?.response?.data?.error?.message || 'Failed to load stats';
    toast.error(message);
    return rejectWithValue(message);
  }
});

const statSlice = createSlice({
  name: "stat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStatsData.fulfilled, (state, action) => {
      if (action.payload) {
        state.allUsersCount = action.payload.allUsersCount ?? 0;
        state.subscribedCount = action.payload.subscribedUsersCount ?? 0;
      }
    });
  },
});

export default statSlice.reducer;