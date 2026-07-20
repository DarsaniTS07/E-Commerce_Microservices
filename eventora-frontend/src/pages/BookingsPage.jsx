import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import orderService from "../services/orderService";
import Button from "../components/Button";
import { Calendar, MapPin, Ticket, CreditCard, Inbox, ArrowRight, Clock, Copy, MoreVertical, Lock, ShieldCheck, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";

export const BookingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("active");
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["user-orders", user?.id],
    queryFn: () => orderService.getUserOrders(user.id),
    enabled: !!user?.id,
  });

  const cancelMutation = useMutation({
    mutationFn: (orderId) => orderService.cancelOrder(orderId),
    onSuccess: () => {
      toast.success("Order cancelled successfully");
      queryClient.invalidateQueries(["user-orders", user?.id]);
      setActiveDropdownId(null);
    },
    onError: () => {
      toast.error("Failed to cancel order");
    }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return format(parseISO(dateStr), "dd MMM, yyyy") + " • " + format(parseISO(dateStr), "h:mm a") + " Onwards";
    } catch (e) {
      return dateStr;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "active") {
      return order.status !== "CANCELLED" && order.status !== "FAILED";
    }
    return order.status === "CANCELLED" || order.status === "FAILED";
  });

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-4 font-sans bg-neutral-lightest min-h-screen">

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-6 bg-neutral-white rounded-[24px] border border-neutral-muted shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#f3e8ff] rounded-[16px] flex items-center justify-center shrink-0">
            <Ticket size={28} className="text-[#8b5cf6]" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-neutral-primary tracking-tight">My Bookings</h1>
            <p className="text-sm font-medium text-neutral-secondary mt-0.5">Manage your event tickets and order history</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b-2 border-neutral-100">
        <button
          onClick={() => setActiveTab("active")}
          className={cn(
            "pb-3 text-sm font-bold transition-all relative flex items-center gap-2",
            activeTab === "active"
              ? "text-[#8b5cf6]"
              : "text-neutral-secondary hover:text-neutral-primary"
          )}
        >
          <Ticket size={16} />
          Active Bookings
          {activeTab === "active" && (
            <div className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-[#8b5cf6] rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={cn(
            "pb-3 text-sm font-bold transition-all relative flex items-center gap-2",
            activeTab === "past"
              ? "text-[#8b5cf6]"
              : "text-neutral-secondary hover:text-neutral-primary"
          )}
        >
          <Clock size={16} />
          Past / Cancelled
          {activeTab === "past" && (
            <div className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-[#8b5cf6] rounded-t-full"></div>
          )}
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-40 rounded-[24px] bg-neutral-white border border-neutral-muted animate-pulse"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-6 border border-red-200 bg-red-50 rounded-[24px] text-center">
          <p className="text-red-600 font-bold">Failed to load your bookings.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-neutral-300 rounded-[24px] bg-neutral-white p-6 shadow-sm">
          <div className="h-16 w-16 bg-[#f3e8ff] rounded-2xl flex items-center justify-center text-[#8b5cf6] mb-4">
            <Inbox size={28} />
          </div>
          <h3 className="text-lg font-black text-neutral-primary">No bookings found</h3>
          <p className="text-sm font-medium text-neutral-secondary mt-1.5 max-w-sm">
            You don't have any {activeTab === "active" ? "active" : "past"} event bookings right now.
          </p>
          <Button onClick={() => navigate("/events")} className="mt-5 font-bold flex items-center gap-2 px-6 py-2.5 rounded-[12px]">
            Browse Events <ArrowRight size={16} />
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isPending = order.status?.toUpperCase() === "PENDING";
            const isConfirmed = order.status?.toUpperCase() === "CONFIRMED" || order.status?.toUpperCase() === "SUCCESS" || order.status?.toUpperCase() === "PAID";

            return (
              <div key={order.orderId || order.id} className="flex flex-col lg:flex-row bg-neutral-white border border-neutral-muted rounded-[24px] shadow-sm overflow-hidden p-3 md:p-4 gap-4">

                {/* Event Image Mock */}
                <div className="w-full lg:w-48 h-40 lg:h-auto bg-gradient-to-br from-[#4f2a96] via-[#862973] to-[#e44655] rounded-xl shrink-0 shadow-inner relative flex flex-col items-center justify-center overflow-hidden">
                  <div className="text-white font-bold text-2xl mb-1">aws</div>
                  <div className="text-white text-[10px] tracking-[0.25em] uppercase opacity-90 font-medium">Summit</div>
                  <div className="text-white text-xs font-semibold mt-1">2026</div>
                  <svg width="32" height="12" viewBox="0 0 100 30" className="absolute top-[60%] left-1/2 -translate-x-1/2 fill-[#ff9900]">
                    <path d="M93.3,16.5c-15.6,12.5-38.3,17.4-60.6,12.1C18,25,5.6,17.7,1.1,12c-0.8-1,0.5-2.2,1.6-1.5c16.3,10.6,39.6,14.6,58.7,9.3c10-2.8,18.8-7.7,25.6-14c1.2-1.1,3-0.5,3.1,1.1C90.3,10.6,91.5,13.8,93.3,16.5z" />
                  </svg>
                </div>

                {/* Event Details */}
                <div className="flex-1 flex flex-col justify-between py-2 lg:px-2 relative">
                  <div>
                    <div className="inline-flex items-center bg-[#f3e8ff] text-[#8b5cf6] text-[10px] font-black uppercase px-2 py-1 rounded-full mb-2">
                      Conference
                    </div>

                    <h3 className="text-lg md:text-xl font-black text-neutral-primary tracking-tight">
                      {order.event?.title || `Event #${order.eventId?.substring(0, 5) || "N/A"}`}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-secondary mt-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-neutral-400" />
                        <span>{order.event?.date ? formatDate(order.event.date) : "TBD"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-neutral-400" />
                        <span>{order.event?.location || "Chennai"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-5">
                    <div className="flex items-center gap-3 bg-[#f8fafc] border border-neutral-100 px-4 py-2.5 rounded-[14px]">
                      <div className="text-[#8b5cf6] bg-[#f3e8ff] p-1.5 rounded-lg shrink-0">
                        <Ticket size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-neutral-primary leading-none">{order.quantity} Ticket</span>
                        <span className="text-[10px] font-medium text-neutral-secondary mt-1">General Admission</span>
                      </div>
                    </div>

                    <div className="flex flex-col pl-4 border-l border-neutral-200">
                      <span className="text-[10px] font-bold text-neutral-secondary uppercase tracking-wider mb-0.5">Total Paid</span>
                      <span className="text-lg font-black text-[#8b5cf6] leading-none">₹{order.amount ? order.amount.toFixed(2) : "0.00"}</span>
                    </div>
                  </div>
                </div>

                {/* Right Actions & Status */}
                <div className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l border-neutral-200 border-dashed pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between items-start lg:items-end relative">

                  {/* Status Badge */}
                  <div className="mb-4 lg:mb-0 lg:absolute lg:top-2 lg:right-2">
                    {isConfirmed && (
                      <div className="flex items-center gap-1.5 bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        <CheckCircle size={12} />
                        CONFIRMED
                      </div>
                    )}
                    {isPending && (
                      <div className="flex items-center gap-1.5 bg-[#fffbeb] text-[#d97706] border border-[#fde68a] px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        <Clock size={12} />
                        PENDING PAYMENT
                      </div>
                    )}
                    {!isConfirmed && !isPending && (
                      <div className="flex items-center gap-1.5 bg-neutral-100 text-neutral-500 border border-neutral-200 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {order.status}
                      </div>
                    )}
                  </div>

                  {/* Booking ID */}
                  <div className="w-full mt-2 lg:mt-12">
                    <p className="text-[10px] font-bold text-neutral-secondary uppercase tracking-wider mb-1">Booking ID</p>
                    <div className="flex items-center justify-between gap-2 bg-[#f8fafc] border border-neutral-100 px-3 py-1.5 rounded-lg w-full">
                      <span className="text-xs font-mono text-neutral-600 truncate">{order.orderId || order.id}</span>
                      <button onClick={() => handleCopy(order.orderId || order.id)} className="text-neutral-400 hover:text-neutral-600 transition-colors shrink-0">
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 w-full justify-end relative">
                    {isConfirmed ? (
                      <Button variant="outline" className="flex-1 lg:flex-none border-2 border-neutral-200 hover:border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#f3e8ff] text-xs font-bold py-2 px-4 rounded-[12px] flex items-center justify-center gap-1.5 transition-all">
                        <Ticket size={14} /> View Ticket
                      </Button>
                    ) : isPending ? (
                      <Button onClick={() => navigate(`/checkout/payment/${order.orderId || order.id}`)} className="flex-1 lg:flex-none bg-gradient-to-r from-[#8b5cf6] to-[#f97316] text-white border-0 text-xs font-bold py-2.5 px-4 rounded-[12px] flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all">
                        <Lock size={12} /> Pay Now
                      </Button>
                    ) : null}

                    {/* 3-Dots Menu */}
                    <div className="relative" ref={activeDropdownId === (order.orderId || order.id) ? dropdownRef : null}>
                      <button
                        onClick={() => setActiveDropdownId(activeDropdownId === (order.orderId || order.id) ? null : (order.orderId || order.id))}
                        className="w-9 h-9 flex items-center justify-center rounded-[12px] border border-neutral-200 hover:bg-neutral-50 text-neutral-500 hover:text-neutral-primary transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown Menu */}
                      {activeDropdownId === (order.orderId || order.id) && (
                        <div className="absolute right-0 bottom-[120%] lg:bottom-auto lg:top-[120%] mt-2 w-40 bg-white border border-neutral-200 shadow-lg rounded-xl z-50 overflow-hidden">
                          <button
                            onClick={() => cancelMutation.mutate(order.orderId || order.id)}
                            disabled={cancelMutation.isPending || order.status === "CANCELLED"}
                            className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                          >
                            Cancel Order
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
