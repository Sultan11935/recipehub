// middleware/authenticateToken.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    
    // Set req.user to include AuthorId and AuthorName from the token payload
    req.user = { userId: user.userId, AuthorId: user.AuthorId, AuthorName: user.AuthorName };
    next();
  });
};

module.exports = authenticateToken;
