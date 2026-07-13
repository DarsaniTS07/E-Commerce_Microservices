function getActorId(req) {
  return req.user.id;
}

function getActorRole(req, fallback = 'user') {
  return req.user?.role || fallback;
}

module.exports = { getActorId, getActorRole };
