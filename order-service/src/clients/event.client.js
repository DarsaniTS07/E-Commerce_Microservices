const { AppError } = require("../utils/AppError");

class EventClient {
  constructor(baseUrl) {
    this.baseUrl = (baseUrl || "").replace(/\/$/, "");
  }

  async getEventById(eventId) {
    const response = await fetch(
      `${this.baseUrl}/events/internal/events/${eventId}`,
      {
        method: "GET",
        headers: {
          "x-internal-api-key": process.env.INTERNAL_API_KEY,
        },
      }
    );

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new AppError(
        payload.message || `Event service request failed: ${response.status}`,
        response.status,
        payload.errors || []
      );
    }

    return payload.data;
  }
}

module.exports = { EventClient };