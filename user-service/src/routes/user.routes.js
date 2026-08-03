const express = require('express');
const { UserController } = require('../controllers/user.controller');
const { requireAuth, requireRole } = require('../middlewares/auth');

module.exports = function createUserRoutes(userService) {
  const router = express.Router();
  const controller = new UserController(userService);

  // Admin APIs
  router.get('/', requireAuth, requireRole(['admin']), controller.listUsers);
  router.get('/:userId', requireAuth, requireRole(['admin']), controller.getUserDetails);
  router.delete('/:userId', requireAuth, requireRole(['admin']), controller.deleteUser);

  return router;
};
