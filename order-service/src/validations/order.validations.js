const { body, param } = require('express-validator');

const createOrderValidation = [body('cartId').isString().notEmpty()];
const orderIdParam = [param('orderId').isString().notEmpty()];
const userIdParam = [param('userId').isString().notEmpty()];

module.exports = { createOrderValidation, orderIdParam, userIdParam };
