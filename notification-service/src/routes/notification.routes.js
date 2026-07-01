const express = require('express');
const { param, query } = require('express-validator');
const { NotificationController } = utils;
const { validateRequest } = require('../../middlewares/validateRequest');

module.exports = function createNotificationRoutes(notificationService) {
  const router = express.Router();
  const controller = new NotificationController(notificationService);

  router.get('/', [query('userId').optional().isString()], validateRequest, controller.getNotifications);
  router.put('/:notificationId/read', [param('notificationId').isString().notEmpty()], validateRequest, controller.markAsRead);

  return router;
};
