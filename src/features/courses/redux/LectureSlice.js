import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import courseService from "../../../core/services/course.service";
import toast from "react-hot-toast";

const initialState = {
  lectures: [],
};

export const getCourseLectures = createAsyncThunk(
  "/course/lecture/get",
  async (cid) => {
    try {
      const response = await courseService.getCourseLectures(cid);
      toast.promise(Promise.resolve(response), {
        loading: "Fetching course lectures",
        success: "Lectures fetched successfully",
        error: "Failed to load the lectures",
      });
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
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
      toast.promise(Promise.resolve(response), {
        loading: "adding course lecture",
        success: "Lecture added successfully",
        error: "Failed to add the lectures",
      });
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const deleteCourseLecture = createAsyncThunk(
  "/course/lecture/delete",
  async (data) => {
    try {
      const response = await courseService.deleteCourseLecture(data.courseId, data.lectureId);
      toast.promise(Promise.resolve(response), {
        loading: "deleting course lecture",
        success: "Lecture deleted successfully",
        error: "Failed to delete the lectures",
      });
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
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
        state.lectures = action?.payload?.lectures;
      })
      .addCase(addCourseLecture.fulfilled, (state, action) => {
        state.lectures = action?.payload?.course?.lectures;
      });
  },
});

export default lectureSlice.reducer;
