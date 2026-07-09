const { AppError } = require('../utils/AppError');

class InventoryClient {
  constructor(baseUrl) {
    this.baseUrl = (baseUrl || '').replace(/\/$/, '');
  }

  async confirmTickets(eventId, quantity) {
    const response = await fetch(`${this.baseUrl}/inventory/internal/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'payment-service',
        'x-user-role': 'admin',
      },
      body: JSON.stringify({ eventId, quantity }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new AppError(
        payload.message || `Inventory service request failed: ${response.status}`,
        response.status,
        payload.errors || []
      );
    }

    return payload.data;
  }
}

module.exports = { InventoryClient };