const { User } = require('../models');
const bcrypt = require('bcrypt');
const apiResponse = require('../utils/apiResponse');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return apiResponse.error(res, 'User not found', null, 404);
    }

    return apiResponse.success(res, 'User profile fetched successfully', user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return apiResponse.error(res, 'User not found', null, 404);
    }

    const { name, phone, email, password } = req.body;

    if (name) user.full_name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(password, salt);
    }

    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password_hash;

    return apiResponse.success(res, 'User profile updated successfully', userResponse);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
