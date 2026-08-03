const express = require("express");
const { body, param, query } = require("express-validator");
const { EventController } = require("../controllers/event.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const { requireInternalApiKey } = require("../middlewares/internalAuth");

const {
  attachAuthContext,
  requireAuth,
  requireRole,
} = require("../middlewares/auth");

module.exports = function createEventRoutes(eventService) {
  const router = express.Router();
  const controller = new EventController(eventService);

  // Public APIs

  const listEventsValidation = [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1 }),
    query("city").optional().isString(),
    query("category").optional().isString(),
    query("date").optional().isISO8601(),
    query("status")
      .optional()
      .isIn(["DRAFT", "PUBLISHED", "CANCELLED"]),
  ];

  // Root list route — works locally and via API Gateway /events root
  router.get(
    "/",
    requireAuth,
    requireRole(["user", "admin"]),
    listEventsValidation,
    validateRequest,
    controller.listEvents
  );

  // /list alias — needed for AWS API Gateway since GET /events root has no route,
  // but ANY /events/{proxy+} exists, so /events/list is matched and forwarded to Lambda
  router.get(
    "/list",
    requireAuth,
    requireRole(["user", "admin"]),
    listEventsValidation,
    validateRequest,
    controller.listEvents
  );

  router.get(
    "/:eventId",
    requireAuth,
    requireRole(["user", "admin"]),
    [param("eventId").isString().notEmpty()],
    validateRequest,
    controller.getEventDetails
  );

  // Internal API

  router.get(
    "/internal/events/:eventId",
    requireInternalApiKey,
    [param("eventId").isString().notEmpty()],
    validateRequest,
    controller.getEventDetails
  );

  router.put(
  "/internal/events/:eventId",
  requireInternalApiKey,
  [
    param("eventId").isString().notEmpty(),
    body("availableTicketCount").optional().isInt({ min: 0 }),
    body("availableStatus")
      .optional()
      .isIn(["AVAILABLE", "LIMITED", "SOLD_OUT", "HIDDEN"]),
  ],
  validateRequest,
  controller.updateEvent
);

  // Organizer/Admin APIs

  router.post(
    "/",
    requireAuth,
    requireRole(["organizer", "admin"]),
    [
      body("title").isString().notEmpty(),
      body("description").isString().notEmpty(),
      body("category").isString().notEmpty(),
      body("venue").isString().notEmpty(),
      body("city").isString().notEmpty(),
      body("eventDate").isISO8601(),
      body("eventTime").isString().notEmpty(),
      body("ticketPrice").isFloat({ min: 0 }),
      body("status")
        .optional()
        .isIn(["DRAFT", "PUBLISHED", "CANCELLED"]),
      body("availableTicketCount").optional().isInt({ min: 0 }),
    ],
    validateRequest,
    controller.createEvent
  );

  router.put(
    "/:eventId",
    attachAuthContext,
    requireAuth,
    requireRole(["organizer", "admin"]),
    [
      param("eventId").isString().notEmpty(),
      body("title").optional().isString(),
      body("description").optional().isString(),
      body("category").optional().isString(),
      body("venue").optional().isString(),
      body("city").optional().isString(),
      body("eventDate").optional().isISO8601(),
      body("eventTime").optional().isString(),
      body("ticketPrice").optional().isFloat({ min: 0 }),
      body("availableTicketCount").optional().isInt({ min: 0 }),
      body("status")
        .optional()
        .isIn(["DRAFT", "PUBLISHED", "CANCELLED"]),
    ],
    validateRequest,
    controller.updateEvent
  );

  router.delete(
    "/:eventId",
    requireAuth,
    requireRole(["organizer", "admin"]),
    [param("eventId").isString().notEmpty()],
    validateRequest,
    controller.deleteEvent
  );

  return router;
};