import React from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

export const PublicWebsiteLayout = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-neutral-lightest">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicWebsiteLayout;
