const { body, param, query } = require('express-validator');

const joinWaitlistValidation = [body('eventId').isString().notEmpty(), body('userId').isString().notEmpty(), body('quantity').isInt({ min: 1 })];
const waitlistQueryValidation = [query('eventId').isString().notEmpty(), query('userId').isString().notEmpty()];
const userWaitlistValidation = [param('userId').isString().notEmpty()];

module.exports = { joinWaitlistValidation, waitlistQueryValidation, userWaitlistValidation };
