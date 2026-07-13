const { AppError } = require("../utils/AppError");

function requireInternalApiKey(req, res, next) {
  const apiKey = req.header("x-internal-api-key");

  if (!apiKey) {
    return next(new AppError("Internal API key required", 401));
  }

  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return next(new AppError("Invalid internal API key", 403));
  }

  next();
}

module.exports = {
  requireInternalApiKey,
};