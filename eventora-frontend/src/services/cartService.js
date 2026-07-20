import apiClient from "../api/client";
import eventService from "./eventService";

export const cartService = {
  getCart: async () => {
    try {
      const response = await apiClient.get("/cart");
      console.log("Raw cart response:", response.data);
      
      let items = [];
      const resData = response.data;
      
      if (Array.isArray(resData)) {
        items = resData;
      } else if (resData?.data && Array.isArray(resData.data)) {
        items = resData.data;
      } else if (resData?.items && Array.isArray(resData.items)) {
        items = resData.items;
      } else if (resData?.data?.items && Array.isArray(resData.data.items)) {
        items = resData.data.items;
      } else if (resData?.data?.cartItems && Array.isArray(resData.data.cartItems)) {
        items = resData.data.cartItems;
      }
      
      // Filter out non-active items (e.g. EXPIRED or REMOVED), but keep items that lack a status field
      items = items.filter(item => !item.status || item.status === 'ACTIVE');
      
      // Fetch full event details for each item in the cart because the cart API 
      // likely only returns { eventId, quantity } without the title/price/category.
      const detailedItems = await Promise.all(
        items.map(async (item) => {
          try {
            const eventDetails = await eventService.getEventDetails(item.eventId || item.id || item.event);
            return {
              ...item,
              ...eventDetails, // Merge event details (title, category, city, ticketPrice)
              eventId: item.eventId || item.id || item.event, // Ensure eventId is present
              price: eventDetails.price || eventDetails.ticketPrice || item.price || 0,
              quantity: item.quantity || 1
            };
          } catch (e) {
            console.error("Failed to fetch details for cart item:", item);
            return {
              ...item,
              price: item.price || 0,
              quantity: item.quantity || 1,
              title: "Unknown Event"
            };
          }
        })
      );

      // Extract cartId for subsequent updates (it is located inside the items array!)
      const cartId = items.length > 0 ? items[0].cartId : null;

      return { items: detailedItems, cartId };
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      throw error;
    }
  },

  addToCart: async (eventId, quantity) => {
    try {
      const response = await apiClient.post("/cart", { eventId, quantity }, { skipToast: true });
      return response.data?.data;
    } catch (error) {
      if (error.response?.status === 409) {
        return { alreadyInCart: true };
      }
      console.error("Failed to add item to cart:", error);
      throw error;
    }
  },

  updateCartItem: async (cartId, eventId, quantity) => {
    try {
      const response = await apiClient.put("/cart/items", { cartId, eventId, quantity });
      return response.data?.data;
    } catch (error) {
      console.error("Failed to update cart item. Backend says:\n", JSON.stringify(error.response?.data, null, 2) || error.message);
      throw error;
    }
  },

  removeCartItem: async (cartId, eventId) => {
    try {
      const response = await apiClient.delete("/cart/items", {
        data: { cartId, eventId }
      });
      return response.data?.data;
    } catch (error) {
      console.error("Failed to remove cart item. Backend says:\n", JSON.stringify(error.response?.data, null, 2) || error.message);
      throw error;
    }
  },

  checkout: async () => {
    try {
      const response = await apiClient.post("/cart/checkout");
      return response.data?.data;
    } catch (error) {
      console.error("Checkout failed:", error);
      throw error;
    }
  }
};

export default cartService;
