import { configureStore } from "@reduxjs/toolkit";

import authSliceReducer from '../../features/auth/redux/AuthSlice';
import courseSliceReducer from '../../features/courses/redux/CourseSlice';
import notificationReducer from '../../features/notifications/redux/NotificationSlice';
import razorpaySliceReducer from '../../features/payments/redux/RazorpaySlice';
import dashboardSliceReducer from '../../features/superAdmin/redux/DashboardSlice';
import statSliceReducer from '../../features/superAdmin/redux/StatSlice';
import lectureSliceReducer from '../../features/courses/redux/LectureSlice';

const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        course: courseSliceReducer,
        razorpay: razorpaySliceReducer,
        lecture: lectureSliceReducer,
        stat: statSliceReducer,
        dashboard: dashboardSliceReducer,
        notifications: notificationReducer,  // Phase 6
    },
    devTools: import.meta.env.DEV, // Never expose Redux state in production
});

export default store;