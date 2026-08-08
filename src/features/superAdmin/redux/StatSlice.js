import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import superAdminService from "../../../core/services/superAdmin.service";

const initialState = {
  allUsersCount: 0,
  subscribedCount: 0,
};

export const getStatsData = createAsyncThunk("stat/get", async () => {
  try {
    const response = await superAdminService.getStatsData();
    return response.data.data;
  } catch (error) {
    toast.error(error?.response?.data?.error?.message || 'Failed to load stats');
  }
});

const statSlice = createSlice({
  name: "stat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStatsData.fulfilled, (state, action) => {
      // thunk now returns res.data.data directly
      state.allUsersCount = action?.payload?.allUsersCount;
      state.subscribedCount = action?.payload?.subscribedUsersCount;
    });
  },
});

export default statSlice.reducer;