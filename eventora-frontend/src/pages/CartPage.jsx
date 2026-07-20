import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import cartService from "../services/cartService";
import orderService from "../services/orderService";
import Button from "../components/Button";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const items = cart?.items || [];
  const subTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-primary tracking-tight">Shopping Cart</h1>

          {/* Checkout Steps Progress */}
          <div className="mt-8 bg-neutral-white p-8 rounded-2xl border border-neutral-muted shadow-soft">
            <div className="flex items-center justify-between max-w-2xl mx-auto relative">
              {/* Connecting Line Background */}
              <div className="absolute top-5 left-0 w-full h-1 bg-neutral-light rounded-full -z-0"></div>
              {/* Connecting Line Active (Only halfway since we're on step 1) */}
              <div className="absolute top-5 left-0 w-0 h-1 bg-primary rounded-full -z-0 transition-all duration-500"></div>
              
              {/* Step 1: Overview */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md ring-4 ring-primary/20">
                  1
                </div>
                <span className="mt-3 text-sm font-bold text-primary">Overview</span>
              </div>

              {/* Step 2: Order Confirm */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-10 h-10 rounded-full bg-neutral-white text-neutral-secondary border-2 border-neutral-muted flex items-center justify-center font-bold">
                  2
                </div>
                <span className="mt-3 text-sm font-semibold text-neutral-secondary">Order Confirm</span>
              </div>

              {/* Step 3: Payment */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-10 h-10 rounded-full bg-neutral-white text-neutral-secondary border-2 border-neutral-muted flex items-center justify-center font-bold">
                  3
                </div>
                <span className="mt-3 text-sm font-semibold text-neutral-secondary">Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Content Table */}
        <div className="bg-neutral-white rounded-2xl border border-neutral-muted shadow-soft overflow-hidden">
          <div className="p-6">
            <p className="text-sm font-semibold text-neutral-secondary mb-6">
              You have {items.length} products in your cart
            </p>

            <div className="w-full">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 pb-4 border-b border-neutral-muted text-xs uppercase font-bold text-neutral-secondary tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-neutral-muted">
                {items.map((item) => (
                  <div key={item.eventId} className="grid grid-cols-12 gap-4 py-6 items-center">

                    {/* Product Info */}
                    <div className="col-span-6 flex items-start space-x-4">
                      {/* Image Placeholder */}
                      <div className="w-20 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex-shrink-0 flex items-center justify-center border border-neutral-muted shadow-soft">
                        <ShoppingCart className="text-primary/30" size={24} />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Link to={`/events/${item.eventId}`} className="text-sm font-bold text-neutral-primary hover:text-primary uppercase tracking-wide">
                          {item.title}
                        </Link>
                        <p className="text-xs text-neutral-secondary font-medium">Category: <span className="text-neutral-primary">{item.category}</span></p>
                        <p className="text-xs text-neutral-secondary font-medium">Location: <span className="text-neutral-primary">{item.city}</span></p>
                        <div className="mt-2 flex items-center space-x-1.5 text-[10px] uppercase font-bold text-secondary">
                          <div className="w-2 h-2 rounded-full bg-secondary"></div>
                          <span>In Stock ({item.availableTicketCount || 10} tkt)</span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-center text-sm font-bold text-neutral-primary">
                      ${item.price.toFixed(2)}
                    </div>

                    {/* Quantity Controls */}
                    <div className="col-span-2 flex justify-center">
                      <div className="flex items-center space-x-3 bg-neutral-light px-3 py-1.5 rounded-lg border border-neutral-border">
                        <button
                          onClick={() => handleUpdateQuantity(item.cartId, item.eventId, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isUpdating}
                          className="text-neutral-secondary hover:text-neutral-primary disabled:opacity-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold text-neutral-primary w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.cartId, item.eventId, item.quantity + 1)}
                          disabled={isUpdating}
                          className="text-neutral-secondary hover:text-neutral-primary disabled:opacity-50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Total & Remove */}
                    <div className="col-span-2 flex flex-col items-end justify-center space-y-2">
                      <div className="text-sm font-bold text-neutral-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.cartId, item.eventId)}
                        disabled={isUpdating}
                        className="text-xs text-danger font-semibold flex items-center hover:underline opacity-80 hover:opacity-100 transition-opacity disabled:opacity-50"
                      >
                        <Trash2 size={12} className="mr-1" />
                        Remove
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar (Summary & Buttons) */}
        <div className="flex flex-col items-end space-y-6 pt-4">
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-bold text-neutral-primary">Sub Total:</span>
              <span className="text-xl font-extrabold text-neutral-primary">${subTotal.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-neutral-secondary font-medium">
              Excl. Tax and delivery charge
            </p>
          </div>

          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <Button
              variant="secondary"
              onClick={() => navigate("/events")}
              className="uppercase text-xs tracking-wider px-6 font-bold"
              disabled={isUpdating}
            >
              Continue Shopping
            </Button>
            <Button
              variant="primary"
              onClick={handleCheckout}
              className="uppercase text-xs tracking-wider px-8 font-bold bg-gradient-to-r from-primary to-indigo-600 border-transparent text-white shadow-medium hover:shadow-premium"
              disabled={isUpdating || items.length === 0}
            >
              Go To Checkout
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
