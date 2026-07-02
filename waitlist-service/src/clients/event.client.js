class EventClient {
  constructor(baseUrl) {
    this.baseUrl = (baseUrl || '').replace(/\/$/, '');
  }

  async getEventById(eventId) {
    const response = await fetch(`${this.baseUrl}/events/${eventId}`, {
      method: 'GET',
      headers: { 'x-user-role': 'admin' },
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || `Event service request failed: ${response.status}`);
    }

    return payload.data;
  }

  async syncAvailability(eventId, availableTicketCount) {
    const availableStatus =
      availableTicketCount <= 0
        ? "SOLD_OUT"
        : availableTicketCount <= 20
          ? "LIMITED"
          : "AVAILABLE";

    const response = await fetch(`${this.baseUrl}/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'admin',
      },
      body: JSON.stringify({
        availableTicketCount,
        availableStatus,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || `Event service request failed: ${response.status}`);
    }
    return payload.data;
  }
}

module.exports = { EventClient };
