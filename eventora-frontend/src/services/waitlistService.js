import apiClient from "../api/client";
import eventService from "./eventService";

export const waitlistService = {
  joinWaitlist: async (eventId, quantity = 1) => {
    try {
      const response = await apiClient.post("/waitlist", { eventId, quantity });
      return response.data?.data;
    } catch (error) {
      console.error("Failed to join waitlist:", error);
      throw error;
    }
  },

  leaveWaitlist: async (eventId) => {
    try {
      const response = await apiClient.delete(`/waitlist`, { data: { eventId } });
      return response.data?.data;
    } catch (error) {
      console.error("Failed to leave waitlist:", error);
      throw error;
    }
  },

  getUserWaitlists: async (userId) => {
    try {
      const response = await apiClient.get(`/waitlist/users/${userId}/waitlists`);
      const waitlists = response.data?.data || [];

      // Hydrate waitlists with event details
      const populatedWaitlists = await Promise.all(
        waitlists.map(async (waitlist) => {
          try {
            if (waitlist.eventId && !waitlist.event) {
              const event = await eventService.getEventDetails(waitlist.eventId);
              return { ...waitlist, event, status: 'WAITLISTED', isWaitlist: true, orderId: waitlist.waitlistId || waitlist.id }; // mapping fields to look like an order
            }
            return { ...waitlist, status: 'WAITLISTED', isWaitlist: true, orderId: waitlist.waitlistId || waitlist.id };
          } catch (err) {
            console.error(`Failed to fetch event for waitlist ${waitlist.waitlistId}:`, err);
            return { ...waitlist, status: 'WAITLISTED', isWaitlist: true, orderId: waitlist.waitlistId || waitlist.id };
          }
        })
      );

      return populatedWaitlists;
    } catch (error) {
      console.error("Failed to get user waitlists:", error);
      throw error;
    }
  }
};

export default waitlistService;
