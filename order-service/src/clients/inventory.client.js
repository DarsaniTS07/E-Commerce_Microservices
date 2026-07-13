class InventoryClient {
  constructor(baseUrl) {
    this.baseUrl = (baseUrl || '').replace(/\/$/, '');
  }

  async releaseTickets(eventId, quantity) {
    const response = await fetch(`${this.baseUrl}/inventory/internal/inventory/release`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-api-key': process.env.INTERNAL_API_KEY,
      },
      body: JSON.stringify({ eventId, quantity }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || `Inventory service request failed: ${response.status}`);
    }

    return payload.data;
  }
}

module.exports = { InventoryClient };
