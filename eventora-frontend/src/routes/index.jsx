import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

// Auth Pages
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import ChangePassword from "../pages/ChangePassword";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";

// Premium Placeholders for content injection inside Layouts
const UserDashboard = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-primary">Welcome to Eventora</h1>
      <p className="text-sm text-neutral-secondary">Discover and book premium events around you.</p>
    </div>
    <div className="grid gap-6 md:grid-cols-3">
      <div className="p-6 bg-neutral-white border border-neutral-muted rounded-xl shadow-soft">
        <h3 className="font-semibold text-neutral-primary">Active Events</h3>
        <p className="text-3xl font-bold mt-2 gradient-text">42</p>
      </div>
      <div className="p-6 bg-neutral-white border border-neutral-muted rounded-xl shadow-soft">
        <h3 className="font-semibold text-neutral-primary">My Bookings</h3>
        <p className="text-3xl font-bold mt-2 text-primary">3</p>
      </div>
      <div className="p-6 bg-neutral-white border border-neutral-muted rounded-xl shadow-soft">
        <h3 className="font-semibold text-neutral-primary">Points Earned</h3>
        <p className="text-3xl font-bold mt-2 text-secondary">1,250</p>
      </div>
    </div>
  </div>
);

const UserBookings = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold tracking-tight text-neutral-primary">My Bookings</h1>
    <p className="text-sm text-neutral-secondary">Manage reservations, details, and PDF tickets.</p>
    <div className="p-12 border border-dashed border-neutral-border rounded-xl text-center">
      <p className="text-neutral-secondary">No tickets booked yet. Start exploring events!</p>
    </div>
  </div>
);

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

const AdminDashboard = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold tracking-tight text-neutral-primary">Admin Console</h1>
    <div className="grid gap-6 md:grid-cols-4">
      <div className="p-6 bg-neutral-white border border-neutral-muted rounded-xl shadow-soft">
        <h3 className="font-semibold text-neutral-primary">Total Revenue</h3>
        <p className="text-3xl font-bold mt-2 gradient-text">$12,480</p>
      </div>
      <div className="p-6 bg-neutral-white border border-neutral-muted rounded-xl shadow-soft">
        <h3 className="font-semibold text-neutral-primary">Active Events</h3>
        <p className="text-3xl font-bold mt-2 text-primary">124</p>
      </div>
      <div className="p-6 bg-neutral-white border border-neutral-muted rounded-xl shadow-soft">
        <h3 className="font-semibold text-neutral-primary">Tickets Sold</h3>
        <p className="text-3xl font-bold mt-2 text-secondary">2,850</p>
      </div>
      <div className="p-6 bg-neutral-white border border-neutral-muted rounded-xl shadow-soft">
        <h3 className="font-semibold text-neutral-primary">Total Users</h3>
        <p className="text-3xl font-bold mt-2 text-accent">542</p>
      </div>
    </div>
  </div>
);

const AdminEvents = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold tracking-tight text-neutral-primary">Manage Events</h1>
    <p className="text-sm text-neutral-secondary">Add new events, update details or control bookings.</p>
    <div className="p-12 border border-dashed border-neutral-border rounded-xl text-center">
      <p className="text-neutral-secondary">Active database sync. Zero events require approval.</p>
    </div>
  </div>
);

const AdminUsers = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold tracking-tight text-neutral-primary">User Management</h1>
    <p className="text-sm text-neutral-secondary">Review roles, disable credentials or grant admin privileges.</p>
    <div className="p-12 border border-dashed border-neutral-border rounded-xl text-center">
      <p className="text-neutral-secondary">Connected directly to AWS Cognito User Pool.</p>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Route>

      {/* Protected User Routes */}
      <Route element={<ProtectedRoutes allowedRoles={["User", "Admin"]} />}>
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/bookings" element={<UserBookings />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoutes allowedRoles={["Admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
