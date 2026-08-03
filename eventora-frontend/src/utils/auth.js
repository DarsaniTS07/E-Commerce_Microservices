import { jwtDecode } from "jwt-decode";

export const TOKEN_KEY = "eventora_jwt";

export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const removeStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("eventora_access_token");
};

export const decodeToken = (token) => {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return null;
  }
};

export const getUserFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  // Check token expiration
  const currentTime = Date.now() / 1000;
  if (decoded.exp && decoded.exp < currentTime) {
    removeStoredToken();
    return null;
  }

  // Detect role: Cognito stores groups in 'cognito:groups' or custom attributes in 'custom:role'
  let role = "User";
  if (decoded["custom:role"]) {
    role = decoded["custom:role"];
  } else if (Array.isArray(decoded["cognito:groups"])) {
    const groups = decoded["cognito:groups"].map(g => g.toLowerCase());
    if (groups.includes("admin")) {
      role = "Admin";
    }
  }

  return {
    id: decoded.sub,
    email: decoded.email,
    name: decoded.name || decoded.email?.split("@")[0] || "User",
    role,
    decoded,
  };
};

export const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (e) {
    return false;
  }
};
