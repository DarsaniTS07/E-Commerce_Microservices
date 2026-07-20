import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../utils/cn";
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Ticket, 
  User, 
  Compass,
  LayoutDashboard, 
  Calendar, 
  Users, 
  LogOut 
} from "lucide-react";
import useAuth from "../hooks/useAuth";

export const CollapsibleSidebar = ({ isAdmin = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();

  const userLinks = [
    { label: "Events", path: "/events", icon: Compass },
    ...(isAuthenticated ? [
      { label: "My Bookings", path: "/bookings", icon: Ticket },
      { label: "Profile", path: "/profile", icon: User },
    ] : [])
  ];

  const adminLinks = [
    { label: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Manage Events", path: "/admin/events", icon: Calendar },
    { label: "User Accounts", path: "/admin/users", icon: Users },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside
      className={cn(
        "relative flex flex-col justify-between h-[calc(100vh-64px)] bg-neutral-white border-r border-neutral-muted transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-neutral-white border border-neutral-muted rounded-full p-1 shadow-sm text-neutral-secondary hover:text-primary transition-colors z-50"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="flex flex-col py-6 space-y-2 overflow-y-auto overflow-x-hidden">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <Link
              key={link.path}
              to={link.path}
              title={isCollapsed ? link.label : undefined}
              className={cn(
                "flex items-center gap-4 px-5 py-3 mx-2 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary-lightest text-primary"
                  : "text-neutral-secondary hover:bg-neutral-light hover:text-neutral-primary",
                isCollapsed && "justify-center px-0 mx-auto w-10 h-10"
              )}
            >
              <Icon 
                size={20} 
                className={cn("shrink-0", isActive ? "text-primary" : "text-neutral-secondary group-hover:text-primary")} 
              />
              {!isCollapsed && (
                <span className={cn("text-sm font-medium whitespace-nowrap", isActive ? "font-bold" : "")}>
                  {link.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Actions */}
      {isAuthenticated && (
        <div className="p-4 border-t border-neutral-muted">
          <button
            onClick={logout}
            title={isCollapsed ? "Log Out" : undefined}
            className={cn(
              "flex items-center gap-4 px-5 py-3 mx-2 rounded-lg text-danger hover:bg-danger-lightest hover:text-danger-dark transition-all duration-200 group",
              isCollapsed && "justify-center px-0 mx-auto w-10 h-10"
            )}
          >
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">Log Out</span>}
          </button>
        </div>
      )}
    </aside>
  );
};

export default CollapsibleSidebar;
