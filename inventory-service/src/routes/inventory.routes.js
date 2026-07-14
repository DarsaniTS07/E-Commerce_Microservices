const express = require("express");
const { body, param, query } = require("express-validator");

const { InventoryController } = require("../controllers/inventory.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const { requireAuth, requireRole } = require("../middlewares/auth");
const { requireInternalApiKey } = require("../middlewares/internalAuth");

module.exports = function createInventoryRoutes(inventoryService) {
  const router = express.Router();
  const controller = new InventoryController(inventoryService);

  // ==========================
  // User APIs
  // ==========================

  router.get(
    "/",
    requireAuth,
    requireRole(["user", "admin"]),
    [query("eventId").optional().isString()],
    validateRequest,
    controller.listInventory
  );

  router.get(
    "/:eventId",
    requireAuth,
    requireRole(["user", "admin"]),
    [param("eventId").isString().notEmpty()],
    validateRequest,
    controller.getInventory
  );

  router.post(
    "/",
    requireAuth,
    requireRole(["admin"]),
    [
      body("eventId").isString().notEmpty(),
      body("totalTickets").isInt({ min: 0 }),
      body("availableTickets").isInt({ min: 0 }),
      body("reservedTickets").optional().isInt({ min: 0 }),
    ],
    validateRequest,
    controller.createInventory
  );

  router.put(
    "/:eventId",
    requireAuth,
    requireRole(["admin"]),
    [
      param("eventId").isString().notEmpty(),
      body("totalTickets").optional().isInt({ min: 0 }),
      body("availableTickets").optional().isInt({ min: 0 }),
      body("reservedTickets").optional().isInt({ min: 0 }),
    ],
    validateRequest,
    controller.updateInventory
  );

  router.delete(
    "/:eventId",
    requireAuth,
    requireRole(["admin"]),
    [param("eventId").isString().notEmpty()],
    validateRequest,
    controller.deleteInventory
  );

  // ==========================
  // Internal APIs
  // ==========================

router.get(
  "/internal/inventory/:eventId",
  requireInternalApiKey,
  [
    param("eventId").isString().notEmpty(),
  ],
  validateRequest,
  controller.getInventory
);

router.post(
  "/internal/inventory",
  requireInternalApiKey,
  [
    body("eventId").isString().notEmpty(),
    body("totalTickets").isInt({ min: 0 }),
    body("availableTickets").isInt({ min: 0 }),
  ],
  validateRequest,
  controller.createInventory
);

router.post(
  "/internal/reserve",
  requireInternalApiKey,
  [
    body("eventId").isString().notEmpty(),
    body("quantity").isInt({ min: 1 }),
  ],
  validateRequest,
  controller.reserveTickets
);

router.post(
  "/internal/release",
  requireInternalApiKey,
  [
    body("eventId").isString().notEmpty(),
    body("quantity").isInt({ min: 1 }),
  ],
  validateRequest,
  controller.releaseTickets
);

router.post(
  "/internal/confirm",
  requireInternalApiKey,
  [
    body("eventId").isString().notEmpty(),
    body("quantity").isInt({ min: 1 }),
  ],
  validateRequest,
  controller.confirmTickets
);

  return router;
};