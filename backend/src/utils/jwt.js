const jwt = require('jsonwebtoken');

const generateToken = (userId, role, name, email) => {
  return jwt.sign({ id: userId, role, name, email }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
