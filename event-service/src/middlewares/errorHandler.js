const { AppError } = require('../utils/AppError');

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    errors: [],
  });
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  const errors = error.details || [];

  if (error instanceof AppError) {
    return res.status(statusCode).json({ success: false, message, errors });
  }

console.error(error);

return res.status(statusCode).json({
  success: false,
  message,
  stack: error.stack,
});
}

module.exports = { notFoundHandler, errorHandler };
