const express = require('express');
const { body, query } = require('express-validator');
const { CartController } = require('../controllers/cart.controller');
const { validateRequest } = require('../middlewares/validateRequest');
const { requireRole } = require('../middlewares/auth');

module.exports = function createCartRoutes(cartService) {
  const router = express.Router();
  const controller = new CartController(cartService);

  router.post('/', [body('userId').isString().notEmpty(), body('eventId').isString().notEmpty(), body('quantity').isInt({ min: 1 })], validateRequest, controller.addItem);
  router.get('/', [query('userId').isString().notEmpty()], validateRequest, controller.viewCart);
  router.put('/items', [body('userId').isString().notEmpty(), body('cartId').isString().notEmpty(), body('quantity').isInt({ min: 1 })], validateRequest, controller.updateQuantity);
  router.delete('/items', [body('userId').isString().notEmpty(), body('cartId').isString().notEmpty()], validateRequest, controller.removeItem);
  router.get('/internal/carts/:cartId', requireRole(['admin']), controller.getCartItem);
  router.post('/internal/carts/:cartId/checkout', [body('orderId').isString().notEmpty()], requireRole(['admin']), validateRequest, controller.checkoutCart);

  return router;
};
