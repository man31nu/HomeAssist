const { verifyToken } = require('../utils/jwt');
const { User, Role } = require('../models');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);

      // Fetch user with their Role (to get role name)
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password_hash'] },
        include: [{ model: Role, attributes: ['name'] }]
      });

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      // Attach role name as req.user.role for compatibility with all controllers
      req.user.role = req.user.Role ? req.user.Role.name : decoded.role;

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
