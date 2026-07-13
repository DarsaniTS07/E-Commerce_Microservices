const express = require("express");
const { body } = require("express-validator");

const { CartController } = require("../controllers/cart.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const { requireAuth, requireRole } = require("../middlewares/auth");

module.exports = function createCartRoutes(cartService) {
  const router = express.Router();
  const controller = new CartController(cartService);

  // User APIs
  router.post(
    "/",
    [
      body("eventId").isString().notEmpty(),
      body("quantity").isInt({ min: 1 }),
    ],
     requireAuth,
    requireRole(["user","admin"]),
    validateRequest,
    controller.addItem
  );

  router.get(
    "/",
    requireAuth,
    requireRole(["user", "admin"]),
    controller.viewCart
  );

  router.put(
    "/items",
    [
      body("cartId").isString().notEmpty(),
      body("quantity").isInt({ min: 1 }),
    ],
    validateRequest,
    requireAuth,
    requireRole(["user", "admin"]),
    controller.updateQuantity
  );

  router.delete(
    "/items",
    [body("cartId").isString().notEmpty()],
    validateRequest,
    requireAuth,
    requireRole(["user", "admin"]),
    controller.removeItem
  );

  // Internal APIs
  router.get(
    "/internal/carts/:cartId",
    controller.getCartItem
  );

  router.post(
    "/internal/carts/:cartId/checkout",
    [
      body("orderId").isString().notEmpty(),
    ],
    validateRequest,
    controller.checkoutCart
  );

  return router;
};