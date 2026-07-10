import './App.css';

import { Route, Routes } from 'react-router-dom';

import RequireAuth from './features/auth/components/RequireAuth';
import AboutUs from './features/public/pages/AboutUs';
import Contact from './features/public/pages/Contact';
import CourseDescription from './features/courses/pages/CourseDescription';
import CourseList from './features/courses/pages/CourseList';
import CreateCourse from './features/courses/pages/CreateCourse';
import AddLecture from './features/courses/pages/Addlecture';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import LearnerDashboard from './features/users/pages/LearnerDashboard';
import Displaylectures from './features/courses/pages/Displaylectures';
import ManageCurriculum from './features/courses/pages/ManageCurriculum';
import Denied from './features/auth/pages/Denied';
import HomePage from './features/public/pages/HomePage';
import Login from './features/auth/pages/Login';
import NotFound from './features/auth/pages/NotFound';
import Checkout from './features/payments/pages/Checkout';
import CheckoutFailure from './features/payments/pages/CheckoutFailure';
import CheckoutSuccess from './features/payments/pages/CheckoutSuccess';
import Signup from './features/auth/pages/Signup';
import ChangePassword from './features/users/pages/ChangePassword';
import EditProfile from './features/users/pages/EditProfile';
import Profile from './features/users/pages/Profile';
import Mentors from './features/public/pages/Mentors';
import SuccessStories from './features/public/pages/SuccessStories';
import Blog from './features/public/pages/Blog';
import BlogDetails from './features/public/pages/BlogDetails';
import CreateBlog from './features/public/pages/CreateBlog';
import AdminSignup from './features/admin/pages/AdminSignup';
import AdminLogin from './features/admin/pages/AdminLogin';
import SuperAdminDashboard from './features/superAdmin/pages/SuperAdminDashboard';
import UserManagement from './features/superAdmin/pages/UserManagement';
import AdminManagement from './features/superAdmin/pages/AdminManagement';
import ActivityLogs from './features/superAdmin/pages/ActivityLogs';
import SystemMonitoring from './features/superAdmin/pages/SystemMonitoring';
import SuperAdminSignup from './features/superAdmin/pages/SuperAdminSignup';
import SuperAdminLogin from './features/superAdmin/pages/SuperAdminLogin';
import SuperAdminSettings from './features/superAdmin/pages/SuperAdminSettings';
import AdminLayout from './shared/layouts/AdminLayout';
import ManageCourses from './features/admin/pages/ManageCourses';

function App() {

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
