import apiClient from "../api/client";

export const eventService = {
  listEvents: async ({ page = 1, limit = 10, city, category, date, price, trending, search, status = "PUBLISHED" }) => {
    const params = {
      page,
      limit,
      status,
    };
    if (city) params.city = city;
    if (category) params.category = category;
    if (date) params.date = date;
    if (search) params.search = search;
    if (price) params.price = price;
    if (trending !== undefined) params.trending = trending;

    try {
      const response = await apiClient.get("/events", { params, skipToast: true });
      const apiData = response.data;
      
      if (apiData && apiData.success && apiData.data) {
        const events = (apiData.data.items || []).map(item => ({
          ...item,
          id: item.eventId,
          date: item.eventDate,
          price: item.ticketPrice,
          ticketsAvailable: item.availableTicketCount,
        }));
        
        return {
          events,
          total: apiData.data.pagination?.total || 0,
          pages: apiData.data.pagination?.totalPages || 1
        };
      }
      
      return { events: [], total: 0, pages: 1 };
    } catch (error) {
      console.error("Failed to fetch events from DB:", error);
      throw error;
    }
  },

  getEventDetails: async (eventId) => {
    try {
      const response = await apiClient.get(`/events/${eventId}`);
      const apiData = response.data;
      
      if (apiData && apiData.success && apiData.data) {
        const item = apiData.data;
        return {
          ...item,
          id: item.eventId,
          date: item.eventDate,
          price: item.ticketPrice,
          ticketsAvailable: item.availableTicketCount,
        };
      }
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch event ${eventId} from DB:`, error);
      throw error;
    }
  }
};

export default eventService;
