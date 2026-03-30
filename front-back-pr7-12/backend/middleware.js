const jwt = require('jsonwebtoken');
const { ACCESS_SECRET } = require('./config');
const { findUserById } = require('./security');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'Missing or invalid Authorization header',
    });
  }

  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    const user = findUserById(payload.sub);

    if (!user || user.blocked) {
      return res.status(403).json({
        error: 'Forbidden',
      });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid or expired token',
    });
  }
}

function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
      });
    }

    next();
  };
}

module.exports = {
  authMiddleware,
  roleMiddleware,
};