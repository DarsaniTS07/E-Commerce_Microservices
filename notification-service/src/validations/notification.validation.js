const { param, query } = require('express-validator');

const notificationQueryValidation = [query('userId').optional().isString()];
const notificationIdParam = [param('notificationId').isString().notEmpty()];

module.exports = { notificationQueryValidation, notificationIdParam };
