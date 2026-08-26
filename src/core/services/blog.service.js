import axiosInstance from '../config/axiosInstance';

class BlogService {
  async getBlogs() {
    return await axiosInstance.get('/blogs');
  }

  // Phase 9: accepts slug OR mongo id — backend handles both
  async getBlogDetails(slugOrId) {
    return await axiosInstance.get(`/blogs/${slugOrId}`);
  }

  async createBlog(formData) {
    return await axiosInstance.post('/blogs', formData);
  }

  // Phase 9: update blog (draft/publish toggle, tags, meta)
  async updateBlog(id, data) {
    return await axiosInstance.patch(`/blogs/${id}`, data);
  }

  // Phase 9: delete blog
  async deleteBlog(id) {
    return await axiosInstance.delete(`/blogs/${id}`);
  }
}

export default new BlogService();
