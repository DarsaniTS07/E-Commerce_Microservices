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

// Placeholders for User Settings
const UserProfile = () => (
  <div className="space-y-6 max-w-xl">
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-primary">Profile & Security</h1>
      <p className="text-sm text-neutral-secondary">Manage passwords, authentication details, and user credentials.</p>
    </div>
    <div className="p-6 bg-neutral-white border border-neutral-muted rounded-xl shadow-soft">
      <ChangePassword />
    </div>
  </div>
);

import CartPage from "../pages/CartPage";
import OrderConfirmPage from "../pages/OrderConfirmPage";
import PaymentPage from "../pages/PaymentPage";
import BookingsPage from "../pages/BookingsPage";
import FavoritesPage from "../pages/FavoritesPage";

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
        <Route path="/profile" element={<UserProfile />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoutes allowedRoles={["Admin"]} />}>
        <Route path="/admin/dashboard" element={<div className="p-6 text-neutral-secondary">Admin Console Dashboard details.</div>} />
        <Route path="/admin/events" element={<div className="p-6 text-neutral-secondary">Events Management list.</div>} />
        <Route path="/admin/users" element={<div className="p-6 text-neutral-secondary">Users Management pool.</div>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
