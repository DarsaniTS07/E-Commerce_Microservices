const { body, param } = require('express-validator');

const eventIdParam = [param('eventId').isString().notEmpty()];
const inventoryMutationValidation = [body('eventId').isString().notEmpty(), body('quantity').isInt({ min: 1 })];

module.exports = { eventIdParam, inventoryMutationValidation };
