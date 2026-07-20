import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export const PublicLayout = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={user?.role === "Admin" ? "/admin/dashboard" : "/dashboard"} replace />;
  }

  return (
    <div className="flex min-h-screen w-screen bg-neutral-lightest">
      {/* Left panel - Branding (split screen on desktop) */}
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center text-neutral-white p-12 flex-col justify-between relative overflow-hidden"
        style={{ backgroundImage: "url('https://th.bing.com/th/id/OIP.dw2caOylXPzNGM5n4_Yc_AHaE8?w=240&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3')" }}
      >
        {/* Blur gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-neutral-white/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="flex items-center gap-3 z-10">
          <img
            src="/Eventora_logo_copy-removebg-preview.png"
            alt="Eventora Logo"
            className="h-10 object-contain brightness-0 invert"
          />
        </div>

        <div className="my-auto space-y-6 max-w-md z-10">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Discover. Book. Experience.
          </h1>
          <p className="text-neutral-white/80 leading-relaxed text-sm">
            Eventora is a serverless, real-time ticket manager offering instant checkouts, waiting lists, and enterprise-grade event monitoring.
          </p>
        </div>

        <div className="z-10 text-xs text-neutral-white/60">
          &copy; {new Date().getFullYear()} Eventora Inc. All rights reserved.
        </div>
      </div>

      {/* Right panel - Forms */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-neutral-white sm:bg-neutral-lightest">
        <div className="absolute top-6 left-6 flex md:hidden items-center gap-2 z-10">
          <img
            src="/Eventora_logo_copy-removebg-preview.png"
            alt="Eventora Logo"
            className="h-8 object-contain"
          />
        </div>

        <div className="w-full max-w-md p-0 sm:p-8 bg-neutral-white sm:border sm:border-neutral-muted rounded-2xl sm:shadow-soft">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PublicLayout;
