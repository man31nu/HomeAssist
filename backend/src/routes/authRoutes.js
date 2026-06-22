const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validate } = require('../middlewares/validate');
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/register', [
  check('name', 'Full name is required').notEmpty().trim(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: false }),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  check('role').optional().isIn(['Customer', 'Provider']).withMessage('Role must be Customer or Provider'),
], validate, register);

router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], validate, login);

router.post('/forgot-password', [
  check('email', 'Please include a valid email').isEmail()
], validate, forgotPassword);

router.post('/reset-password', [
  check('token', 'Token is required').notEmpty(),
  check('newPassword', 'New Password must be 6 or more characters').isLength({ min: 6 })
], validate, resetPassword);

module.exports = router;
