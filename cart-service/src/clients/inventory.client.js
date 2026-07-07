const { AppError } = require('../utils/AppError');

class InventoryClient {
  constructor(baseUrl) {
    this.baseUrl = (baseUrl || '').replace(/\/$/, '');
  }

  async reserveTickets(eventId, quantity) {
    return this.#post('/inventory/internal/reserve', { eventId, quantity });
  }

  async releaseTickets(eventId, quantity) {
    return this.#post('/inventory/internal/release', { eventId, quantity });
  }

  async #post(path, body) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'cart-service',
        'x-user-role': 'admin',
      },
      body: JSON.stringify(body),
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