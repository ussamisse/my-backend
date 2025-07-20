// backend/middleware/authorizeRole.js
function authorizeRole(requiredRole) {
  return (req, res, next) => {
     if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Access denied: Insufficient privileges' });
    }
    next();
  };
}

module.exports = authorizeRole;
