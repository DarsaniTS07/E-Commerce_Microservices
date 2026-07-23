const eventId = "04c447e9-7387-4734-8c90-02427ef0d8fd";
const quantity = 1;

async function test() {
  console.log("Calling inventory reserve on 3002...");
  try {
    const res = await fetch("http://localhost:3002/inventory/internal/reserve", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-internal-api-key": "event-booking-internal-secret-2026" },
      body: JSON.stringify({ eventId, quantity })
    });
    console.log("Status:", res.status);
    console.log("Response:", await res.json());
  } catch (err) {
    console.error("Inventory error:", err.message);
  }
}

test();
