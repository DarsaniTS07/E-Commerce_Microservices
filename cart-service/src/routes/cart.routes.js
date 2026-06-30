const express = require('express');
const { body, query } = require('express-validator');
const { CartController } = require('./controller');
const { validateRequest } = require('../../../E-Commerce/backend/src/middlewares/validateRequest');

module.exports = function createCartRoutes(cartService) {
  const router = express.Router();
  const controller = new CartController(cartService);

  router.post('/', [body('userId').isString().notEmpty(), body('eventId').isString().notEmpty(), body('quantity').isInt({ min: 1 })], validateRequest, controller.addItem);
  router.get('/', [query('userId').isString().notEmpty()], validateRequest, controller.viewCart);
  router.put('/items', [body('userId').isString().notEmpty(), body('cartId').isString().notEmpty(), body('quantity').isInt({ min: 1 })], validateRequest, controller.updateQuantity);
  router.delete('/items', [body('userId').isString().notEmpty(), body('cartId').isString().notEmpty()], validateRequest, controller.removeItem);

  return router;
};
