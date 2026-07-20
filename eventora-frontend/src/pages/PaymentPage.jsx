import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, ShieldCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import orderService from "../services/orderService";
import paymentService from "../services/paymentService";
import Button from "../components/Button";

export const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getOrder(orderId);
      setOrder(data);
    } catch (error) {
      toast.error("Failed to load order details for payment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      toast.loading("Initiating payment...", { id: "payment" });
      
      // Step 1: Initiate payment (creates payment record)
      await paymentService.initiatePayment(orderId);
      
      // Step 2: Simulate the payment gateway callback with SUCCESS status
      toast.loading("Processing transaction...", { id: "payment" });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay for UX
      
      await paymentService.simulateCallback(orderId, "SUCCESS");
      
      toast.success("Payment Successful!", { id: "payment" });
      navigate("/bookings"); // Navigate to bookings/dashboard on success
      
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.", { id: "payment" });
    } finally {
      setIsProcessing(false);
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
              {/* Connecting Line Active (Past step 2, up to step 3) */}
              <div className="absolute top-5 left-0 w-full h-1 bg-primary rounded-full -z-0 transition-all duration-500"></div>
              
              {/* Step 1: Overview (Done) */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md cursor-pointer" onClick={() => navigate('/cart')}>
                  ✓
                </div>
                <span className="mt-3 text-sm font-semibold text-neutral-secondary">Overview</span>
              </div>

              {/* Step 2: Order Confirm (Done) */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md cursor-pointer" onClick={() => navigate(`/checkout/confirm/${orderId}`)}>
                  ✓
                </div>
                <span className="mt-3 text-sm font-semibold text-primary">Order Confirm</span>
              </div>

              {/* Step 3: Payment (Active) */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md ring-4 ring-primary/20">
                  3
                </div>
                <span className="mt-3 text-sm font-bold text-primary">Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="max-w-xl mx-auto w-full bg-neutral-white rounded-2xl border border-neutral-muted shadow-soft p-8 text-center space-y-6">
          
          <div className="w-20 h-20 bg-neutral-light rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-secondary w-10 h-10" />
          </div>
          
          <h2 className="text-2xl font-bold text-neutral-primary">Complete Your Payment</h2>
          
          <p className="text-neutral-secondary">
            You are about to securely pay for your order.
          </p>

          <div className="bg-neutral-light p-6 rounded-xl border border-neutral-border inline-block min-w-[250px]">
            <p className="text-sm font-semibold text-neutral-secondary uppercase tracking-wider mb-2">Total Amount Due</p>
            <p className="text-4xl font-extrabold text-primary">${order.amount.toFixed(2)}</p>
          </div>

          <div className="pt-4">
            <Button
              variant="primary"
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 text-base uppercase tracking-widest font-bold shadow-medium hover:shadow-premium flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin mr-2 w-5 h-5" />
                  Processing...
                </>
              ) : (
                <>
                  Pay Now
                  <CheckCircle className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
            <p className="text-xs text-neutral-secondary mt-4 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 mr-1 opacity-70" />
              Simulated Secure Payment Gateway
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentPage;
