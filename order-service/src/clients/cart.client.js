const { AppError } = require('../utils/AppError');

class CartClient {
  constructor(baseUrl) {
    this.baseUrl = (baseUrl || '').replace(/\/$/, '');
  }

  async getCartById(cartId) {
    const response = await fetch(`${this.baseUrl}/cart/internal/carts/${cartId}`, {
      method: 'GET',
      headers: {
        'x-internal-api-key': process.env.INTERNAL_API_KEY
      },
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new AppError(
        payload.message || `Cart service request failed: ${response.status}`,
        response.status,
        payload.errors || []
      );
    }

    return payload.data;
  }

  async checkoutCart(cartId, orderId) {
    const response = await fetch(`${this.baseUrl}/cart/internal/carts/${cartId}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-api-key': process.env.INTERNAL_API_KEY
      },
      body: JSON.stringify({ orderId }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new AppError(
        payload.message || `Cart service request failed: ${response.status}`,
        response.status,
        payload.errors || []
      );
    }

    return payload.data;
  }
}

module.exports = { CartClient };