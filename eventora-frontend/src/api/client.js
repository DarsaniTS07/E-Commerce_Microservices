import axios from "axios";
import toast from "react-hot-toast";
import { getStoredToken, removeStoredToken } from "../utils/auth";

const API_BASE_URL = import.meta.env.DEV ? "/api" : "https://4bsnhdrhji.execute-api.ap-southeast-1.amazonaws.com";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    // If request explicitly marks public, don't attach token
    if (config.public) {
      return config;
    }
    
    const idToken = getStoredToken();
    const accessToken = localStorage.getItem("eventora_access_token");
    const tokenToUse = accessToken || idToken; // Try AccessToken first
    
    if (tokenToUse) {
      config.headers.Authorization = `Bearer ${tokenToUse}`;
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
    // If the request explicitly asks to skip global error toast notifications, just reject the promise
    if (error.config?.skipToast) {
      return Promise.reject(error);
    }

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
