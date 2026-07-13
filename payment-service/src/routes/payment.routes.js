const express = require("express");
const { body, param } = require("express-validator");
const { PaymentController } = require("../controllers/payment.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const { requireAuth, requireRole } = require("../middlewares/auth");

module.exports = function createPaymentRoutes(paymentService) {
  const router = express.Router();
  const controller = new PaymentController(paymentService);

  // Public API - Initiate Payment
  router.post(
    "/",
    requireAuth,
    requireRole(["user", "admin"]),
    [
      body("orderId").isString().notEmpty(),
    ],
    validateRequest,
    controller.initiatePayment
  );

  // External Payment Gateway Callback
  // Do NOT protect with Cognito or Internal API Key
  router.post(
    "/callback",
    [
      body("status").isIn(["SUCCESS", "FAILED"]),
      body("orderId").optional().isString(),
      body("providerReference").optional().isString(),
    ],
    validateRequest,
    controller.paymentCallback
  );

  // Admin API - View Refunds
  router.get(
    "/refunds",
    requireAuth,
    requireRole(["admin"]),
    controller.getRefunds
  );

  // Public API - Get Payment Status
  router.get(
    "/:orderId",
    requireAuth,
    requireRole(["user", "admin"]),
    [
      param("orderId").isString().notEmpty(),
    ],
    validateRequest,
    controller.getPaymentStatus
  );

  return router;
};