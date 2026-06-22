const { Review, Booking, Provider, Notification } = require('../models');
const apiResponse = require('../utils/apiResponse');

const createReview = async (req, res, next) => {
  try {
    const { booking_id, provider_id, rating, comment } = req.body;

    const booking = await Booking.findByPk(booking_id);
    if (!booking) return apiResponse.error(res, 'Booking not found', null, 404);

    if (Number(booking.customer_id) !== Number(req.user.id)) {
      return apiResponse.error(res, 'Not authorized', null, 403);
    }

    if (booking.booking_status !== 'completed') {
      return apiResponse.error(res, 'Can only review completed bookings', null, 400);
    }

    const review = await Review.create({
      booking_id,
      customer_id: req.user.id,
      provider_id,
      rating,
      comment,
    });

    // Recalculate provider average rating
    const provider = await Provider.findByPk(provider_id);
    if (provider) {
      const allReviews = await Review.findAll({ where: { provider_id } });
      const avgRating = allReviews.reduce((acc, r) => acc + (r.rating || 0), 0) / allReviews.length;
      provider.average_rating = parseFloat(avgRating.toFixed(2));
      await provider.save();

      await Notification.create({
        user_id: provider.user_id,
        title: 'New Review Received',
        message: `You received a ${rating}-star review for booking #${booking_id}.`,
      });
    }

    return apiResponse.success(res, 'Review submitted successfully', review, 201);
  } catch (error) {
    next(error);
  }
};

const getReviewsForProvider = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { provider_id: req.params.providerId },
      order: [['created_at', 'DESC']]
    });
    return apiResponse.success(res, 'Reviews fetched successfully', reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getReviewsForProvider,
};
