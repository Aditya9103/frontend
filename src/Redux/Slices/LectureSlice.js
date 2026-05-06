import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
    lectures: [],
    isLoading: false,
    error: "",
}


export const getCourseLectures = createAsyncThunk("/course/lecture/get", async (cid, { rejectWithValue }) => {
    try {
        const response = axiosInstance.get(`/courses/${cid}`);
        toast.promise(response, {
            loading: "Fetching course lectures",
            success: "Lectures fetched successfully",
            error: "Failed to load the lectures"
        });
        return (await response).data;
    } catch(error) {
        const message = error?.response?.data?.message || "Failed to load the lectures";
        toast.error(message);
        return rejectWithValue(message);
    }
});

export const addCourseLecture = createAsyncThunk("/course/lecture/add", async (data, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append("lecture", data.lecture);
        formData.append("title", data.title);
        formData.append("description", data.description);

        const response = axiosInstance.post(`/courses/${data.id}`, formData);
        toast.promise(response, {
            loading: "adding course lecture",
            success: "Lecture added successfully",
            error: "Failed to add the lectures"
        });
        return (await response).data;
    } catch(error) {
        const message = error?.response?.data?.message || "Failed to add the lectures";
        toast.error(message);
        return rejectWithValue(message);
    }
});

export const deleteCourseLecture = createAsyncThunk("/course/lecture/delete", async (data, { rejectWithValue }) => {
    try {

        const response = axiosInstance.delete(`/courses?courseId=${data.courseId}&lectureId=${data.lectureId}`);
        toast.promise(response, {
            loading: "deleting course lecture",
            success: "Lecture deleted successfully",
            error: "Failed to delete the lectures"
        });
        return (await response).data;
    } catch(error) {
        const message = error?.response?.data?.message || "Failed to delete the lectures";
        toast.error(message);
        return rejectWithValue(message);
    }
});


const lectureSlice = createSlice({
    name: "lecture",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCourseLectures.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        })
        .addCase(getCourseLectures.fulfilled, (state, action) => {
            state.isLoading = false;
            state.lectures = action?.payload?.lectures || [];
        })
        .addCase(getCourseLectures.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "Failed to load lectures";
            state.lectures = [];
        })
        .addCase(addCourseLecture.fulfilled, (state, action) => {
            state.lectures = action?.payload?.course?.lectures || [];
        })
    }
});

export default lectureSlice.reducer;
