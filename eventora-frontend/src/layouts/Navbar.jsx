import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Bell, LogOut, Settings, Shield } from "lucide-react";
import useAuth from "../hooks/useAuth";
import Breadcrumb from "../components/Breadcrumb";

export const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";
  };

  return (
    <header className="h-16 px-4 md:px-6 bg-neutral-white border-b border-neutral-muted flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg text-neutral-secondary hover:bg-neutral-light hover:text-neutral-primary lg:hidden transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Dynamic breadcrumb navigation */}
        <Breadcrumb className="hidden sm:flex" />
      </div>

      <div className="flex items-center gap-3.5">
        {/* Notifications Icon */}
        <button className="p-1.5 rounded-lg text-neutral-secondary hover:bg-neutral-light hover:text-neutral-primary transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="h-8 w-8 rounded-full bg-brand-gradient flex items-center justify-center text-neutral-white text-xs font-bold shadow-soft">
              {getInitials(user?.name)}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-neutral-primary leading-tight">{user?.name}</span>
              <span className="text-[10px] text-neutral-secondary capitalize">{user?.role}</span>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-neutral-white border border-neutral-muted rounded-xl shadow-premium py-2 z-50">
              {/* Profile Details */}
              <div className="px-4 py-2 border-b border-neutral-muted flex flex-col">
                <span className="text-xs font-bold text-neutral-primary">{user?.name}</span>
                <span className="text-[10px] text-neutral-secondary truncate">{user?.email}</span>
                <span className="inline-flex mt-1 items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary-lightest text-primary w-fit uppercase tracking-widest">
                  {user?.role}
                </span>
              </div>

              {/* Action Selections */}
              <div className="p-1.5 space-y-0.5">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-secondary hover:bg-neutral-light hover:text-neutral-primary transition-colors"
                >
                  <Settings size={14} />
                  Settings & Security
                </Link>
                {user?.role === "Admin" && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-secondary hover:bg-neutral-light hover:text-neutral-primary transition-colors"
                  >
                    <Shield size={14} />
                    Admin Dashboard
                  </Link>
                )}
              </div>

              <div className="border-t border-neutral-muted p-1.5 mt-1.5">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-danger hover:bg-danger-lightest hover:text-danger-dark transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
