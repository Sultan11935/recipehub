// middleware/authorizeRole.js

module.exports = function authorizeRole(allowedRoles) {
    return (req, res, next) => {
      // Check if the user's role is one of the allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access Denied: You do not have the required role' });
      }
      next(); // Allow access if role is authorized
    };
  };
  