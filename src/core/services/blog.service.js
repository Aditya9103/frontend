import axiosInstance from '../config/axiosInstance';

class BlogService {
  async getBlogs() {
    return await axiosInstance.get('/blogs');
  }

  async getBlogDetails(id) {
    return await axiosInstance.get(`/blogs/${id}`);
  }

  async createBlog(formData) {
    return await axiosInstance.post('/blogs', formData);
  }
}

export default new BlogService();
