const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validate } = require('../middlewares/validate');
const { createReview, getReviewsForProvider } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/provider/:providerId', getReviewsForProvider);

router.post(
  '/', 
  protect,
  [
    check('bookingId', 'Booking ID is required').notEmpty(),
    check('providerId', 'Provider ID is required').notEmpty(),
    check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 })
  ],
  validate, 
  createReview
);

module.exports = router;
