import axiosInstance from '../config/axiosInstance';

class CourseService {
  async getAllCourses() {
    return await axiosInstance.get('/courses');
  }

  async deleteCourse(id) {
    return await axiosInstance.delete(`/courses/${id}`);
  }

  async createNewCourse(formData) {
    return await axiosInstance.post('/courses', formData);
  }

  async getCourseLectures(courseId) {
    return await axiosInstance.get(`/courses/${courseId}`);
  }

  async addCourseLecture(courseId, formData) {
    return await axiosInstance.post(`/courses/${courseId}`, formData, {
      timeout: 300000, // 5 minutes
    });
  }

  async deleteCourseLecture(courseId, lectureId) {
    return await axiosInstance.delete(`/courses?courseId=${courseId}&lectureId=${lectureId}`);
  }

  async addSection(id, data) {
    return await axiosInstance.post(`/courses/${id}/sections`, data);
  }

  async addLectureToSection(id, sectionId, data) {
    return await axiosInstance.post(`/courses/${id}/sections/${sectionId}/lectures`, data);
  }

  async addQuiz(id, sectionId, data) {
    return await axiosInstance.post(`/courses/${id}/sections/${sectionId}/quizzes`, data);
  }

  async addAssignment(id, sectionId, data) {
    return await axiosInstance.post(`/courses/${id}/sections/${sectionId}/assignments`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async getCourseSubmissions(id) {
    return await axiosInstance.get(`/courses/${id}/submissions`);
  }

  async gradeAssignment(data) {
    return await axiosInstance.put(`/user/assignment/grade`, data);
  }
}

export default new CourseService();
