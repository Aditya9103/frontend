/**
 * admin.service.js — Admin-specific API wrappers
 *
 * Audit result (2026-07-17): all admin pages dispatch Redux thunks that call
 * into courseService, paymentService, and superAdminService — no direct Axios
 * calls exist in features/admin/pages/*.jsx. This file is created for
 * completeness (the architecture doc lists it) and to house any future
 * admin-only endpoints that don't belong in the other service files.
 *
 * Current admin API calls live in:
 *   - CourseSlice  → course.service.js  (getAllCourses, deleteCourse, gradeAssignment, etc.)
 *   - StatSlice    → superAdmin.service.js (getStatsData)
 *   - RazorpaySlice → payment.service.js (getPaymentRecord)
 *
 * Add endpoints here when admin-only functionality grows beyond what those
 * services sensibly own (e.g. admin-specific reporting, bulk actions, etc.).
 */
import axiosInstance from '../config/axiosInstance';

class AdminService {
  /**
   * Fetches all submission records for a course, for the grading dashboard.
   * Currently also in courseService.getCourseSubmissions — if you call this
   * from AdminDashboard directly in future, use this wrapper.
   */
  async getCourseSubmissions(courseId) {
    return axiosInstance.get(`/courses/${courseId}/submissions`);
  }

  /**
   * Grades a student's assignment submission.
   * Currently also in courseService.gradeAssignment.
   */
  async gradeAssignment(data) {
    return axiosInstance.put('/user/assignment/grade', data);
  }
}

export default new AdminService();
