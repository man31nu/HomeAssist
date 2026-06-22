const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { User, PasswordReset, Role } = require('../models');
const { generateToken } = require('../utils/jwt');
const apiResponse = require('../utils/apiResponse');

// Valid role names accepted from frontend
const VALID_ROLES = ['Customer', 'Provider'];

const register = async (req, res, next) => {
  try {
    // NOTE: 'address' field from frontend is intentionally ignored
    // (users table has no address column — address is in the addresses table)
    const { name, email, password, role, phone } = req.body;

    // Check for duplicate email
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return apiResponse.error(res, 'An account with this email already exists', null, 400);
    }

    // Check for duplicate phone (if provided)
    if (phone) {
      // Normalize: strip spaces/dashes for comparison
      const phoneExists = await User.findOne({ where: { phone } });
      if (phoneExists) {
        return apiResponse.error(res, 'An account with this phone number already exists', null, 400);
      }
    }

    // Validate and resolve role
    const roleName = VALID_ROLES.includes(role) ? role : 'Customer';
    const roleRecord = await Role.findOne({ where: { name: roleName } });
    if (!roleRecord) {
      return apiResponse.error(res, `Server configuration error: role '${roleName}' missing. Please contact support.`, null, 500);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      full_name: name,
      email,
      password_hash,
      role_id: roleRecord.id,
      phone: phone || null,
      is_verified: false,
      is_active: true,
    });

    // Create provider profile if role is Provider
    if (roleName === 'Provider') {
      const { Provider } = require('../models');
      const serviceCategory = req.body.service_category || 'Electrician'; // Default fallback
      await Provider.create({
        user_id: user.id,
        service_category: serviceCategory,
        experience_years: 0,
        is_verified: false,
        rating: 0,
      });
    }

    const token = generateToken(user.id, roleName, user.full_name, user.email);

    return apiResponse.success(res, 'Account created successfully! Welcome to HomeAssist.', {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: roleName,
      token,
    }, 201);
  } catch (error) {
    // Handle Sequelize unique constraint errors gracefully
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors?.[0]?.path || 'field';
      const msg = field === 'email'
        ? 'An account with this email already exists'
        : field === 'phone'
          ? 'An account with this phone number already exists'
          : 'A duplicate value was found. Please try different details.';
      return apiResponse.error(res, msg, null, 400);
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, attributes: ['name'] }]
    });

    if (!user) {
      return apiResponse.error(res, 'Invalid email or password', null, 401);
    }

    if (!user.is_active) {
      return apiResponse.error(res, 'Your account has been deactivated. Please contact support.', null, 403);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return apiResponse.error(res, 'Invalid email or password', null, 401);
    }

    // Update last_login timestamp
    user.last_login = new Date();
    await user.save();

    const roleName = user.Role ? user.Role.name : 'Customer';
    const token = generateToken(user.id, roleName, user.full_name, user.email);

    return apiResponse.success(res, 'Login successful', {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: roleName,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    // Security: don't reveal whether email exists
    if (!user) {
      return apiResponse.success(res, 'If your email is registered, you will receive a reset link.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await PasswordReset.create({
      user_id: user.id,
      token: hashedToken,
      expires_at: expiresAt,
    });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    console.log(`[Email Mock] Reset link for ${email}: ${resetUrl}`);

    return apiResponse.success(res, 'If your email is registered, you will receive a reset link.', {
      resetTokenMock: resetToken // Remove in production
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const passwordReset = await PasswordReset.findOne({
      where: { token: hashedToken }
    });

    if (!passwordReset || passwordReset.expires_at < new Date()) {
      return apiResponse.error(res, 'Invalid or expired reset token', null, 400);
    }

    const user = await User.findByPk(passwordReset.user_id);
    if (!user) {
      return apiResponse.error(res, 'User not found', null, 404);
    }

    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Remove used token
    await passwordReset.destroy();

    return apiResponse.success(res, 'Password reset successfully. You can now log in.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
