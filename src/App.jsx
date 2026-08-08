import './App.css';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import axiosInstance from './core/config/axiosInstance';
import { setAccessToken } from './core/config/tokenStore';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import AdminLogin from './features/admin/pages/AdminLogin';
import AdminSignup from './features/admin/pages/AdminSignup';
import ManageCourses from './features/admin/pages/ManageCourses';
import RequireAuth from './features/auth/components/RequireAuth';
import Denied from './features/auth/pages/Denied';
import Login from './features/auth/pages/Login';
import NotFound from './features/auth/pages/NotFound';
import Signup from './features/auth/pages/Signup';
import { restoreSession } from './features/auth/redux/AuthSlice';
import AddLecture from './features/courses/pages/Addlecture';
import CourseDescription from './features/courses/pages/CourseDescription';
import CourseList from './features/courses/pages/CourseList';
import CreateCourse from './features/courses/pages/CreateCourse';
import Displaylectures from './features/courses/pages/Displaylectures';
import ManageCurriculum from './features/courses/pages/ManageCurriculum';
import Checkout from './features/payments/pages/Checkout';
import CheckoutFailure from './features/payments/pages/CheckoutFailure';
import CheckoutSuccess from './features/payments/pages/CheckoutSuccess';
import AboutUs from './features/public/pages/AboutUs';
import Blog from './features/public/pages/Blog';
import BlogDetails from './features/public/pages/BlogDetails';
import Contact from './features/public/pages/Contact';
import CreateBlog from './features/public/pages/CreateBlog';
import HomePage from './features/public/pages/HomePage';
import Mentors from './features/public/pages/Mentors';
import SuccessStories from './features/public/pages/SuccessStories';
import ActivityLogs from './features/superAdmin/pages/ActivityLogs';
import AdminManagement from './features/superAdmin/pages/AdminManagement';
import SuperAdminDashboard from './features/superAdmin/pages/SuperAdminDashboard';
import SuperAdminLogin from './features/superAdmin/pages/SuperAdminLogin';
import SuperAdminSettings from './features/superAdmin/pages/SuperAdminSettings';
import SuperAdminSignup from './features/superAdmin/pages/SuperAdminSignup';
import SystemMonitoring from './features/superAdmin/pages/SystemMonitoring';
import UserManagement from './features/superAdmin/pages/UserManagement';
import ChangePassword from './features/users/pages/ChangePassword';
import EditProfile from './features/users/pages/EditProfile';
import LearnerDashboard from './features/users/pages/LearnerDashboard';
import Profile from './features/users/pages/Profile';
import AdminLayout from './shared/layouts/AdminLayout';

function App() {
  const dispatch = useDispatch();

  // ── Silent token recovery on page refresh ──────────────────────────────────
  // The in-memory access token is lost on page reload, but the httpOnly
  // refresh token cookie is still present. We call /auth/refresh once on
  // mount to recover the token and set authCheckComplete=true so RequireAuth
  // renders children (or redirects) instead of showing a loading spinner.
  //
  // Both the success and failure paths dispatch restoreSession — this is what
  // flips authCheckComplete so the app doesn't hang on the spinner indefinitely.
  useEffect(() => {
    const wasLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!wasLoggedIn) {
      // No prior session — mark check as done immediately (no refresh needed)
      dispatch(restoreSession(null));
      return;
    }

    axiosInstance
      .post('/auth/refresh')
      .then((res) => {
        const token = res.data?.data?.accessToken;
        const user  = res.data?.data?.user;
        if (token) setAccessToken(token);
        dispatch(restoreSession(user ? { user, permissions: user.permissions || [] } : null));
      })
      .catch(() => {
        // Refresh token expired or revoked — clear stale local state
        dispatch(restoreSession(null));
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} ></Route>
        <Route path="/about" element={<AboutUs />} ></Route>
        <Route path="/courses" element={<CourseList />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/denied" element={<Denied />} />

        <Route path="/course/description" element={<CourseDescription />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/super-admin/signup" element={<SuperAdminSignup />} />
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />

        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/course/create" element={<CreateCourse />} />
            <Route path="/course/addlecture" element={<AddLecture />} />
            <Route path="/course/manage/:id" element={<ManageCurriculum />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<ManageCourses />} />
            <Route path="/blog/create" element={<CreateBlog />} />
          </Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={["ADMIN", "USER"]} />}>
          <Route path='/dashboard' element={<LearnerDashboard />} />
          <Route path='/user/profile' element={<Profile />} />
          <Route path='/user/editprofile' element={<EditProfile />} />
          <Route path='/changepassword' element={<ChangePassword />} />

          <Route path='/checkout' element={<Checkout />} />
          <Route path='/checkout/success' element={<CheckoutSuccess />} />
          <Route path='/checkout/fail' element={<CheckoutFailure />} />
          <Route path='/course/displaylectures' element={<Displaylectures />}/>
        </Route>

        <Route element={<RequireAuth allowedRoles={["SUPER_ADMIN"]} />}>
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/users" element={<UserManagement />} />
          <Route path="/super-admin/admins" element={<AdminManagement />} />
          <Route path="/super-admin/logs" element={<ActivityLogs />} />
          <Route path="/super-admin/system" element={<SystemMonitoring />} />
          <Route path="/super-admin/settings" element={<SuperAdminSettings />} />
        </Route>

        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  )
}

export default App
