const express = require('express');
const { body, query, param } = require('express-validator');
const { WaitlistController } = require('./controller');
const { validateRequest } = require('../../middlewares/validateRequest');

module.exports = function createWaitlistRoutes(waitlistService) {
  const router = express.Router();
  const controller = new WaitlistController(waitlistService);

  router.post('/', [body('eventId').isString().notEmpty(), body('userId').isString().notEmpty(), body('quantity').isInt({ min: 1 })], validateRequest, controller.joinWaitlist);
  router.get('/', [query('eventId').isString().notEmpty(), query('userId').isString().notEmpty()], validateRequest, controller.getPosition);
  router.get('/users/:userId/waitlists', [param('userId').isString().notEmpty()], validateRequest, controller.getUserWaitlists);
  router.delete('/', [body('waitlistId').isString().notEmpty()], validateRequest, controller.leaveWaitlist);

  return router;
};
