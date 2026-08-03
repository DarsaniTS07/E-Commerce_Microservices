function successResponse(message, data = {}, statusCode = 200) {
  return { statusCode, body: { success: true, message, data } };
}

function errorResponse(message, errors = [], statusCode = 400) {
  return { statusCode, body: { success: false, message, errors } };
}

module.exports = { successResponse, errorResponse };
