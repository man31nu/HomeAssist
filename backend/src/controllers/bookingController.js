const { Booking, User, Provider, Service, BookingStatusHistory, Notification, Coupon } = require('../models');
const apiResponse = require('../utils/apiResponse');

const getBookings = async (req, res, next) => {
  try {
    let whereClause = {};
    if (req.user.role.toLowerCase() === 'customer') {
      whereClause.customer_id = req.user.id;
    } else if (req.user.role.toLowerCase() === 'provider') {
      const provider = await Provider.findOne({ where: { user_id: req.user.id } });
      if (provider) {
        const { Op } = require('sequelize');
        whereClause = {
          [Op.and]: [
            { service_category: provider.service_category },
            {
              [Op.or]: [
                { provider_id: provider.id },
                { provider_id: null }
              ]
            }
          ]
        };
      } else {
        return apiResponse.success(res, 'No bookings found', []);
      }
    }

    const bookings = await Booking.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'Customer', attributes: ['id', 'full_name', 'email'] },
        { model: Provider, include: [{ model: User, attributes: ['full_name'] }] },
        { model: Service, attributes: ['id', 'title'] },
      ],
      order: [['created_at', 'DESC']]
    });
    return apiResponse.success(res, 'Bookings fetched successfully', bookings);
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Customer', attributes: ['id', 'full_name', 'email', 'phone'] },
        { model: Provider, include: [{ model: User, attributes: ['full_name', 'phone'] }] },
        { model: Service, attributes: ['id', 'title', 'base_price'] },
        { model: BookingStatusHistory }
      ]
    });

    if (!booking) {
      return apiResponse.error(res, 'Booking not found', null, 404);
    }

    let isAuthorized = false;
    if (req.user.role.toLowerCase() === 'admin') isAuthorized = true;
    else if (req.user.role.toLowerCase() === 'customer' && Number(booking.customer_id) === Number(req.user.id)) isAuthorized = true;
    else if (req.user.role.toLowerCase() === 'provider' && booking.Provider && Number(booking.Provider.user_id) === Number(req.user.id)) isAuthorized = true;

    if (!isAuthorized) {
      return apiResponse.error(res, 'Not authorized to view this booking', null, 403);
    }

    return apiResponse.success(res, 'Booking fetched successfully', booking);
  } catch (error) {
    next(error);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const { provider_id, service_id, service_category, scheduled_date, scheduled_time, notes, couponCode } = req.body;

    const service = await Service.findByPk(service_id);
    if (!service) return apiResponse.error(res, 'Service not found', null, 404);

    let total_amount = parseFloat(service.base_price) || 0;
    let coupon_id = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ where: { code: couponCode, is_active: true } });
      if (coupon && (!coupon.expiry_date || new Date(coupon.expiry_date) > new Date())) {
        if (coupon.discount_type === 'percentage') {
          total_amount -= (total_amount * parseFloat(coupon.discount_value)) / 100;
        } else if (coupon.discount_type === 'fixed') {
          total_amount -= parseFloat(coupon.discount_value);
        }
        total_amount = Math.max(0, total_amount);
        coupon_id = coupon.id;
      }
    }

    // Generate unique booking number
    const booking_number = `BK-${Date.now()}`;

    // Extract time from datetime string if scheduled_time is missing
    let final_time = scheduled_time;
    let final_date = scheduled_date;
    if (scheduled_date && !scheduled_time) {
      const dateObj = new Date(scheduled_date);
      if (!isNaN(dateObj.getTime())) {
        final_time = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:00`;
        final_date = scheduled_date.split('T')[0];
      }
    }

    const booking = await Booking.create({
      booking_number,
      customer_id: req.user.id,
      provider_id: provider_id || null,
      service_id,
      service_category: service_category || 'Electrician',
      scheduled_date: final_date || null,
      scheduled_time: final_time || '00:00:00',
      total_amount,
      final_amount: total_amount,
      booking_status: 'pending',
    });

    // Track status history
    await BookingStatusHistory.create({
      booking_id: booking.id,
      old_status: null,
      new_status: 'pending',
      changed_by: req.user.id,
      remarks: 'Booking created by customer',
    });

    // Notify provider if assigned
    if (provider_id) {
      const provider = await Provider.findByPk(provider_id);
      if (provider) {
        await Notification.create({
          user_id: provider.user_id,
          title: 'New Booking Request',
          message: `You have a new booking request for ${service.title} on ${scheduled_date || 'a date TBD'}`,
        });
      }
    }

    return apiResponse.success(res, 'Booking created successfully', booking, 201);
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Provider }, { model: User, as: 'Customer' }]
    });

    if (!booking) return apiResponse.error(res, 'Booking not found', null, 404);

    const validStatuses = ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return apiResponse.error(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, null, 400);
    }

    let isAuthorized = false;
    if (req.user.role.toLowerCase() === 'admin') {
      isAuthorized = true;
    } else if (req.user.role.toLowerCase() === 'provider') {
      // If it's unassigned or assigned to this provider, allow them to update it
      if (!booking.provider_id || (booking.Provider && Number(booking.Provider.user_id) === Number(req.user.id))) {
        if (['confirmed', 'assigned', 'in_progress', 'completed'].includes(status)) isAuthorized = true;
      }
    } else if (req.user.role.toLowerCase() === 'customer' && Number(booking.customer_id) === Number(req.user.id)) {
      if (status === 'cancelled') isAuthorized = true;
    }

    if (!isAuthorized) {
      return apiResponse.error(res, 'Not authorized to perform this status update', null, 403);
    }

    const old_status = booking.booking_status;
    booking.booking_status = status;
    
    // Assign provider if they are taking action on an unassigned booking
    if (req.user.role.toLowerCase() === 'provider' && !booking.provider_id) {
      const provider = await Provider.findOne({ where: { user_id: req.user.id } });
      if (provider) {
        booking.provider_id = provider.id;
      }
    }

    // If completed, update provider stats (optional but good practice)
    if (status === 'completed' && old_status !== 'completed' && booking.provider_id) {
      const provider = await Provider.findByPk(booking.provider_id);
      if (provider) {
        provider.total_jobs_completed = (provider.total_jobs_completed || 0) + 1;
        provider.wallet_balance = parseFloat(provider.wallet_balance || 0) + parseFloat(booking.final_amount || booking.total_amount || 0);
        await provider.save();
      }
    }

    await booking.save();

    // Track status change history
    await BookingStatusHistory.create({
      booking_id: booking.id,
      old_status,
      new_status: status,
      changed_by: req.user.id,
      remarks: remarks || `Status updated to ${status} by ${req.user.role}`,
    });

    // Notify customer of status change
    await Notification.create({
      user_id: booking.customer_id,
      title: 'Booking Status Update',
      message: `Your booking #${booking.booking_number || booking.id} status is now: ${status}.`,
    });

    return apiResponse.success(res, 'Booking status updated successfully', booking);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
};
