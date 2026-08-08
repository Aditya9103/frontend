import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import courseService from "../../../core/services/course.service";

const initialState = {
  lectures: [],
};

export const getCourseLectures = createAsyncThunk(
  "/course/lecture/get",
  async (cid) => {
    try {
      const response = await courseService.getCourseLectures(cid);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || 'Failed to load lectures');
    }
  }
);

export const addCourseLecture = createAsyncThunk(
  "/course/lecture/add",
  async (data) => {
    try {
      const formData = new FormData();
      formData.append("lecture", data.lecture);
      formData.append("title", data.title);
      formData.append("description", data.description);

      const response = await courseService.addCourseLecture(data.id, formData);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || 'Failed to add lecture');
    }
  }
);

export const deleteCourseLecture = createAsyncThunk(
  "/course/lecture/delete",
  async (data) => {
    try {
      const response = await courseService.deleteCourseLecture(data.courseId, data.lectureId);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || 'Failed to delete lecture');
    }
  }
);

const lectureSlice = createSlice({
  name: "lecture",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCourseLectures.fulfilled, (state, action) => {
        // New envelope: res.data.data → { lectures, course, ... }
        state.lectures = action?.payload?.lectures;
      })
      .addCase(addCourseLecture.fulfilled, (state, action) => {
        state.lectures = action?.payload?.course?.lectures;
      });
  },
});

export default lectureSlice.reducer;
