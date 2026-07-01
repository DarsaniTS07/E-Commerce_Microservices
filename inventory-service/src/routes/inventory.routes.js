const express = require('express');
const { body, query } = require('express-validator');
const { InventoryController } = require('./controller');
const { validateRequest } = require('../../utils/validateRequest');
const { requireRole } = require('../../utils/requireRole');

module.exports = function createInventoryRoutes(inventoryService) {
  const router = express.Router();
  const controller = new InventoryController(inventoryService);

  router.get('/', [query('eventId').isString().notEmpty()], validateRequest, controller.getAvailability);
  router.post('/internal/inventory/reserve', [body('eventId').isString().notEmpty(), body('quantity').isInt({ min: 1 })], requireRole(['admin']), validateRequest, controller.reserveTickets);
  router.post('/internal/inventory/release', [body('eventId').isString().notEmpty(), body('quantity').isInt({ min: 1 })], requireRole(['admin']), validateRequest, controller.releaseTickets);
  router.post('/internal/inventory/confirm', [body('eventId').isString().notEmpty(), body('quantity').isInt({ min: 1 })], requireRole(['admin']), validateRequest, controller.confirmTickets);

  return router;
};
