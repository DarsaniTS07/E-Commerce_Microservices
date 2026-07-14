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
      <div className="hidden md:flex md:w-1/2 bg-brand-gradient text-neutral-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Blur gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-neutral-white/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="flex items-center gap-3 z-10">
          <div className="h-10 w-10 bg-neutral-white rounded-xl flex items-center justify-center shadow-soft">
            <span className="font-black text-xl bg-brand-gradient bg-clip-text text-transparent">E</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Eventora</span>
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
        <div className="absolute top-6 left-6 flex md:hidden items-center gap-2">
          <div className="h-8 w-8 bg-brand-gradient rounded-lg flex items-center justify-center text-neutral-white font-bold">
            E
          </div>
          <span className="font-bold text-neutral-primary">Eventora</span>
        </div>
        
        <div className="w-full max-w-md p-0 sm:p-8 bg-neutral-white sm:border sm:border-neutral-muted rounded-2xl sm:shadow-soft">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PublicLayout;
