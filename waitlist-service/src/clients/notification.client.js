class NotificationClient {
  constructor(baseUrl) {
    this.baseUrl = (baseUrl || '').replace(/\/$/, '');
  }

  async createNotification(payload) {
    if (!this.baseUrl) {
      return null;
    }

    const response = await fetch(`${this.baseUrl}/notifications/internal/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'admin',
      },
      body: JSON.stringify(payload),
    });

    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(body.message || `Notification service request failed: ${response.status}`);
    }

    return body.data;
  }
}

module.exports = { NotificationClient };
