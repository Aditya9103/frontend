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

  // Phase 6 — upvote a question
  async upvoteQuestion(discussionId) {
    return await axiosInstance.post(`/discussions/${discussionId}/upvote`);
  }

  // Phase 6 — mark discussion as answered (instructor/admin)
  async markAnswered(discussionId) {
    return await axiosInstance.patch(`/discussions/${discussionId}/resolve`);
  }
}

export default new DiscussionService();

