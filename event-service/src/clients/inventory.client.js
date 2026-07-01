class InventoryClient {
  constructor(baseUrl) {
    this.baseUrl = (baseUrl || '').replace(/\/$/, '');
  }

  async getAvailability(eventId) {
    if (!this.baseUrl) {
      return null;
    }

    const response = await fetch(`${this.baseUrl}/inventory?eventId=${encodeURIComponent(eventId)}`, {
      method: 'GET',
      headers: { 'x-user-role': 'admin' },
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || `Inventory service request failed: ${response.status}`);
    }

    return payload.data;
  }
}

module.exports = { InventoryClient };
