import axiosInstance from '../config/axiosInstance';

class PaymentService {
  async getRazorpayKey() {
    return await axiosInstance.get('/payments/razorpay-key');
  }

  async purchaseCourseBundle() {
    return await axiosInstance.post('/payments/subscribe');
  }

  async verifyUserPayment(paymentData) {
    return await axiosInstance.post('/payments/verify', paymentData);
  }

  async getPaymentRecord() {
    return await axiosInstance.get('/payments?count=100');
  }

  async cancelCourseBundle() {
    return await axiosInstance.post('/payments/unsubscribe');
  }
}

export default new PaymentService();
