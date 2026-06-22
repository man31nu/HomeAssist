const { Notification } = require('../models');
const apiResponse = require('../utils/apiResponse');

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    return apiResponse.success(res, 'Notifications fetched successfully', notifications);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!notification) {
      return apiResponse.error(res, 'Notification not found', null, 404);
    }

    notification.is_read = true;
    await notification.save();

    return apiResponse.success(res, 'Notification marked as read', notification);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead
};
