import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import orderService from "../services/orderService";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";
import { Calendar, MapPin, Ticket, CreditCard, Inbox, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../utils/cn";

export const BookingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");

  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["user-orders", user?.id],
    queryFn: () => orderService.getUserOrders(user.id),
    enabled: !!user?.id,
  });

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
      case "PAID":
      case "SUCCESS":
        return "bg-green-100 text-green-700 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "CANCELLED":
      case "FAILED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-neutral-light text-neutral-secondary border-neutral-muted";
    }
  };

  // Filter logic (assuming orders have an event object with a date, or we just show all if no date)
  // For now, since the API might not return nested event objects perfectly if it's a mock, we'll just show them all.
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "upcoming") {
      return order.status !== "CANCELLED"; // Or filter by date > now
    }
    return order.status === "CANCELLED"; // Just as an example for "past/cancelled"
  });

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
      <SectionHeader 
        title="My Bookings" 
        subtitle="Manage your event tickets and order history"
      />

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-neutral-muted mb-8">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={cn(
            "pb-3 text-sm font-bold transition-all border-b-2",
            activeTab === "upcoming" 
              ? "border-primary text-primary" 
              : "border-transparent text-neutral-secondary hover:text-neutral-primary"
          )}
        >
          Active Bookings
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={cn(
            "pb-3 text-sm font-bold transition-all border-b-2",
            activeTab === "past" 
              ? "border-primary text-primary" 
              : "border-transparent text-neutral-secondary hover:text-neutral-primary"
          )}
        >
          Past / Cancelled
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-32 rounded-2xl bg-neutral-white border border-neutral-muted animate-pulse"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 border border-danger-light bg-danger-lightest rounded-xl text-center">
          <p className="text-danger font-semibold">Failed to load your bookings.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-neutral-border rounded-2xl bg-neutral-white p-6">
          <div className="h-16 w-16 bg-neutral-light rounded-full flex items-center justify-center text-neutral-secondary mb-4 shadow-soft">
            <Inbox size={28} />
          </div>
          <h3 className="text-lg font-bold text-neutral-primary">No bookings found</h3>
          <p className="text-sm text-neutral-secondary mt-1.5 max-w-sm">
            You don't have any {activeTab === "upcoming" ? "active" : "past"} event bookings right now.
          </p>
          <Link to="/events">
            <Button variant="primary" className="mt-5 font-bold flex items-center gap-2">
              Browse Events <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.orderId || order.id} className="flex flex-col md:flex-row gap-6 p-6 bg-neutral-white border border-neutral-muted rounded-2xl shadow-soft">
              
              {/* Event Image Placeholder */}
              <div className="w-full md:w-48 h-32 bg-brand-gradient rounded-xl shrink-0 flex items-center justify-center text-white p-4">
                <span className="font-bold text-center drop-shadow-md">
                  {order.event?.title || `Event #${order.eventId?.substring(0, 5) || "N/A"}`}
                </span>
              </div>

              {/* Order Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-neutral-primary">
                      {order.event?.title || "Premium Event Ticket"}
                    </h3>
                    <span className={cn("px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider", getStatusColor(order.status))}>
                      {order.status || "CONFIRMED"}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-secondary mt-3">
                    {order.event?.date && (
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} />
                        <span>{new Date(order.event.date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {order.event?.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin size={16} />
                        <span>{order.event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 font-medium text-neutral-primary bg-neutral-light px-2 py-1 rounded-lg">
                      <Ticket size={16} className="text-primary" />
                      <span>{order.quantity} Ticket(s)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-muted">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-neutral-secondary" />
                    <span className="text-sm font-medium text-neutral-secondary">
                      Total Paid: <strong className="text-neutral-primary text-base">${order.amount || "0"}</strong>
                    </span>
                  </div>
                  
                  <div className="text-xs text-neutral-secondary">
                    Order ID: <span className="font-mono">{order.orderId || order.id}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
