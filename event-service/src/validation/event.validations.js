const { body, param, query } = require('express-validator');

const createEventValidation = [
  body('title').isString().notEmpty(),
  body('description').isString().notEmpty(),
  body('category').isString().notEmpty(),
  body('venue').isString().notEmpty(),
  body('city').isString().notEmpty(),
  body('eventDate').isISO8601(),
  body('eventTime').isString().notEmpty(),
  body('ticketPrice').isFloat({ min: 0 }),
  body('availableTicketCount').optional().isInt({ min: 0 }),
];

const eventIdParam = [param('eventId').isString().notEmpty()];
const listEventValidation = [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1 })];

module.exports = { createEventValidation, eventIdParam, listEventValidation };
