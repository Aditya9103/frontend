import axiosInstance from '../config/axiosInstance';

class DiscussionService {
  async getDiscussions(courseId, lectureId) {
    return await axiosInstance.get(`/discussions/${courseId}/${lectureId}`);
  }

  async addQuestion(data) {
    return await axiosInstance.post('/discussions/question', data);
  }

  async addReply(data) {
    return await axiosInstance.post('/discussions/reply', data);
  }
}

export default new DiscussionService();
