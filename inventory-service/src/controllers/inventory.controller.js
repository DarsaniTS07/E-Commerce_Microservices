const { asyncHandler } = require("../utils/asyncHandler");

class InventoryController {
  constructor(inventoryService) {
    this.inventoryService = inventoryService;
  }

  // ---------- CRUD ----------

  listInventory = asyncHandler(async (req, res) => {
    const data = await this.inventoryService.listInventory(req.query);

    res.json({
      success: true,
      message: "Operation successful",
      data,
    });
  });

  getInventory = asyncHandler(async (req, res) => {
    const data = await this.inventoryService.getInventory(req.params.eventId);

    res.json({
      success: true,
      message: "Operation successful",
      data,
    });
  });

  createInventory = asyncHandler(async (req, res) => {
    const data = await this.inventoryService.createInventory(req.body);

    res.status(201).json({
      success: true,
      message: "Operation successful",
      data,
    });
  });

  updateInventory = asyncHandler(async (req, res) => {
    const data = await this.inventoryService.updateInventory(
      req.params.eventId,
      req.body
    );

    res.json({
      success: true,
      message: "Operation successful",
      data,
    });
  });

  deleteInventory = asyncHandler(async (req, res) => {
    const data = await this.inventoryService.deleteInventory(
      req.params.eventId
    );

    res.json({
      success: true,
      message: "Operation successful",
      data,
    });
  });

  // ---------- Internal Operations ----------

  reserveTickets = asyncHandler(async (req, res) => {
    const data = await this.inventoryService.reserveTickets(
      req.body.eventId,
      Number(req.body.quantity)
    );

    res.json({
      success: true,
      message: "Operation successful",
      data,
    });
  });

  releaseTickets = asyncHandler(async (req, res) => {
    const data = await this.inventoryService.releaseTickets(
      req.body.eventId,
      Number(req.body.quantity)
    );

    res.json({
      success: true,
      message: "Operation successful",
      data,
    });
  });

  confirmTickets = asyncHandler(async (req, res) => {
    const data = await this.inventoryService.confirmTickets(
      req.body.eventId,
      Number(req.body.quantity)
    );

    res.json({
      success: true,
      message: "Operation successful",
      data,
    });
  });

  // Backward compatibility (optional)
  getAvailability = this.getInventory;
}

module.exports = { InventoryController };