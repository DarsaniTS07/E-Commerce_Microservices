import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";
import { getStoredToken, setStoredToken, removeStoredToken, getUserFromToken } from "../utils/auth";
import toast from "react-hot-toast";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = getStoredToken();
        if (token) {
          const userData = getUserFromToken(token);
          if (userData) {
            setUser(userData);
          } else {
            removeStoredToken();
          }
        }
      } catch (err) {
        console.error("Auth initialization failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      // Backend Cognito integrations might return tokens as IdToken, AccessToken or raw token
      const token = data.token || data.IdToken || data.AccessToken;
      setStoredToken(token);
      const userData = getUserFromToken(token);
      setUser(userData);
      toast.success(`Welcome back, ${userData?.name || "User"}!`);
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email, password, name, role = "User") => {
    setIsLoading(true);
    try {
      const response = await authService.signup(email, password, name, role);
      toast.success("Account registration sent. Check your email for OTP.");
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSignup = async (email, code) => {
    setIsLoading(true);
    try {
      const response = await authService.confirmSignup(email, code);
      toast.success("Email verification successful. You can log in.");
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      toast.success("Verification token has been sent.");
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email, code, newPassword) => {
    setIsLoading(true);
    try {
      const response = await authService.resetPassword(email, code, newPassword);
      toast.success("Your password has been reset.");
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    setIsLoading(true);
    try {
      const response = await authService.changePassword(oldPassword, newPassword);
      toast.success("Password changed successfully.");
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
    toast.success("Logged out successfully.");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    confirmSignup,
    forgotPassword,
    resetPassword,
    changePassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
