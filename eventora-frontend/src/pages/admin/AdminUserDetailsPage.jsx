import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Calendar, Activity, Ticket, Clock } from "lucide-react";
import userService from "../../services/userService";
import orderService from "../../services/orderService";
import waitlistService from "../../services/waitlistService";
import { cn } from "../../utils/cn";

export const AdminUserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["admin-user-details", userId],
    queryFn: () => userService.getUserDetails(userId),
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-user-orders", userId],
    queryFn: () => orderService.getUserOrders(userId),
  });

  const { data: waitlists = [], isLoading: waitlistsLoading } = useQuery({
    queryKey: ["admin-user-waitlists", userId],
    queryFn: () => waitlistService.getUserWaitlists(userId),
  });

  if (userLoading) {
    return <div className="p-8 text-center text-neutral-secondary">Loading user profile...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-red-500 font-bold">User not found</div>;
  }

  return (
    <div className="p-3 md:p-4 lg:p-6 space-y-4 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/admin/users")}
          className="p-2 bg-neutral-white border border-neutral-muted rounded-xl hover:bg-neutral-light transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-primary">User Profile</h1>
          <p className="text-sm text-neutral-secondary mt-1">Detailed view of user activity and bookings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-neutral-white p-6 rounded-[24px] border border-neutral-muted shadow-sm flex flex-col items-center text-center md:sticky md:top-8 md:self-start">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20">
            <User size={32} />
          </div>
          <h2 className="text-xl font-bold text-neutral-primary">{user.name || "Unknown"}</h2>
          <p className="flex items-center gap-1.5 text-sm text-neutral-secondary mt-2">
            <Mail size={14} /> {user.email || "No email"}
          </p>
          <div className="mt-6 flex flex-col gap-3 w-full text-left">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-secondary">Status</span>
              <span className={cn(
                "font-bold",
                user.status === 'CONFIRMED' || user.status === 'FORCE_CHANGE_PASSWORD' ? "text-emerald-600" : "text-amber-600"
              )}>{user.status || 'UNCONFIRMED'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-secondary">Enabled</span>
              <span className="font-bold text-neutral-primary">{user.enabled ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-secondary">Joined</span>
              <span className="font-bold text-neutral-primary flex items-center gap-1">
                <Calendar size={14}/> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-secondary">Total Orders</span>
              <span className="font-bold text-neutral-primary">{orders.length}</span>
            </div>
          </div>
        </div>

        {/* Orders & Activity */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-neutral-white p-6 rounded-[24px] border border-neutral-muted shadow-sm">
            <h3 className="text-lg font-bold text-neutral-primary flex items-center gap-2 mb-4">
              <Ticket size={20} className="text-primary" /> Booking History
            </h3>
            {ordersLoading ? (
              <div className="text-sm text-neutral-secondary">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-sm text-neutral-secondary">No orders found for this user.</div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.orderId} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border border-neutral-muted rounded-xl bg-neutral-lightest/50 gap-4">
                    <div>
                      <div className="font-bold text-neutral-primary">{order.event?.title || "Unknown Event"}</div>
                      <div className="text-xs text-neutral-secondary mt-1">Order ID: {order.orderId}</div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                      <span className={cn(
                        "inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                        order.status === 'CONFIRMED' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                        order.status === 'CANCELLED' ? "bg-red-50 text-red-600 border-red-200" :
                        "bg-amber-50 text-amber-600 border-amber-200"
                      )}>
                        {order.status}
                      </span>
                      <div className="text-sm font-bold">
                        ₹{order.amount} <span className="text-xs text-neutral-secondary font-normal">({order.quantity} tickets)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-neutral-white p-6 rounded-[24px] border border-neutral-muted shadow-sm">
            <h3 className="text-lg font-bold text-neutral-primary flex items-center gap-2 mb-4">
              <Clock size={20} className="text-primary" /> Waitlist Entries
            </h3>
            {waitlistsLoading ? (
              <div className="text-sm text-neutral-secondary">Loading waitlists...</div>
            ) : waitlists.length === 0 ? (
              <div className="text-sm text-neutral-secondary">No active waitlists.</div>
            ) : (
              <div className="space-y-4">
                {waitlists.map(waitlist => (
                  <div key={waitlist.eventId} className="flex justify-between items-center p-4 border border-neutral-muted rounded-xl bg-neutral-lightest/50">
                    <div className="font-bold text-neutral-primary">{waitlist.event?.title || "Event ID: " + waitlist.eventId}</div>
                    <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-amber-50 text-amber-600 border-amber-200">
                      {waitlist.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetailsPage;
