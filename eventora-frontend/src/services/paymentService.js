import apiClient from "../api/client";

export const paymentService = {
  initiatePayment: async (orderId) => {
    try {
      const response = await apiClient.post("/payments", { orderId });
      return response.data?.data;
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      throw error;
    }
  },

  simulateCallback: async (orderId, status = "SUCCESS") => {
    try {
      // For testing/simulation, we hit the callback endpoint with status
      const response = await apiClient.post("/payments/callback", { orderId, status });
      return response.data?.data;
    } catch (error) {
      console.error("Failed to simulate payment callback:", error);
      throw error;
    }
  },
  
  getPaymentStatus: async (orderId) => {
    try {
      const response = await apiClient.get(`/payments/${orderId}`);
      return response.data?.data;
    } catch (error) {
      console.error("Failed to fetch payment status:", error);
      throw error;
    }
  }
};

export default paymentService;
