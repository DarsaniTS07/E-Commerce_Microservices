const express = require('express');
const { body, param, query } = require('express-validator');
const { NotificationController } = require('../controllers/notification.controller');
const { validateRequest } = require('../middlewares/validateRequest');
const { requireRole } = require('../middlewares/auth');

module.exports = function createNotificationRoutes(notificationService) {
  const router = express.Router();
  const controller = new NotificationController(notificationService);

  router.get('/', [query('userId').optional().isString()], validateRequest, controller.getNotifications);
  router.put('/:notificationId/read', [param('notificationId').isString().notEmpty()], validateRequest, controller.markAsRead);
  
  router.post('/internal/notifications', [body('userId').isString().notEmpty(), body('message').isString().notEmpty()], requireRole(['admin']), validateRequest, controller.createNotification);

  return router;
};
