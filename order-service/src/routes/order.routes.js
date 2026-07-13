const express = require("express");
const { body, param } = require("express-validator");

const { OrderController } = require("../controllers/order.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  requireAuth,
  requireRole,
} = require("../middlewares/auth");
const {
  requireInternalApiKey,
} = require("../middlewares/internalAuth");

module.exports = function createOrderRoutes(orderService) {
  const router = express.Router();
  const controller = new OrderController(orderService);

  // ==========================
  // Public APIs
  // ==========================

  router.post(
    "/",
    requireAuth,
    requireRole(["user", "admin"]),
    [
      body("cartId").isString().notEmpty(),
    ],
    validateRequest,
    controller.createOrder
  );

  router.get(
    "/users/:userId/orders",
    requireAuth,
    requireRole(["user", "admin"]),
    [
      param("userId").isString().notEmpty(),
    ],
    validateRequest,
    controller.getUserOrders
  );

  router.get(
    "/:orderId",
    requireAuth,
    requireRole(["user", "admin"]),
    [
      param("orderId").isString().notEmpty(),
    ],
    validateRequest,
    controller.getOrder
  );

  router.post(
    "/:orderId/cancel",
    requireAuth,
    requireRole(["user", "admin"]),
    [
      param("orderId").isString().notEmpty(),
      body("reason").optional().isString(),
    ],
    validateRequest,
    controller.cancelOrder
  );

  router.get(
    "/:orderId/ticket",
    requireAuth,
    requireRole(["user", "admin"]),
    [
      param("orderId").isString().notEmpty(),
    ],
    validateRequest,
    controller.getTicket
  );

  // ==========================
  // Internal APIs
  // ==========================

  router.post(
    "/internal/orders/:orderId/confirm",
    requireInternalApiKey,
    [
      param("orderId").isString().notEmpty(),
    ],
    validateRequest,
    controller.confirmOrder
  );

  router.post(
    "/internal/orders/:orderId/cancel",
    requireInternalApiKey,
    [
      param("orderId").isString().notEmpty(),
      body("reason").optional().isString(),
    ],
    validateRequest,
    controller.cancelOrder
  );

  return router;
};