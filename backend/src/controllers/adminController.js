const { User, Provider, Booking, Payment } = require('../models');
const apiResponse = require('../utils/apiResponse');

const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const totalProviders = await Provider.count();
    const totalBookings = await Booking.count();

    const completedBookings = await Booking.findAll({
      where: { booking_status: 'completed' }
    });
    const totalRevenue = completedBookings.reduce(
      (sum, b) => sum + parseFloat(b.final_amount || b.total_amount || 0), 0
    );

    return apiResponse.success(res, 'Dashboard stats fetched successfully', {
      totalUsers,
      totalProviders,
      totalBookings,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] }
    });
    return apiResponse.success(res, 'Users fetched successfully', users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
};
