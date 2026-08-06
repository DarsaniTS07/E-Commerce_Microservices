import apiClient from "../api/client";

export const userService = {
  listUsers: async () => {
    try {
      const response = await apiClient.get("/users");
      const apiData = response.data;
      
      if (apiData?.success && apiData.data) {
        return apiData.data;
      }
      return [];
    } catch (error) {
      console.error("Failed to list users:", error);
      throw error;
    }
  },

  getUserDetails: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      const apiData = response.data;
      
      if (apiData?.success && apiData.data) {
        return apiData.data;
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch details for user ${userId}:`, error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete user ${userId}:`, error);
      throw error;
    }
  }
};

export default userService;
