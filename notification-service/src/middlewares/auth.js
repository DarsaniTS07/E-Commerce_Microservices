const { AppError } = require("../utils/AppError");
const { verifier } = require("../config/cognito");

async function attachAuthContext(req, res, next) {
  console.log("=================================");
  console.log("HEADERS:", req.headers);

  const authHeader = req.header("Authorization");

  console.log("AUTH HEADER:", authHeader);

  try {
    if (!authHeader) {
      console.log("NO AUTH HEADER FOUND");
      return next();
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log("INVALID AUTH HEADER");
      return next(new AppError("Invalid authorization header", 401));
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN RECEIVED");

    const payload = await verifier.verify(token);

    console.log("JWT VERIFIED", payload);

    req.user = {
      id: payload.sub,
      email: payload.email,
      role:
        payload["cognito:groups"] &&
        payload["cognito:groups"].length > 0
          ? payload["cognito:groups"][0]
          : "user",
    };

    console.log("REQ.USER", req.user);

    return next();
  } catch (err) {
    console.log("JWT ERROR", err);
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