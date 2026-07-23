import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreditCard, ShoppingCart, ShieldCheck, MapPin, Calendar, Copy, Ticket, CheckCircle, ArrowRight, Ban, Mail, History } from "lucide-react";
import toast from "react-hot-toast";
import orderService from "../services/orderService";
import eventService from "../services/eventService";
import Button from "../components/Button";
import { format, parseISO } from "date-fns";

export const OrderConfirmPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getOrder(orderId);
      setOrder(data);
      if (data?.eventId) {
        const eventData = await eventService.getEventDetails(data.eventId);
        setEventDetails(eventData);
      }
    } catch (error) {
      toast.error("Failed to load order details.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyOrderId = () => {
    if (order?.orderId) {
      navigator.clipboard.writeText(order.orderId);
      toast.success("Order ID copied to clipboard!");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return format(parseISO(dateStr), "dd MMM, yyyy • h:mm a") + " Onwards";
    } catch (e) {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center text-center">
        <h2 className="text-3xl font-extrabold text-neutral-primary">Order Not Found</h2>
        <Button onClick={() => navigate("/events")} className="mt-6 px-8 py-3">Back to Events</Button>
      </div>
    );
  }

  // Calculate dummy fees to match UI mockup
  const subtotal = order.amount || 0;
  const serviceFee = 120.00;
  const tax = 125.00;
  const totalAmount = subtotal + serviceFee + tax;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-neutral-lightest min-h-screen font-sans">
      <div className="flex flex-col space-y-4">
        
        {/* Checkout Steps Progress */}
        <div className="bg-neutral-white p-4 md:p-6 rounded-[24px] border border-neutral-muted shadow-sm">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative">
            {/* Connecting Line Background */}
            <div className="absolute top-6 left-[15%] right-[15%] h-0.5 bg-neutral-200 -z-0"></div>
            {/* Connecting Line Active */}
            <div className="absolute top-6 left-[15%] w-[35%] h-0.5 bg-[#8b5cf6] -z-0"></div>
            
            {/* Step 1: Overview */}
            <div className="flex flex-col items-center relative z-10 w-1/3 group cursor-pointer" onClick={() => navigate('/cart')}>
              <div className="w-12 h-12 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center font-bold shadow-md">
                ✓
              </div>
              <span className="mt-3 text-[15px] font-bold text-neutral-primary">Overview</span>
              <span className="text-xs text-neutral-secondary">Review your cart</span>
            </div>

            {/* Step 2: Order Confirm */}
            <div className="flex flex-col items-center relative z-10 w-1/3">
              <div className="w-12 h-12 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center font-bold shadow-md ring-4 ring-[#8b5cf6]/20">
                2
              </div>
              <span className="mt-3 text-[15px] font-bold text-[#8b5cf6]">Order Confirm</span>
              <span className="text-xs text-neutral-secondary">Confirm your order</span>
            </div>

            {/* Step 3: Payment */}
            <div className="flex flex-col items-center relative z-10 w-1/3">
              <div className="w-12 h-12 rounded-full bg-white text-neutral-400 border-2 border-neutral-200 flex items-center justify-center font-bold">
                3
              </div>
              <span className="mt-3 text-[15px] font-bold text-neutral-primary">Payment</span>
              <span className="text-xs text-neutral-secondary">Secure your payment</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-neutral-white rounded-[24px] border border-neutral-muted shadow-sm p-4 md:p-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] flex items-center justify-center shadow-inner shrink-0">
                <ShieldCheck size={32} className="text-white opacity-90" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-neutral-primary tracking-tight">Order Summary</h2>
                <p className="text-sm text-neutral-secondary font-medium">Please review your order details before proceeding to payment</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 bg-[#f3e8ff] px-4 py-2 rounded-full flex items-center gap-2 border border-[#e9d5ff]">
              <ShieldCheck size={16} className="text-[#8b5cf6]" />
              <span className="text-sm font-bold text-[#8b5cf6]">Secure & Encrypted</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            {/* Left Column */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              
              {/* Event Card */}
              <div className="bg-gradient-to-br from-[#fcf7ff] to-[#fff5f8] rounded-[24px] p-4 border border-[#f3e8ff] flex flex-col md:flex-row gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-100/50 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                {/* Event Image */}
                <div 
                  className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-purple-600 to-orange-500 rounded-[24px] shrink-0 shadow-lg relative flex flex-col items-center justify-center overflow-hidden"
                  style={eventDetails?.imageUrl ? { backgroundImage: `url(${eventDetails.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                </div>
                
                <div className="flex flex-col justify-center relative z-10">
                  <div className="inline-block bg-[#f3e8ff] text-[#8b5cf6] text-xs font-bold px-3 py-1 rounded-full mb-3 w-max border border-[#e9d5ff]">
                    Conference
                  </div>
                  <h3 className="text-xl font-black text-neutral-primary leading-tight mb-3">{eventDetails?.title || "Event Name"}</h3>
                  
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-[15px] text-neutral-secondary font-medium gap-2">
                      <MapPin size={18} className="text-[#8b5cf6]" />
                      <span>{eventDetails?.city || "Location"}</span>
                    </div>
                    <div className="flex items-center text-[15px] text-neutral-secondary font-medium gap-2">
                      <Calendar size={18} className="text-[#8b5cf6]" />
                      <span>{formatDate(eventDetails?.date)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#f8fafc] p-4 rounded-[24px] border border-neutral-100 flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#f1f5f9] rounded-2xl flex items-center justify-center text-[#8b5cf6]">
                    <Ticket size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-secondary mb-1">Quantity</p>
                    <p className="text-lg font-black text-neutral-primary">{order.quantity} Ticket{order.quantity > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="bg-[#f8fafc] p-4 rounded-[24px] border border-neutral-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#f1f5f9] rounded-2xl flex items-center justify-center text-[#8b5cf6]">
                    <CreditCard size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-secondary mb-1">Total Amount</p>
                    <p className="text-xl font-black text-[#8b5cf6] tracking-tight">₹{totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Right Column */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-[24px] border border-neutral-200 shadow-sm p-4 h-full flex flex-col relative overflow-hidden">
                <div className="w-full mb-4">
                  <p className="text-[13px] font-bold text-neutral-secondary mb-2">Order ID</p>
                  <div className="flex items-center justify-between border border-neutral-200 rounded-xl p-3 bg-[#f8fafc]">
                    <p className="font-mono text-xs text-neutral-primary truncate mr-2">
                      {order.orderId}
                    </p>
                    <button onClick={copyOrderId} className="text-neutral-400 hover:text-[#8b5cf6] transition-colors p-1" title="Copy ID">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 space-y-3 mb-4">
                  <div className="flex items-start gap-3">
                    <Ban size={18} className="text-[#8b5cf6] mt-0.5 shrink-0" strokeWidth={2} />
                    <span className="text-[14px] font-medium text-neutral-secondary leading-snug">Tickets are non-transferable</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-[#8b5cf6] mt-0.5 shrink-0" strokeWidth={2} />
                    <span className="text-[14px] font-medium text-neutral-secondary leading-snug">You will receive an e-ticket via email</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <History size={18} className="text-[#b19cd9] mt-0.5 shrink-0" strokeWidth={2} />
                    <span className="text-[14px] font-medium text-neutral-500 leading-snug">Cancellation available up to 24h before event</span>
                  </div>
                </div>
                
                <Button
                  variant="primary"
                  onClick={() => navigate(`/checkout/payment/${order.orderId}`)}
                  className="w-full py-3 text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-between px-5 rounded-[16px] bg-gradient-to-r from-[#8b5cf6] to-[#f97316] border-0 text-white mt-auto"
                >
                  <div className="flex items-center">
                    <ShieldCheck className="mr-2 w-4 h-4 opacity-90" />
                    Proceed to Payment
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-90" />
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmPage;
