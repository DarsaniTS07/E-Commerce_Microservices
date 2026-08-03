import apiClient from "../api/client";

export const notificationService = {
  getNotifications: async () => {
    try {
      const response = await apiClient.get("/notifications", { skipToast: true });
      return response.data?.data || [];
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // Return empty array to gracefully handle errors without crashing UI
      return [];
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await apiClient.put(`/notifications/${notificationId}/read`);
      return response.data?.data;
    } catch (error) {
      console.error(`Failed to mark notification ${notificationId} as read:`, error);
      throw error;
    }
  }
};

export default notificationService;
