import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, Bell, Search, Heart, ShoppingCart, LogOut, CheckCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import notificationService from "../services/notificationService";
import Button from "../components/Button";
import { cn } from "../utils/cn";
import toast from "react-hot-toast";

export const PublicNavbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getNotifications,
    enabled: !!isAuthenticated,
    refetchInterval: 30000, // Poll every 30s
  });

  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;

  const markAsReadMutation = useMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries(["notifications"]);
      // Snapshot the previous value
      const previousNotifications = queryClient.getQueryData(["notifications"]);
      // Optimistically update to the new value
      queryClient.setQueryData(["notifications"], (old) => {
        if (!old) return [];
        return old.map(n => {
          if ((n.notificationId || n.id) === id) {
            return { ...n, isRead: true, read: true };
          }
          return n;
        });
      });
      // Return a context object with the snapshotted value
      return { previousNotifications };
    },
    onError: (err, id, context) => {
      console.error("Mark as read failed:", err);
      toast.error("Failed to mark notification as read");
      if (context?.previousNotifications) {
        queryClient.setQueryData(["notifications"], context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["notifications"]);
    }
  });

  const handleNotificationClick = (n) => {
    console.log("Clicked notification:", n);
    const id = n.notificationId || n.id;
    
    if (!id) {
      console.error("No valid ID found on notification:", n);
      return;
    }

    if (!n.isRead && !n.read) {
      markAsReadMutation.mutate(id);
    }
  };


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchVal)}`);
    }
  };

  return (
    <header className="h-16 px-4 md:px-6 bg-neutral-white/85 backdrop-blur-md border-b border-neutral-muted flex items-center justify-between sticky top-0 z-50 shadow-soft">
      {/* Left logo */}
      <Link to="/" className="flex items-center gap-2.5 shrink-0">
        <div className="h-9 w-9 bg-brand-gradient rounded-xl flex items-center justify-center text-neutral-white font-black shadow-soft">
          E
        </div>
        <span className="font-extrabold text-lg tracking-tight text-neutral-primary">Eventora</span>
      </Link>



      {/* Right navigation & controls */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <>
              <Link to="/favorites" className="p-1.5 rounded-lg text-neutral-secondary hover:bg-neutral-light hover:text-neutral-primary transition-colors cursor-pointer focus:outline-none">
                <Heart size={16} />
              </Link>
              <Link to="/cart" className="p-1.5 rounded-lg text-neutral-secondary hover:bg-neutral-light hover:text-neutral-primary transition-colors cursor-pointer focus:outline-none">
                <ShoppingCart size={16} />
              </Link>
              <div className="relative">
                <button 
                  onClick={() => {
                    setNotificationsDropdownOpen(!notificationsDropdownOpen);
                    setProfileDropdownOpen(false);
                  }}
                  className="p-1.5 rounded-lg text-neutral-secondary hover:bg-neutral-light hover:text-neutral-primary relative cursor-pointer focus:outline-none"
                >
                  <Bell size={16} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full border border-white"></span>
                  )}
                </button>
                
                {notificationsDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-neutral-white rounded-xl shadow-premium border border-neutral-muted overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-muted bg-neutral-lightest">
                      <h3 className="font-bold text-sm text-neutral-primary">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-neutral-secondary">
                          No notifications yet.
                        </div>
                      ) : (
                        <div className="divide-y divide-neutral-muted">
                          {notifications.map((n) => (
                            <div 
                              key={n.notificationId || n.id || Math.random()}
                              onClick={() => handleNotificationClick(n)}
                              className={cn(
                                "p-4 transition-colors cursor-pointer hover:bg-neutral-light",
                                (!n.isRead && !n.read) ? "bg-primary-lightest/30" : ""
                              )}
                            >
                              <div className="flex gap-3">
                                <div className={cn(
                                  "w-2 h-2 rounded-full mt-1.5 shrink-0",
                                  (!n.isRead && !n.read) ? "bg-secondary" : "bg-transparent"
                                )}></div>
                                <div>
                                  <p className={cn("text-sm", !n.isRead ? "font-semibold text-neutral-primary" : "text-neutral-secondary")}>
                                    {n.message || n.title}
                                  </p>
                                  <p className="text-xs text-neutral-secondary mt-1">
                                    {new Date(n.createdAt || Date.now()).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          {isAuthenticated ? (
            <div className="relative">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotificationsDropdownOpen(false);
                }}
                className="font-bold flex items-center gap-1.5 text-xs px-3.5 py-2"
              >
                <User size={14} />
                Account
              </Button>
              
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-neutral-white rounded-xl shadow-premium border border-neutral-muted py-2 z-50">
                  <Link 
                    to="/bookings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-primary hover:bg-neutral-light transition-colors"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <User size={16} />
                    My Bookings
                  </Link>
                  <Link 
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-primary hover:bg-neutral-light transition-colors"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <User size={16} />
                    Profile Settings
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-neutral-light transition-colors w-full text-left cursor-pointer"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button variant="primary" className="font-bold text-xs px-4 py-2">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-1.5 rounded-lg text-neutral-secondary hover:bg-neutral-light hover:text-neutral-primary lg:hidden transition-colors cursor-pointer"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile navigation drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-neutral-primary/20 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="fixed top-0 bottom-0 right-0 w-72 bg-neutral-white shadow-premium z-50 lg:hidden p-6 flex flex-col justify-between transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-muted pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-brand-gradient rounded-lg flex items-center justify-center text-neutral-white font-bold">
                    E
                  </div>
                  <span className="font-bold text-neutral-primary">Eventora</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-lg text-neutral-secondary hover:bg-neutral-light hover:text-neutral-primary transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>


            </div>

            <div className="border-t border-neutral-muted pt-4">
              {isAuthenticated ? (
                <Link to={user?.role === "Admin" ? "/admin/dashboard" : "/dashboard"} onClick={() => setDrawerOpen(false)}>
                  <Button variant="secondary" className="w-full font-bold flex items-center justify-center gap-2">
                    <User size={16} />
                    Go to Console
                  </Button>
                </Link>
              ) : (
                <Link to="/login" onClick={() => setDrawerOpen(false)}>
                  <Button variant="primary" className="w-full font-bold">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default PublicNavbar;
