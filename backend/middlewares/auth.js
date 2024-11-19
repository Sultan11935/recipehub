// middleware/authenticateToken.js

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Extract the token from the Authorization header if available
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    console.log('Access Denied: No Token Provided');
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Invalid Token:', err.message); // Debugging log for token verification error
      return res.status(403).json({ message: 'Invalid Token' });
    }
    
    // Log the decoded user information for debugging
    console.log('Token Verified. User:', user);

    // Attach user information, including role, to the request object for further usage
    req.user = {
      userId: user.userId,
      AuthorId: user.AuthorId,
      AuthorName: user.AuthorName,
      role: user.role // Add role to request
    };

    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateToken;
