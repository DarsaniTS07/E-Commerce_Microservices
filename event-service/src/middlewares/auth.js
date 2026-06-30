const { AppError } = require('../src/utils/AppError');

function attachAuthContext(req, res, next) {
  const userId = req.header('x-user-id');
  const role = req.header('x-user-role') || 'user';

  if (userId) {
    req.user = {
      id: userId,
      role,
    };
  }

  next();
}

function requireAuth(req, res, next) {
  if (!req.user || !req.user.id) {
    return next(new AppError('Authentication required', 401));
  }

  return next();
}

function requireRole(allowedRoles) {
  return function roleGuard(req, res, next) {
    if (!req.user || !req.user.role) {
      return next(new AppError('Authentication required', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Forbidden', 403));
    }

    return next();
  };
}

module.exports = { attachAuthContext, requireAuth, requireRole };
