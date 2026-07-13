const express = require("express");
const { body, query, param } = require("express-validator");

const { WaitlistController } = require("../controllers/waitlist.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const { requireAuth, requireRole } = require("../middlewares/auth");
const { requireInternalApiKey } = require("../middlewares/internalAuth");

module.exports = function createWaitlistRoutes(waitlistService) {
  const router = express.Router();
  const controller = new WaitlistController(waitlistService);

  // ==========================
  // Public APIs
  // ==========================

  router.post(
    "/",
    requireAuth,
    requireRole(["user", "admin"]),
    [
      body("eventId").isString().notEmpty(),
      body("quantity").isInt({ min: 1 }),
    ],
    validateRequest,
    controller.joinWaitlist
  );

  router.get(
    "/",
    requireAuth,
    requireRole(["user", "admin"]),
    [
      query("eventId").isString().notEmpty(),
    ],
    validateRequest,
    controller.getPosition
  );

  router.get(
    "/users/:userId/waitlists",
    requireAuth,
    requireRole(["user", "admin"]),
    [
      param("userId").isString().notEmpty(),
    ],
    validateRequest,
    controller.getUserWaitlists
  );

  router.delete(
    "/",
    requireAuth,
    requireRole(["user", "admin"]),
    [
      body("waitlistId").isString().notEmpty(),
    ],
    validateRequest,
    controller.leaveWaitlist
  );

  // ==========================
  // Internal API
  // ==========================

  router.post(
    "/internal/waitlist/process",
    requireInternalApiKey,
    [
      body("eventId").isString().notEmpty(),
    ],
    validateRequest,
    controller.processWaitlist
  );

  return router;
};