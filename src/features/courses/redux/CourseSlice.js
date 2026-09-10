import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import courseService from "../../../core/services/course.service";

import { extractApiError } from "../../../shared/utils/apiError";

const initialState = {
  courseData: [],
};

export const getAllCourses = createAsyncThunk("/course/get", async () => {
  try {
    const response = await courseService.getAllCourses();
    return response.data?.data?.courses || response.data?.courses || [];
  } catch (error) {
    toast.error(extractApiError(error));
  }
});

export const deleteCourse = createAsyncThunk("/course/delete", async (id) => {
  try {
    const response = await courseService.deleteCourse(id);
    toast.success('Course deleted successfully');
    return response.data.data;
  } catch (error) {
    toast.error(extractApiError(error));
  }
});

export const createNewCourse = createAsyncThunk(
  "/course/create",
  async (data, { rejectWithValue }) => {
    try {
      let formData = new FormData();
      formData.append("title", data?.title ? data.title.trim() : "");
      formData.append("description", data?.description ? data.description.trim() : "");
      formData.append("category", data?.category ? data.category.trim() : "");
      formData.append("createdBy", data?.createdBy ? data.createdBy.trim() : "");
      if (data?.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }
      if (data?.completionThreshold !== undefined) {
        formData.append("completionThreshold", data.completionThreshold);
      }
      if (data?.isFree !== undefined) {
        formData.append("isFree", data.isFree);
      }

      const response = await courseService.createNewCourse(formData);
      toast.success('Course created successfully');
      return response.data?.data || response.data;
    } catch (error) {
      const message = extractApiError(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const addSection = createAsyncThunk(
  "/course/addSection",
  async (data) => {
    try {
      const response = await courseService.addSection(data.id, { title: data.title });
      toast.success('Section added successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || 'Failed to add section');
      throw error;
    }
  }
);

export const addLectureToSection = createAsyncThunk(
  "/course/addLectureToSection",
  async (data) => {
    try {
      const response = await courseService.addLectureToSection(data.id, data.sectionId, {
        title: data.title,
        description: data.description,
        public_id: data.public_id,
        secure_url: data.secure_url
      });
      toast.success('Lecture metadata saved successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || 'Failed to add lecture metadata');
      throw error;
    }
  }
);

export const addQuiz = createAsyncThunk(
  "/course/addQuiz",
  async (data) => {
    try {
      const response = await courseService.addQuiz(data.id, data.sectionId, data.quizData);
      toast.success('Quiz added successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || 'Failed to add quiz');
      throw error;
    }
  }
);

export const addAssignment = createAsyncThunk(
  "/course/addAssignment",
  async (data) => {
    try {
      let formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.dueDate) formData.append("dueDate", data.dueDate);
      if (data.file) formData.append("assignmentFile", data.file);

      const response = await courseService.addAssignment(data.id, data.sectionId, formData);
      toast.success('Assignment added successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || 'Failed to add assignment');
      throw error;
    }
  }
);

export const getCourseSubmissions = createAsyncThunk(
  "/course/getSubmissions",
  async (id) => {
    try {
      const response = await courseService.getCourseSubmissions(id);
      return response.data?.data?.submissions || response.data?.submissions || [];
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || 'Failed to fetch submissions');
      throw error;
    }
  }
);

export const gradeUserAssignment = createAsyncThunk(
  "/course/gradeAssignment",
  async (data) => {
    try {
      const response = await courseService.gradeAssignment(data);
      toast.success('Assignment graded successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || 'Failed to grade assignment');
      throw error;
    }
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCourses.fulfilled, (state, action) => {
      if (action.payload) {
        state.courseData = [...action.payload];
      }
    });
  },
});

export default courseSlice.reducer;