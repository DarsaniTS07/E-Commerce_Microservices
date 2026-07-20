import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CreditCard, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import orderService from "../services/orderService";
import eventService from "../services/eventService";
import Button from "../components/Button";

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-primary tracking-tight">Checkout</h1>
          
          {/* Checkout Steps Progress */}
          <div className="mt-8 bg-neutral-white p-8 rounded-2xl border border-neutral-muted shadow-soft">
            <div className="flex items-center justify-between max-w-2xl mx-auto relative">
              {/* Connecting Line Background */}
              <div className="absolute top-5 left-0 w-full h-1 bg-neutral-light rounded-full -z-0"></div>
              {/* Connecting Line Active (Past step 1, up to step 2) */}
              <div className="absolute top-5 left-0 w-1/2 h-1 bg-primary rounded-full -z-0 transition-all duration-500"></div>
              
              {/* Step 1: Overview (Done) */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md cursor-pointer" onClick={() => navigate('/cart')}>
                  ✓
                </div>
                <span className="mt-3 text-sm font-semibold text-neutral-secondary">Overview</span>
              </div>

              {/* Step 2: Order Confirm (Active) */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md ring-4 ring-primary/20">
                  2
                </div>
                <span className="mt-3 text-sm font-bold text-primary">Order Confirm</span>
              </div>

              {/* Step 3: Payment (Pending) */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-10 h-10 rounded-full bg-neutral-white text-neutral-secondary border-2 border-neutral-muted flex items-center justify-center font-bold">
                  3
                </div>
                <span className="mt-3 text-sm font-semibold text-neutral-secondary">Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-neutral-white rounded-2xl border border-neutral-muted shadow-soft p-8">
          <h2 className="text-xl font-bold text-neutral-primary mb-6">Order Summary</h2>
          
          <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
            {/* Event Info */}
            <div className="flex-1 space-y-4">
              <div className="p-4 bg-neutral-light rounded-xl border border-neutral-border">
                <p className="text-sm font-semibold text-neutral-secondary uppercase tracking-wider mb-1">Event</p>
                <p className="text-lg font-bold text-neutral-primary">{eventDetails?.title || "Unknown Event"}</p>
                {eventDetails?.city && <p className="text-sm text-neutral-secondary">{eventDetails.city}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-light rounded-xl border border-neutral-border">
                  <p className="text-sm font-semibold text-neutral-secondary uppercase tracking-wider mb-1">Quantity</p>
                  <p className="text-lg font-bold text-neutral-primary">{order.quantity} ticket{order.quantity > 1 ? 's' : ''}</p>
                </div>
                <div className="p-4 bg-neutral-light rounded-xl border border-neutral-border">
                  <p className="text-sm font-semibold text-neutral-secondary uppercase tracking-wider mb-1">Total Amount</p>
                  <p className="text-lg font-extrabold text-primary">${order.amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            {/* Action Bar */}
            <div className="mt-8 md:mt-0 w-full md:w-1/3 bg-neutral-light p-6 rounded-xl border border-neutral-border flex flex-col space-y-6">
              <div>
                <p className="text-sm text-neutral-secondary mb-2">Order ID</p>
                <p className="font-mono text-xs font-medium text-neutral-primary bg-neutral-white px-2 py-1 rounded truncate">
                  {order.orderId}
                </p>
              </div>
              
              <Button
                variant="primary"
                onClick={() => navigate(`/checkout/payment/${order.orderId}`)}
                className="w-full flex justify-center items-center py-4 text-sm uppercase tracking-widest font-bold shadow-medium hover:shadow-premium"
              >
                Proceed to Payment
                <CreditCard className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmPage;
