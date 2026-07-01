const { asyncHandler } = require("../utils/asyncHandler");

class InventoryController {
  constructor(inventoryService) {
    this.inventoryService = inventoryService;
  }

  getAvailability = asyncHandler(async (req, res) => {
    const data = await this.inventoryService.getAvailability(req.query.eventId);
    res.json({ success: true, message: 'Operation successful', data });
  });

  reserveTickets = asyncHandler(async (req, res) => {
    const data = await this.inventoryService.reserveTickets(req.body.eventId, Number(req.body.quantity));
    res.json({ success: true, message: 'Operation successful', data });
  });

  releaseTickets = asyncHandler(async (req, res) => {
    const data = await this.inventoryService.releaseTickets(req.body.eventId, Number(req.body.quantity));
    res.json({ success: true, message: 'Operation successful', data });
  });

  confirmTickets = asyncHandler(async (req, res) => {
    const data = await this.inventoryService.confirmTickets(req.body.eventId, Number(req.body.quantity));
    res.json({ success: true, message: 'Operation successful', data });
  });
}

module.exports = { InventoryController };
