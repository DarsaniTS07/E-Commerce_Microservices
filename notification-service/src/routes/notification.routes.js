const express = require("express");
const { body, param } = require("express-validator");

const { NotificationController } = require("../controllers/notification.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const { requireAuth, requireRole } = require("../middlewares/auth");
const { requireInternalApiKey } = require("../middlewares/internalAuth");

module.exports = function createNotificationRoutes(notificationService) {
  const router = express.Router();
  const controller = new NotificationController(notificationService);

  // ==========================
  // Public APIs
  // ==========================

  router.get(
    "/",
    requireAuth,
    requireRole(["user", "admin"]),
    validateRequest,
    controller.getNotifications
  );

  router.put(
    "/:notificationId/read",
    requireAuth,
    requireRole(["user", "admin"]),
    [
      param("notificationId").isString().notEmpty(),
    ],
    validateRequest,
    controller.markAsRead
  );

  // ==========================
  // Internal API
  // ==========================

  router.post(
    "/internal/notifications",
    requireInternalApiKey,
    [
      body("message").isString().notEmpty(),
      body("status")
        .optional()
        .isIn(["UNREAD", "READ"]),
    ],
    validateRequest,
    controller.createNotification
  );

  return router;
};