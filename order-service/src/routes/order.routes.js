const express = require('express');
const { body, param } = require('express-validator');
const { OrderController } = require('../controllers/order.controller');
const { validateRequest } = require('../middlewares/validateRequest');
const { requireRole } = require('../middlewares/auth');

module.exports = function createOrderRoutes(orderService) {
  const router = express.Router();
  const controller = new OrderController(orderService);

  router.post('/', [body('cartId').isString().notEmpty()], validateRequest, controller.createOrder);
  router.get('/users/:userId/orders', [param('userId').isString().notEmpty()], validateRequest, controller.getUserOrders);
  router.get('/:orderId', [param('orderId').isString().notEmpty()], validateRequest, controller.getOrder);
  router.post('/:orderId/cancel', [param('orderId').isString().notEmpty(), body('reason').optional().isString()], validateRequest, controller.cancelOrder);
  router.get('/:orderId/ticket', [param('orderId').isString().notEmpty()], validateRequest, controller.getTicket);
  router.post('/internal/orders/:orderId/confirm', [param('orderId').isString().notEmpty()], requireRole(['admin']), validateRequest, controller.confirmOrder);
  router.post('/internal/orders/:orderId/cancel', [param('orderId').isString().notEmpty(), body('reason').optional().isString()], requireRole(['admin']), validateRequest, controller.cancelOrder);

  return router;
};
