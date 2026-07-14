class InventoryClient {
  constructor(baseUrl) {
    this.baseUrl = (baseUrl || "").replace(/\/$/, "");
  }

  async getAvailability(eventId) {
    if (!this.baseUrl) {
      return null;
    }

    const response = await fetch(
      `${this.baseUrl}/inventory/internal/inventory/${eventId}`,
      {
        method: "GET",
        headers: {
          "x-internal-api-key": process.env.INTERNAL_API_KEY,
        },
      }
    );

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        payload.message ||
          `Inventory service request failed: ${response.status}`
      );
    }

    return payload.data;
  }

  async createInventory(payload) {
    if (!this.baseUrl) {
      return null;
    }

    const response = await fetch(
      `${this.baseUrl}/inventory/internal/inventory`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-api-key": process.env.INTERNAL_API_KEY,
        },
        body: JSON.stringify(payload),
      }
    );

    const payloadResponse = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        payloadResponse.message ||
          `Inventory service request failed: ${response.status}`
      );
    }

    return payloadResponse.data;
  }
}

module.exports = { InventoryClient };