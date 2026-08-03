import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";

import AppLayout from "../layouts/AppLayout";
import PublicLayout from "../layouts/PublicLayout";
import PublicWebsiteLayout from "../layouts/PublicWebsiteLayout";

// Public Pages
import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/HomePage";

// Auth Pages
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import ChangePassword from "../pages/ChangePassword";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";

// Remove inline UserProfile and import ProfilePage below

import CartPage from "../pages/CartPage";
import OrderConfirmPage from "../pages/OrderConfirmPage";
import PaymentPage from "../pages/PaymentPage";
import BookingsPage from "../pages/BookingsPage";
import FavoritesPage from "../pages/FavoritesPage";
import ProfilePage from "../pages/ProfilePage";

// Admin Pages
import AdminEventsPage from "../pages/admin/AdminEventsPage";
import AdminEventFormPage from "../pages/admin/AdminEventFormPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminUserDetailsPage from "../pages/admin/AdminUserDetailsPage";
import AdminPaymentsPage from "../pages/admin/AdminPaymentsPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Landing Page without Sidebar */}
      <Route element={<PublicWebsiteLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Global App Layout for ALL other routes */}
      <Route element={<AppLayout />}>
        <Route path="/events" element={<HomePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout/confirm/:orderId" element={<OrderConfirmPage />} />
        <Route path="/checkout/payment/:orderId" element={<PaymentPage />} />



      {/* Protected User Dashboard Routes */}
      <Route element={<ProtectedRoutes allowedRoles={["User", "Admin"]} />}>
        <Route path="/dashboard" element={<Navigate to="/events" replace />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoutes allowedRoles={["Admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/events" element={<AdminEventsPage />} />
        <Route path="/admin/events/new" element={<AdminEventFormPage />} />
        <Route path="/admin/events/:eventId/edit" element={<AdminEventFormPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/users/:userId" element={<AdminUserDetailsPage />} />
        <Route path="/admin/payments" element={<AdminPaymentsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
