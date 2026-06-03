import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import superAdminService from "../../../core/services/superAdmin.service";
import toast from "react-hot-toast";

const initialState = {
  allUsersCount: 0,
  subscribedCount: 0,
};

export const getStatsData = createAsyncThunk("stat/get", async () => {
  try {
    const response = await superAdminService.getStatsData();
    toast.promise(Promise.resolve(response), {
      loading: "Getting the stats...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to load data stats",
    });
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

const statSlice = createSlice({
  name: "stat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStatsData.fulfilled, (state, action) => {
      state.allUsersCount = action?.payload?.allUsersCount;
      state.subscribedCount = action?.payload?.subscribedUsersCount;
    });
  },
});

export default statSlice.reducer;