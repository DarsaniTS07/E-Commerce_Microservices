class WaitlistClient {
  constructor(baseUrl) {
    this.baseUrl = (baseUrl || '').replace(/\/$/, '');
  }

  async processWaitlist(eventId) {
    if (!this.baseUrl) {
      return null;
    }

    const response = await fetch(`${this.baseUrl}/internal/waitlist/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'admin',
      },
      body: JSON.stringify({ eventId }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || `Waitlist service request failed: ${response.status}`);
    }

    return payload.data;
  }
}

module.exports = { WaitlistClient };
