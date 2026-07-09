const { AppError } = require('../utils/AppError');

class OrderClient {
  constructor(baseUrl) {
    this.baseUrl = (baseUrl || '').replace(/\/$/, '');
  }

  async getOrder(orderId) {
    const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
      method: 'GET',
      headers: { 'x-user-id': 'payment-service', 'x-user-role': 'admin' },
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new AppError(
        payload.message || `Order service request failed: ${response.status}`,
        response.status,
        payload.errors || []
      );
    }

    return payload.data;
  }

  async confirmOrder(orderId) {
    const response = await fetch(`${this.baseUrl}/orders/internal/orders/${orderId}/confirm`, {
      method: 'POST',
      headers: { 'x-user-id': 'payment-service', 'x-user-role': 'admin' },
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new AppError(
        payload.message || `Order service request failed: ${response.status}`,
        response.status,
        payload.errors || []
      );
    }

    return payload.data;
  }

  async cancelOrder(orderId, reason) {
    const response = await fetch(`${this.baseUrl}/orders/internal/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'payment-service',
        'x-user-role': 'admin',
      },
      body: JSON.stringify({ reason }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new AppError(
        payload.message || `Order service request failed: ${response.status}`,
        response.status,
        payload.errors || []
      );
    }

    return payload.data;
  }
}

module.exports = { OrderClient };