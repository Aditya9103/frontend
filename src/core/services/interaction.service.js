import axiosInstance from '../config/axiosInstance';

class InteractionService {
  async getNotes(courseId) {
    return await axiosInstance.get(`/interaction/note/${courseId}`);
  }

  async getBookmarks(courseId) {
    return await axiosInstance.get(`/interaction/bookmark/${courseId}`);
  }

  async addNote(data) {
    return await axiosInstance.post('/interaction/note', data);
  }

  async deleteNote(noteId) {
    return await axiosInstance.delete(`/interaction/note/${noteId}`);
  }

  async toggleBookmark(data) {
    return await axiosInstance.post('/interaction/bookmark', data);
  }

  // Phase 5: delete a specific bookmark by id
  async deleteBookmark(bookmarkId) {
    return await axiosInstance.delete(`/interaction/bookmark/${bookmarkId}`);
  }
}

export default new InteractionService();
