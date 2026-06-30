const express = require('express');
const { body, param } = require('express-validator');
const { PaymentController } = require('./controller');
const { validateRequest } = require('../../../E-Commerce/backend/src/middlewares/validateRequest');
const { requireRole } = require('../../../E-Commerce/backend/src/middlewares/auth');

module.exports = function createPaymentRoutes(paymentService) {
  const router = express.Router();
  const controller = new PaymentController(paymentService);

  router.post('/', [body('orderId').isString().notEmpty()], validateRequest, controller.initiatePayment);
  router.post('/callback', [body('status').isIn(['SUCCESS', 'FAILED']), body('orderId').optional().isString(), body('providerReference').optional().isString()], validateRequest, controller.paymentCallback);
  router.get('/refunds', requireRole(['admin']), controller.getRefunds);
  router.get('/:orderId', [param('orderId').isString().notEmpty()], validateRequest, controller.getPaymentStatus);

  return router;
};
