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

const updateProviderCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    const provider = await Provider.findByPk(id);
    if (!provider) {
      return apiResponse.error(res, 'Provider not found', null, 404);
    }

    const validCategories = ['Electrician', 'Carpenter', 'Plumber', 'Cleaning', 'AC Repair', 'Appliance Repair'];
    if (!validCategories.includes(category)) {
      return apiResponse.error(res, 'Invalid service category', null, 400);
    }

    provider.service_category = category;
    await provider.save();

    return apiResponse.success(res, 'Provider category updated successfully', provider);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateProviderCategory,
};
