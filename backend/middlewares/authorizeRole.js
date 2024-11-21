// middleware/authorizeRole.js

module.exports = function authorizeRole(allowedRoles) {
  return (req, res, next) => {
    console.log(`User Role: ${req.user.role}, Allowed Roles: ${allowedRoles}`); // Debugging log
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access Denied: You do not have the required role' });
    }
    next();
  };
};

  