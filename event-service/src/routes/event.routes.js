const express = require('express');
const { body, param, query } = require('express-validator');
const { EventController } = require('../controllers/event.controller');
const { validateRequest } = require('../middlewares/validateRequest');
const { requireRole } = require('../middlewares/auth');

module.exports = function createEventRoutes(eventService) {
  const router = express.Router();
  const controller = new EventController(eventService);

  router.get(
    '/',
    [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1 }),

  query("city").optional().isString(),

  query("category").optional().isString(),

  query("date").optional().isISO8601(),

  query("status")
      .optional()
      .isIn([
          "DRAFT",
          "PUBLISHED",
          "CANCELLED"
      ])
],
    validateRequest,
    controller.listEvents
  );


  router.get(
    '/:eventId',
    [param('eventId').isString().notEmpty()],
    validateRequest,
    controller.getEventDetails
  );

  router.post(
    '/',
    [
      body('title').isString().notEmpty(),
      body('description').isString().notEmpty(),
      body('category').isString().notEmpty(),
      body('venue').isString().notEmpty(),
      body('city').isString().notEmpty(),
      body('eventDate').isISO8601(),
      body('eventTime').isString().notEmpty(),
      body('ticketPrice').isFloat({ min: 0 }),
      body("status")
    .optional()
    .isIn([
        "DRAFT",
        "PUBLISHED",
        "CANCELLED"
    ]),
      body('availableTicketCount').optional().isInt({ min: 0 }),
    ],
    requireRole(['organizer', 'admin']),
    validateRequest,
    controller.createEvent
  );

  router.put(
    '/:eventId',
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

    body("availableTicketCount")
        .optional()
        .isInt({ min: 0 }),

    body("status")
        .optional()
        .isIn([
            "DRAFT",
            "PUBLISHED",
            "CANCELLED"
        ])
],
    requireRole(['organizer', 'admin']),
    validateRequest,
    controller.updateEvent
  );

  router.delete(
    '/:eventId',
    [param('eventId').isString().notEmpty()],
    requireRole(['organizer', 'admin']),
    validateRequest,
    controller.deleteEvent
  );

  return router;
};
