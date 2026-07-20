import React from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import CollapsibleSidebar from "./CollapsibleSidebar";
import PublicFooter from "./PublicFooter";
import useAuth from "../hooks/useAuth";

export const AppLayout = () => {
  const { user } = useAuth();
  
  // If we have an admin user, we can pass isAdmin down to the sidebar
  const isAdmin = user?.role === "Admin";

  return (
    <div className="flex flex-col min-h-screen w-screen bg-neutral-lightest overflow-hidden">
      {/* Top Navigation */}
      <PublicNavbar />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Collapsible Sidebar */}
        <CollapsibleSidebar isAdmin={isAdmin} />
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <main className="flex-1">
            <Outlet />
          </main>
          <PublicFooter />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
