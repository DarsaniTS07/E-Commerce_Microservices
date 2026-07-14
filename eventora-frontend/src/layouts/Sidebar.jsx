import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../utils/cn";
import { X, LayoutDashboard, Ticket, User, Calendar, Users, LogOut } from "lucide-react";
import useAuth from "../hooks/useAuth";

export const Sidebar = ({ isOpen, onClose, isAdmin = false }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const userLinks = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "My Bookings", path: "/bookings", icon: Ticket },
    { label: "Profile Settings", path: "/profile", icon: User },
  ];

  const adminLinks = [
    { label: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Manage Events", path: "/admin/events", icon: Calendar },
    { label: "User Accounts", path: "/admin/users", icon: Users },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-primary/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Layout */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-neutral-white border-r border-neutral-muted flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 px-6 border-b border-neutral-muted flex items-center justify-between">
            <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-2.5">
              <div className="h-9 w-9 bg-brand-gradient rounded-xl flex items-center justify-center text-neutral-white font-black shadow-soft">
                E
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-tight text-neutral-primary">Eventora</span>
                {isAdmin && <span className="text-[10px] font-bold text-primary uppercase tracking-widest -mt-0.5">Admin Console</span>}
              </div>
            </Link>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-secondary hover:bg-neutral-light hover:text-neutral-primary lg:hidden"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary-lightest text-primary border-l-2 border-primary pl-[12px]"
                      : "text-neutral-secondary hover:bg-neutral-light hover:text-neutral-primary"
                  )}
                >
                  <Icon size={18} className={isActive ? "text-primary" : "text-neutral-secondary"} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-muted">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger-lightest hover:text-danger-dark transition-all duration-200"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
