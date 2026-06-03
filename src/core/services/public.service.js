import axiosInstance from '../config/axiosInstance';

class PublicService {
  async contactUs(data) {
    return await axiosInstance.post('/contact', data);
  }
}

export default new PublicService();
