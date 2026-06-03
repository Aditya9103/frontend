import authSliceReducer from '../../features/auth/redux/AuthSlice';
import { configureStore } from "@reduxjs/toolkit";
import courseSliceReducer from '../../features/courses/redux/CourseSlice';
import lectureSliceReducer from '../../features/courses/redux/LectureSlice';
import razorpaySliceReducer from '../../features/payments/redux/RazorpaySlice';
import statSliceReducer from '../../features/superAdmin/redux/StatSlice';
import dashboardSliceReducer from '../../features/superAdmin/redux/DashboardSlice';

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