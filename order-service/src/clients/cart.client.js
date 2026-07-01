class CartClient {
  constructor(baseUrl) {
    this.baseUrl = (baseUrl || '').replace(/\/$/, '');
  }

  async getCartById(cartId) {
    const response = await fetch(`${this.baseUrl}/cart/internal/carts/${cartId}`, {
      method: 'GET',
      headers: { 'x-user-role': 'admin' },
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || `Cart service request failed: ${response.status}`);
    }

    return payload.data;
  }

  async checkoutCart(cartId, orderId) {
    const response = await fetch(`${this.baseUrl}/cart/internal/carts/${cartId}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'admin',
      },
      body: JSON.stringify({ orderId }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || `Cart service request failed: ${response.status}`);
    }

    return payload.data;
  }
}

module.exports = { CartClient };
