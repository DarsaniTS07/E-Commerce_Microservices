const { body, query } = require('express-validator');

const addItemValidation = [body('userId').isString().notEmpty(), body('eventId').isString().notEmpty(), body('quantity').isInt({ min: 1 })];
const updateQuantityValidation = [body('userId').isString().notEmpty(), body('cartId').isString().notEmpty(), body('quantity').isInt({ min: 1 })];
const cartQueryValidation = [query('userId').isString().notEmpty()];

module.exports = { addItemValidation, updateQuantityValidation, cartQueryValidation };
