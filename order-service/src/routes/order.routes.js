const express = require('express');
const { body, param } = require('express-validator');
const { OrderController } = require('./controller');
const { validateRequest } = require('../../../E-Commerce/backend/src/middlewares/validateRequest');

module.exports = function createOrderRoutes(orderService) {
  const router = express.Router();
  const controller = new OrderController(orderService, orderService.cartRepository);

  router.post('/', [body('cartId').isString().notEmpty()], validateRequest, controller.createOrder);
  router.get('/users/:userId/orders', [param('userId').isString().notEmpty()], validateRequest, controller.getUserOrders);
  router.get('/:orderId', [param('orderId').isString().notEmpty()], validateRequest, controller.getOrder);
  router.post('/:orderId/cancel', [param('orderId').isString().notEmpty(), body('reason').optional().isString()], validateRequest, controller.cancelOrder);
  router.get('/:orderId/ticket', [param('orderId').isString().notEmpty()], validateRequest, controller.getTicket);

  return router;
};
