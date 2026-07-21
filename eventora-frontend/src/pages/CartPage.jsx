import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingCart, ShieldCheck, CheckCircle, MapPin, Calendar, Tag, Info } from "lucide-react";
import toast from "react-hot-toast";
import cartService from "../services/cartService";
import orderService from "../services/orderService";
import Button from "../components/Button";
import { format, parseISO } from "date-fns";

export const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      toast.error("Failed to load cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartId, eventId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setIsUpdating(true);
      await cartService.updateCartItem(cartId, eventId, newQuantity);
      await fetchCart(false); // Refresh cart in the background without full page spinner
    } catch (error) {
      toast.error("Failed to update quantity.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (cartId, eventId) => {
    try {
      setIsUpdating(true);
      await cartService.removeCartItem(cartId, eventId);
      toast.success("Item removed from cart");
      await fetchCart(false); // Refresh cart in the background without full page spinner
    } catch (error) {
      toast.error("Failed to remove item.");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleClearCart = async () => {
    // In a real app, you'd call an API to clear the whole cart.
    // Here we'll just mock it or loop through.
    if(cart?.items?.length > 0) {
      try {
        setIsUpdating(true);
        for (const item of cart.items) {
           await cartService.removeCartItem(cart.cartId, item.eventId);
        }
        toast.success("Cart cleared");
        await fetchCart(false);
      } catch (error) {
        toast.error("Failed to clear cart.");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleCheckout = async () => {
    try {
      setIsUpdating(true);
      // Create the order using the cart ID
      const order = await orderService.createOrder(cart.cartId);
      toast.success("Order initiated!");
      navigate(`/checkout/confirm/${order.orderId}`);
    } catch (error) {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setIsUpdating(false);
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

  const items = cart?.items || [];
  const subTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Mock fees for the UI
  const serviceFee = items.length > 0 ? 120.00 : 0;
  const tax = items.length > 0 ? 125.00 : 0;
  const totalAmount = subTotal + serviceFee + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-24 h-24 bg-neutral-light rounded-full flex items-center justify-center mb-4">
          <ShoppingCart size={48} className="text-neutral-secondary/50" />
        </div>
        <h2 className="text-3xl font-extrabold text-neutral-primary tracking-tight">Your cart is empty</h2>
        <p className="text-neutral-secondary max-w-md">
          Looks like you haven't added any events to your cart yet. Discover amazing experiences happening near you!
        </p>
        <Button onClick={() => navigate("/events")} className="mt-4 px-8 py-3 font-bold">
          Explore Events
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-4 bg-neutral-lightest min-h-screen font-sans">
      <div className="flex flex-col space-y-3">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-neutral-primary tracking-tight">Shopping Cart</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-neutral-secondary font-medium">
            <ShoppingCart size={16} className="text-[#8b5cf6]" />
            <span>Review your items and proceed to checkout</span>
          </div>

          {/* Checkout Steps Progress */}
          <div className="mt-2 bg-neutral-white p-3 md:p-4 rounded-[24px] border border-neutral-muted shadow-sm">
            <div className="flex items-center justify-between max-w-3xl mx-auto relative">
              {/* Connecting Line Background */}
              <div className="absolute top-6 left-[15%] right-[15%] h-0.5 bg-neutral-200 -z-0"></div>
              {/* Connecting Line Active */}
              <div className="absolute top-6 left-[15%] w-[0%] h-0.5 bg-[#8b5cf6] -z-0"></div>
              
              {/* Step 1: Overview */}
              <div className="flex flex-col items-center relative z-10 w-1/3">
                <div className="w-12 h-12 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center font-bold shadow-md ring-4 ring-[#8b5cf6]/20">
                  1
                </div>
                <span className="mt-3 text-[15px] font-bold text-[#8b5cf6]">Overview</span>
                <span className="text-xs text-neutral-secondary">Review your cart</span>
              </div>

              {/* Step 2: Order Confirm */}
              <div className="flex flex-col items-center relative z-10 w-1/3">
                <div className="w-12 h-12 rounded-full bg-white text-neutral-400 border-2 border-neutral-200 flex items-center justify-center font-bold">
                  2
                </div>
                <span className="mt-3 text-[15px] font-bold text-neutral-primary">Order Confirm</span>
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
        </div>

        {/* Cart Content */}
        <div className="bg-neutral-white rounded-[24px] border border-neutral-muted shadow-sm overflow-hidden">
          
          {/* Cart Header Block */}
          <div className="p-3 md:p-4 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#f3e8ff] rounded-xl flex items-center justify-center shrink-0">
                <ShoppingCart size={20} className="text-[#8b5cf6]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-neutral-primary">{items.length} Item{items.length !== 1 ? 's' : ''} in your cart</h2>
                <p className="text-sm text-neutral-secondary font-medium">Looks good! You're just a step away from your next experience.</p>
              </div>
            </div>
            <button 
              onClick={handleClearCart}
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-bold text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Trash2 size={16} />
              Clear Cart
            </button>
          </div>

          <div className="p-3 md:p-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 pb-4 border-b border-neutral-100 text-[11px] uppercase font-black text-neutral-secondary tracking-widest mb-4">
              <div className="col-span-5 md:col-span-6">PRODUCT</div>
              <div className="col-span-2 text-center hidden md:block">PRICE</div>
              <div className="col-span-4 md:col-span-2 text-center">QUANTITY</div>
              <div className="col-span-3 md:col-span-2 text-right">TOTAL</div>
            </div>

            {/* Table Body */}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.eventId} className="grid grid-cols-12 gap-4 items-center bg-[#fcfcfd] p-4 rounded-2xl border border-neutral-100/50">
                  
                  {/* Product Info */}
                  <div className="col-span-5 md:col-span-6 flex flex-col xl:flex-row items-start xl:items-center gap-4">
                    {/* Event Image */}
                    <div 
                      className="w-24 h-24 xl:w-28 xl:h-28 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-xl shrink-0 shadow-md relative flex flex-col items-center justify-center overflow-hidden"
                      style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                    >
                    </div>
                    
                    <div className="flex flex-col space-y-1.5">
                      <Link to={`/events/${item.eventId}`} className="text-base font-black text-neutral-primary hover:text-[#8b5cf6] uppercase tracking-wide transition-colors">
                        {item.title}
                      </Link>
                      
                      <div className="flex items-center text-xs text-neutral-secondary font-medium gap-1.5">
                        <Tag size={12} className="text-neutral-400" />
                        <span>Category: {item.category || "Conference"}</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-neutral-secondary font-medium gap-1.5">
                        <MapPin size={12} className="text-neutral-400" />
                        <span>Location: {item.city}</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-neutral-secondary font-medium gap-1.5">
                        <Calendar size={12} className="text-neutral-400" />
                        <span>{formatDate(item.date)}</span>
                      </div>

                      <div className="mt-2 inline-flex items-center gap-1.5 bg-[#fdf2f8] text-[#ec4899] text-[10px] uppercase font-bold px-2 py-1 rounded-full w-max">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ec4899]"></div>
                        <span>IN STOCK ({item.availableTicketCount || 500} TKT)</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="hidden md:block col-span-2 text-center text-sm font-black text-neutral-primary">
                    ₹{item.price.toFixed(2)}
                  </div>

                  {/* Quantity Controls */}
                  <div className="col-span-4 md:col-span-2 flex justify-center">
                    <div className="flex items-center gap-4 bg-[#f1f5f9] px-3 py-2 rounded-xl border border-[#e2e8f0]">
                      <button
                        onClick={() => handleUpdateQuantity(item.cartId, item.eventId, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isUpdating}
                        className="text-neutral-400 hover:text-neutral-primary disabled:opacity-50 transition-colors"
                      >
                        <Minus size={14} strokeWidth={3} />
                      </button>
                      <span className="text-sm font-black text-neutral-primary w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.cartId, item.eventId, item.quantity + 1)}
                        disabled={isUpdating}
                        className="text-[#8b5cf6] hover:text-[#7c3aed] disabled:opacity-50 transition-colors"
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>

                  {/* Total & Remove */}
                  <div className="col-span-3 md:col-span-2 flex flex-col items-end justify-center space-y-2">
                    <div className="text-[15px] font-black text-neutral-primary">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.cartId, item.eventId)}
                      disabled={isUpdating}
                      className="text-xs text-red-500 font-bold flex items-center gap-1 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={12} />
                      Remove
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bar (Summary & Buttons) */}
        <div className="bg-neutral-white rounded-[24px] border border-neutral-muted shadow-sm p-3 md:p-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-4">
            
            {/* Left - Trust */}
            <div className="flex items-center gap-4 w-full lg:w-3/12">
              <div className="w-12 h-12 bg-[#f3e8ff] text-[#8b5cf6] rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-neutral-primary mb-0.5">Safe & Secure Checkout</p>
                <p className="text-xs text-neutral-secondary font-medium leading-tight">Your data is protected with 256-bit encryption</p>
              </div>
            </div>

            {/* Middle - Breakdown */}
            <div className="w-full lg:w-5/12 border-y lg:border-y-0 lg:border-l lg:border-r-0 border-neutral-200 py-4 lg:py-0 lg:px-8 space-y-3 border-dashed">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-secondary">
                <span>Sub Total</span>
                <span className="text-sm font-black text-neutral-primary">₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-neutral-secondary">
                <span className="flex items-center gap-1">Service Fee <Info size={12}/></span>
                <span className="text-sm font-black text-neutral-primary">₹{serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-neutral-secondary">
                <span>Tax (5%)</span>
                <span className="text-sm font-black text-neutral-primary">₹{tax.toFixed(2)}</span>
              </div>
              
              <div className="pt-3 mt-3 border-t border-neutral-200 border-dashed flex justify-between items-end">
                <div className="flex flex-col">
                  <p className="text-[11px] font-bold text-neutral-secondary uppercase tracking-wider mb-1">Total Amount</p>
                  <p className="text-3xl font-black text-[#8b5cf6] leading-none">₹{totalAmount.toFixed(2)}</p>
                </div>
                <span className="text-[10px] text-neutral-400 font-medium mb-1">Incl. of all taxes & fees</span>
              </div>
            </div>

            {/* Right - Total & Actions */}
            <div className="w-full lg:w-4/12 flex justify-end">
              <div className="w-full max-w-[340px] flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/events")}
                    className="w-full py-3 text-sm font-bold border-2 border-[#e9d5ff] text-[#8b5cf6] hover:bg-[#f3e8ff] rounded-[16px] flex items-center justify-center gap-2"
                    disabled={isUpdating}
                  >
                    <ArrowLeft size={16} />
                    Continue Shopping
                  </Button>
                  
                  <Button
                    variant="primary"
                    onClick={handleCheckout}
                    disabled={isUpdating || items.length === 0}
                    className="w-full py-3.5 text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-between px-5 rounded-[16px] bg-gradient-to-r from-[#8b5cf6] to-[#f97316] border-0 text-white"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="opacity-90" />
                      Proceed to Checkout
                    </div>
                    <ArrowRight size={16} className="opacity-90" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-green-600 mt-1">
                  <CheckCircle size={12} />
                  <span>100% Secure Payment</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
