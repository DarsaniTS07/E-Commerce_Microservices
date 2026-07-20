import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, ShieldCheck, Loader2, Calendar, MapPin, CreditCard, Ticket, Info, Headphones } from "lucide-react";
import toast from "react-hot-toast";
import orderService from "../services/orderService";
import paymentService from "../services/paymentService";
import eventService from "../services/eventService";
import Button from "../components/Button";
import { format, parseISO } from "date-fns";

export const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("card");

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
      toast.error("Failed to load order details for payment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      toast.loading("Initiating payment...", { id: "payment" });
      
      await paymentService.initiatePayment(orderId);
      
      toast.loading("Processing transaction...", { id: "payment" });
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      await paymentService.simulateCallback(orderId, "SUCCESS");
      
      toast.success("Payment Successful!", { id: "payment" });
      navigate("/bookings"); 
      
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.", { id: "payment" });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return format(parseISO(dateStr), "dd MMM, yyyy");
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
  const totalAmountDue = subtotal + serviceFee + tax;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-neutral-lightest min-h-screen">
      <div className="flex flex-col space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-primary tracking-tight">Checkout</h1>
          
          {/* Checkout Steps Progress */}
          <div className="mt-8 bg-neutral-white p-6 md:p-8 rounded-[24px] border border-neutral-muted shadow-sm">
            <div className="flex items-center justify-between max-w-3xl mx-auto relative">
              {/* Connecting Line Background */}
              <div className="absolute top-6 left-[15%] right-[15%] h-0.5 bg-neutral-200 -z-0"></div>
              {/* Connecting Line Active */}
              <div className="absolute top-6 left-[15%] w-[70%] h-0.5 bg-[#8b5cf6] -z-0"></div>
              
              {/* Step 1: Overview */}
              <div className="flex flex-col items-center relative z-10 w-1/3 group cursor-pointer" onClick={() => navigate('/cart')}>
                <div className="w-12 h-12 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center font-bold shadow-md">
                  ✓
                </div>
                <span className="mt-3 text-[15px] font-bold text-neutral-primary">Overview</span>
                <span className="text-xs text-neutral-secondary">Review your cart</span>
              </div>

              {/* Step 2: Order Confirm */}
              <div className="flex flex-col items-center relative z-10 w-1/3 group cursor-pointer" onClick={() => navigate(`/checkout/confirm/${orderId}`)}>
                <div className="w-12 h-12 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center font-bold shadow-md">
                  ✓
                </div>
                <span className="mt-3 text-[15px] font-bold text-neutral-primary">Order Confirm</span>
                <span className="text-xs text-neutral-secondary">Confirm your order</span>
              </div>

              {/* Step 3: Payment */}
              <div className="flex flex-col items-center relative z-10 w-1/3">
                <div className="w-12 h-12 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center font-bold shadow-md ring-4 ring-[#8b5cf6]/20">
                  3
                </div>
                <span className="mt-3 text-[15px] font-bold text-[#8b5cf6]">Payment</span>
                <span className="text-xs text-neutral-secondary">Secure your payment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="bg-neutral-white rounded-2xl border border-neutral-muted shadow-sm p-6 md:p-8 h-full">
              <h2 className="text-xl font-extrabold text-neutral-primary mb-6">Order Summary</h2>
              
              {/* Event Card */}
              <div className="flex items-center gap-4 p-4 border border-neutral-muted rounded-xl bg-neutral-white mb-6 shadow-sm">
                <div className="w-24 h-24 bg-brand-gradient rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-inner overflow-hidden">
                   {/* In a real app, you'd use eventDetails.image */}
                   <div className="w-full h-full bg-primary/20 flex items-center justify-center backdrop-blur-md">
                     <Ticket className="text-white opacity-80" />
                   </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-primary text-lg leading-tight mb-2">{eventDetails?.title || "Event Name"}</h3>
                  <div className="flex items-center text-sm text-neutral-secondary mb-1 gap-1.5 font-medium">
                    <Calendar size={14} />
                    <span>{formatDate(eventDetails?.date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-secondary gap-1.5 font-medium">
                    <MapPin size={14} />
                    <span>{eventDetails?.city || "Location"}</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="flex justify-between items-center py-4 border-b border-neutral-muted border-dashed">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-neutral-primary">General Admission</span>
                  <span className="text-xs font-bold text-primary bg-primary-lightest px-2.5 py-1 rounded-full">{order.quantity} Ticket{order.quantity > 1 ? 's' : ''}</span>
                </div>
                <span className="font-bold text-neutral-primary">₹{subtotal.toFixed(2)}</span>
              </div>

              {/* Costs */}
              <div className="py-5 space-y-3 border-b border-neutral-muted border-dashed">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-secondary font-bold">Subtotal</span>
                  <span className="font-bold text-neutral-primary">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-secondary font-bold flex items-center gap-1">Service Fee <Info size={14}/></span>
                  <span className="font-bold text-neutral-primary">₹{serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-secondary font-bold">Tax (5%)</span>
                  <span className="font-bold text-neutral-primary">₹{tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="mt-6 bg-primary-lightest/30 rounded-xl p-6 text-center">
                <p className="text-sm font-bold text-neutral-primary mb-1">Total Amount Due</p>
                <p className="text-4xl font-extrabold text-primary tracking-tight">₹{totalAmountDue.toFixed(2)}</p>
              </div>

              {/* Trust Badges under total */}
              <div className="mt-8 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-lightest/50 p-2.5 rounded-lg text-primary border border-primary-light/20 shrink-0"><Ticket size={20}/></div>
                  <p className="text-sm text-neutral-secondary font-medium leading-snug">Tickets will be sent to<br/>your registered email</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-green-50 p-2.5 rounded-lg text-green-600 border border-green-100 shrink-0"><ShieldCheck size={20}/></div>
                  <p className="text-sm text-neutral-secondary font-medium leading-snug">You can cancel up to 24h<br/>before the event</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="bg-neutral-white rounded-2xl border border-neutral-muted shadow-sm p-6 md:p-10 flex flex-col items-center h-full">
              
              <div className="w-14 h-14 bg-primary-lightest text-primary rounded-full flex items-center justify-center mb-4 ring-4 ring-primary-lightest/50">
                <ShieldCheck size={28} />
              </div>
              <h2 className="text-2xl font-extrabold text-neutral-primary mb-1">Secure Payment</h2>
              <p className="text-sm text-neutral-secondary font-medium mb-8">Your payment information is safe and encrypted.</p>

              <div className="w-full text-left mb-3">
                <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider">Choose Payment Method</span>
              </div>

              {/* Payment Tabs */}
              <div className="w-full grid grid-cols-4 gap-2 md:gap-4 mb-8">
                <button onClick={() => setActiveTab("card")} className={`relative flex flex-col items-center justify-center p-4 rounded-xl border ${activeTab === 'card' ? 'border-primary ring-1 ring-primary bg-primary-lightest/10 shadow-sm' : 'border-neutral-muted bg-neutral-white hover:border-neutral-primary'} transition-all`}>
                  <CreditCard className={activeTab === 'card' ? 'text-primary' : 'text-neutral-secondary'} size={24} strokeWidth={1.5} />
                  <span className={`text-xs mt-3 font-semibold ${activeTab === 'card' ? 'text-primary' : 'text-neutral-secondary'}`}>Card</span>
                  {activeTab === 'card' && <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-primary flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>}
                  {activeTab !== 'card' && <div className="absolute top-2 left-2 w-3 h-3 rounded-full border border-neutral-muted"></div>}
                </button>
                <button onClick={() => setActiveTab("upi")} className={`relative flex flex-col items-center justify-center p-4 rounded-xl border ${activeTab === 'upi' ? 'border-primary ring-1 ring-primary bg-primary-lightest/10 shadow-sm' : 'border-neutral-muted bg-neutral-white hover:border-neutral-primary'} transition-all`}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" className="h-6 object-contain grayscale opacity-60" alt="UPI" />
                  <span className="text-xs mt-3 font-semibold text-neutral-secondary">UPI</span>
                  {activeTab === 'upi' && <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-primary flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>}
                  {activeTab !== 'upi' && <div className="absolute top-2 left-2 w-3 h-3 rounded-full border border-neutral-muted"></div>}
                </button>
                <button onClick={() => setActiveTab("netbanking")} className={`relative flex flex-col items-center justify-center p-4 rounded-xl border ${activeTab === 'netbanking' ? 'border-primary ring-1 ring-primary bg-primary-lightest/10 shadow-sm' : 'border-neutral-muted bg-neutral-white hover:border-neutral-primary'} transition-all`}>
                  <ShieldCheck className="text-neutral-secondary grayscale" size={24} strokeWidth={1.5} />
                  <span className="text-[10px] sm:text-xs mt-3 font-semibold text-neutral-secondary text-center leading-tight">Net Banking</span>
                  {activeTab === 'netbanking' && <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-primary flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>}
                  {activeTab !== 'netbanking' && <div className="absolute top-2 left-2 w-3 h-3 rounded-full border border-neutral-muted"></div>}
                </button>
                <button onClick={() => setActiveTab("wallet")} className={`relative flex flex-col items-center justify-center p-4 rounded-xl border ${activeTab === 'wallet' ? 'border-primary ring-1 ring-primary bg-primary-lightest/10 shadow-sm' : 'border-neutral-muted bg-neutral-white hover:border-neutral-primary'} transition-all`}>
                  <CreditCard className="text-neutral-secondary grayscale" size={24} strokeWidth={1.5} />
                  <span className="text-xs mt-3 font-semibold text-neutral-secondary">Wallet</span>
                  {activeTab === 'wallet' && <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-primary flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>}
                  {activeTab !== 'wallet' && <div className="absolute top-2 left-2 w-3 h-3 rounded-full border border-neutral-muted"></div>}
                </button>
              </div>

              <div className="w-full text-left mb-3">
                <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider">Card Details</span>
              </div>

              {/* Card Form */}
              <div className="w-full space-y-4 mb-6">
                <div className="relative">
                  <input type="text" placeholder="1234 5678 9012 3456" className="w-full p-4 border border-neutral-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <div className="text-[#1434CB] font-black italic text-sm">VISA</div>
                    <div className="flex relative w-6 h-4">
                      <div className="absolute left-0 w-4 h-4 bg-red-500 rounded-full opacity-90 mix-blend-multiply"></div>
                      <div className="absolute right-2 w-4 h-4 bg-yellow-400 rounded-full opacity-90 mix-blend-multiply"></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6">
                    <input type="text" placeholder="Cardholder Name" className="w-full p-4 border border-neutral-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium" />
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <input type="text" placeholder="MM / YY" className="w-full p-4 border border-neutral-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-center" />
                  </div>
                  <div className="col-span-6 md:col-span-3 relative">
                    <input type="text" placeholder="CVC" className="w-full p-4 border border-neutral-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-center pr-10" />
                    <Info className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-secondary" size={18} />
                  </div>
                </div>
              </div>

              <div className="w-full bg-primary-lightest/40 p-3 rounded-xl flex items-center justify-center gap-2 mb-6">
                <ShieldCheck size={16} className="text-neutral-secondary" />
                <span className="text-xs font-medium text-neutral-secondary">We use industry-standard encryption to protect your data.</span>
              </div>

              <Button
                variant="primary"
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-4 text-base font-bold shadow-md hover:shadow-lg flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-orange-500 border-0 text-white"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-5 h-5" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 w-5 h-5" />
                    Pay Securely ₹{totalAmountDue.toFixed(2)}
                  </>
                )}
              </Button>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-neutral-secondary">
                <ShieldCheck size={14} className="text-neutral-secondary" />
                <span>100% Secure • SSL Encrypted • Trusted by thousands</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Trust Badges */}
        <div className="bg-neutral-white rounded-2xl border border-neutral-muted shadow-sm p-6 md:p-8 flex flex-col md:flex-row flex-wrap lg:flex-nowrap justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-[45%] lg:w-1/4">
            <div className="w-12 h-12 bg-primary-lightest text-primary rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-primary mb-0.5">Secure Payments</p>
              <p className="text-xs text-neutral-secondary font-medium leading-tight">Your data is protected with 256-bit encryption</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-[45%] lg:w-1/4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-primary mb-0.5">Instant Confirmation</p>
              <p className="text-xs text-neutral-secondary font-medium leading-tight">Receive tickets instantly after successful payment</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-[45%] lg:w-1/4">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-primary mb-0.5">Money Back Guarantee</p>
              <p className="text-xs text-neutral-secondary font-medium leading-tight">Full refund if you cancel within 24 hours</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-[45%] lg:w-1/4">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
              <Headphones size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-primary mb-0.5">24/7 Support</p>
              <p className="text-xs text-neutral-secondary font-medium leading-tight">Our team is always here to help you</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentPage;
