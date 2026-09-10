import { configureStore } from "@reduxjs/toolkit";

import authSliceReducer from '../../features/auth/redux/AuthSlice';
import courseSliceReducer from '../../features/courses/redux/CourseSlice';
import notificationReducer from '../../features/notifications/redux/NotificationSlice';
import razorpaySliceReducer from '../../features/payments/redux/RazorpaySlice';
import dashboardSliceReducer from '../../features/superAdmin/redux/DashboardSlice';
import statSliceReducer from '../../features/superAdmin/redux/StatSlice';
import lectureSliceReducer from '../../features/courses/redux/LectureSlice';
// Phase 5: RTK Query base slice — provides api.reducer + api.middleware
import { apiSlice } from '../query/apiSlice';
// Importing courseApi ensures its endpoints are registered into apiSlice
import '../query/courseApi';

const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        course: courseSliceReducer,
        razorpay: razorpaySliceReducer,
        lecture: lectureSliceReducer,
        stat: statSliceReducer,
        dashboard: dashboardSliceReducer,
        notifications: notificationReducer,  // Phase 6
        [apiSlice.reducerPath]: apiSlice.reducer, // Phase 5: RTK Query cache
    },
    // Phase 5: RTK Query middleware handles cache lifecycle (TTL, invalidation, polling)
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: import.meta.env.DEV, // Never expose Redux state in production
});

export default store;