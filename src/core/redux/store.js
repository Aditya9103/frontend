import { configureStore } from "@reduxjs/toolkit";

import authSliceReducer from '../../features/auth/redux/AuthSlice';
import courseSliceReducer from '../../features/courses/redux/CourseSlice';
import lectureSliceReducer from '../../features/courses/redux/LectureSlice';
import razorpaySliceReducer from '../../features/payments/redux/RazorpaySlice';
import dashboardSliceReducer from '../../features/superAdmin/redux/DashboardSlice';
import statSliceReducer from '../../features/superAdmin/redux/StatSlice';

const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        course: courseSliceReducer,
        razorpay: razorpaySliceReducer,
        lecture: lectureSliceReducer,
        stat: statSliceReducer,
        dashboard: dashboardSliceReducer
    },
    devTools: import.meta.env.DEV,
});

export default store;