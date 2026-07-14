import axios from "axios";
import toast from "react-hot-toast";
import { getStoredToken, removeStoredToken } from "../utils/auth";

const API_BASE_URL = "https://4bsnhdrhji.execute-api.ap-southeast-1.amazonaws.com";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response ? error.response.status : null;
    const message = error.response?.data?.message || error.response?.data?.error || error.message;

    if (status === 401) {
      removeStoredToken();
      toast.error("Session expired. Please log in again.");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else if (status === 403) {
      toast.error("Access denied. You do not have permissions for this resource.");
    } else if (status === 500) {
      toast.error("Internal server error. Our developers are notified.");
    } else {
      toast.error(message || "An error occurred with your request.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
