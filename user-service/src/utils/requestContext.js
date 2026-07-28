function getActorId(req, fallback = null) {
  return req.user?.id || fallback;
}

function getActorRole(req, fallback = 'user') {
  return req.user?.role || fallback;
}

module.exports = { getActorId, getActorRole };
