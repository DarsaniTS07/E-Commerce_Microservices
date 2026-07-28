const { AppError } = require("../utils/AppError");
const { verifier } = require("../config/cognito");

async function attachAuthContext(req, res, next) {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return next();
    }

    if (!authHeader.startsWith("Bearer ")) {
      return next(new AppError("Invalid authorization header", 401));
    }

    const token = authHeader.split(" ")[1];

    const payload = await verifier.verify(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
      role:
        payload["cognito:groups"] &&
        payload["cognito:groups"].length > 0
          ? payload["cognito:groups"][0]
          : "user",
    };

    return next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
}

function requireAuth(req, res, next) {
  if (!req.user || !req.user.id) {
    return next(new AppError("Authentication required", 401));
  }

  return next();
}

function requireRole(allowedRoles) {
  return function roleGuard(req, res, next) {
    if (!req.user || !req.user.role) {
      return next(new AppError("Authentication required", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }

    return next();
  };
}

module.exports = {
  attachAuthContext,
  requireAuth,
  requireRole,
};