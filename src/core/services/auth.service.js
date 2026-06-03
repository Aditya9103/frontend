import axiosInstance from '../config/axiosInstance';

class AuthService {
  async register(data) {
    return await axiosInstance.post('/user/register', data);
  }

  async login(data) {
    return await axiosInstance.post('/user/login', data);
  }

  async googleAuth(credential) {
    return await axiosInstance.post('/user/google-auth', { credential });
  }

  async otpSignup(data) {
    return await axiosInstance.post('/user/otp-signup', data);
  }

  async verifySignupOtp(data) {
    return await axiosInstance.post('/user/verify-signup-otp', data);
  }

  async otpLogin(data) {
    return await axiosInstance.post('/user/otp-login', data);
  }

  async verifyLoginOtp(data) {
    return await axiosInstance.post('/user/verify-login-otp', data);
  }

  async adminOtpSignup(data) {
    return await axiosInstance.post('/user/admin/otp-signup', data);
  }

  async adminVerifySignupOtp(data) {
    return await axiosInstance.post('/user/admin/verify-signup-otp', data);
  }

  async adminOtpLogin(data) {
    return await axiosInstance.post('/user/admin/otp-login', data);
  }

  async adminVerifyLoginOtp(data) {
    return await axiosInstance.post('/user/admin/verify-login-otp', data);
  }
  
  async adminPasswordLogin(data) {
    return await axiosInstance.post('/user/admin/password-login', data);
  }

  async superAdminSignup(data) {
    return await axiosInstance.post('/user/super-admin/signup', data);
  }

  async resendOtp(data) {
    return await axiosInstance.post('/user/resend-otp', data);
  }

  async logout() {
    return await axiosInstance.post('/user/logout');
  }

  async updateProfile(id, formData) {
    return await axiosInstance.put(`/user/update/${id}`, formData);
  }

  async getUserData() {
    return await axiosInstance.get('/user/me');
  }
  
  async changePassword(userPassword) {
    return await axiosInstance.post('/user/change-password', userPassword);
  }
  
  async updateCourseProgress(courseId, lectureId) {
    return await axiosInstance.post(`/user/progress/${courseId}/${lectureId}`);
  }

  async updateVideoProgress(data) {
    return await axiosInstance.post('/user/video-progress', data);
  }
  
  async submitQuiz(data) {
    return await axiosInstance.post('/user/quiz/submit', data);
  }
  
  async submitAssignment(data) {
    return await axiosInstance.post('/user/assignment/submit', data);
  }
}

export default new AuthService();
