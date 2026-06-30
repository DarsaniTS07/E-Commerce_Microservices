const { body, param } = require('express-validator');

const initiatePaymentValidation = [body('orderId').isString().notEmpty()];
const paymentCallbackValidation = [body('status').isIn(['SUCCESS', 'FAILED']), body('orderId').optional().isString(), body('providerReference').optional().isString()];
const orderIdParam = [param('orderId').isString().notEmpty()];

module.exports = { initiatePaymentValidation, paymentCallbackValidation, orderIdParam };
