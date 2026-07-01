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
}

module.exports = { EventClient };
