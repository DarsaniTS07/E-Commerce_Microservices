import apiClient from "../api/client";
import eventService from "./eventService";

export const orderService = {
  createOrder: async (cartId) => {
    try {
      const response = await apiClient.post("/orders", { cartId });
      return response.data?.data;
    } catch (error) {
      console.error("Failed to create order:", error);
      throw error;
    }
  },

  cancelOrder: async (orderId) => {
    try {
      const response = await apiClient.post(`/orders/${orderId}/cancel`);
      return response.data?.data;
    } catch (error) {
      console.error("Failed to cancel order:", error);
      throw error;
    }
  },

  getOrder: async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data?.data;
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      throw error;
    }
  },

  getUserOrders: async (userId) => {
    try {
      const response = await apiClient.get(`/orders/users/${userId}/orders`);
      const orders = response.data?.data || [];

      // Hydrate orders with event details
      const populatedOrders = await Promise.all(
        orders.map(async (order) => {
          try {
            if (order.eventId && !order.event) {
              const event = await eventService.getEventDetails(order.eventId);
              return { ...order, event };
            }
            return order;
          } catch (err) {
            console.error(`Failed to fetch event for order ${order.orderId}:`, err);
            return order;
          }
        })
      );

      return populatedOrders;
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
      throw error;
    }
  }
};

export default orderService;
