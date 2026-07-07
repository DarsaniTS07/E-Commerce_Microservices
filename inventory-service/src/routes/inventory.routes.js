const express = require("express");
const { body, param, query } = require("express-validator");

const { InventoryController } = require("../controllers/inventory.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const { requireRole } = require("../middlewares/auth");

module.exports = function createInventoryRoutes(inventoryService) {
  const router = express.Router();
  const controller = new InventoryController(inventoryService);

  // ---------- CRUD APIs ----------

  router.get(
    "/",
    [query("eventId").optional().isString()],
    validateRequest,
    controller.listInventory
  );

  router.get(
    "/:eventId",
    [param("eventId").isString().notEmpty()],
    validateRequest,
    controller.getInventory
  );

  router.post(
    "/",
    [
      body("eventId").isString().notEmpty(),
      body("totalTickets").isInt({ min: 0 }),
      body("availableTickets").isInt({ min: 0 }),
      body("reservedTickets").optional().isInt({ min: 0 }),
    ],
    requireRole(["admin"]),
    validateRequest,
    controller.createInventory
  );

  router.put(
    "/:eventId",
    [
      param("eventId").isString().notEmpty(),
      body("totalTickets").optional().isInt({ min: 0 }),
      body("availableTickets").optional().isInt({ min: 0 }),
      body("reservedTickets").optional().isInt({ min: 0 }),
    ],
    requireRole(["admin"]),
    validateRequest,
    controller.updateInventory
  );

  router.delete(
    "/:eventId",
    [param("eventId").isString().notEmpty()],
    requireRole(["admin"]),
    validateRequest,
    controller.deleteInventory
  );

  // ---------- Internal APIs ----------

  router.post(
    "/internal/reserve",
    [
      body("eventId").isString().notEmpty(),
      body("quantity").isInt({ min: 1 }),
    ],
    requireRole(["admin"]),
    validateRequest,
    controller.reserveTickets
  );

  router.post(
    "/internal/release",
    [
      body("eventId").isString().notEmpty(),
      body("quantity").isInt({ min: 1 }),
    ],
    requireRole(["admin"]),
    validateRequest,
    controller.releaseTickets
  );

  router.post(
    "/internal/confirm",
    [
      body("eventId").isString().notEmpty(),
      body("quantity").isInt({ min: 1 }),
    ],
    requireRole(["admin"]),
    validateRequest,
    controller.confirmTickets
  );

  return router;
};