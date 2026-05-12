import authSliceReducer from './Slices/AuthSlice';
import { configureStore } from "@reduxjs/toolkit";
import courseSliceReducer from './Slices/CourseSlice';
import lectureSliceReducer from './Slices/LectureSlice';
import razorpaySliceReducer from './Slices/RazorpaySlice';
import statSliceReducer from './Slices/StatSlice';
import dashboardSliceReducer from './Slices/DashboardSlice';

const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        course: courseSliceReducer,
        razorpay: razorpaySliceReducer,
        lecture: lectureSliceReducer,
        stat: statSliceReducer,
        dashboard: dashboardSliceReducer
    },
    devTools: true
});

export default store;