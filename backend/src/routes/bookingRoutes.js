const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validate } = require('../middlewares/validate');
const { 
  getBookings, 
  getBookingById, 
  createBooking, 
  updateBookingStatus 
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getBookings)
  .post(
    [
      check('service_id', 'Service ID is required').notEmpty(),
      check('scheduled_date', 'Valid scheduled date is required').isISO8601()
    ],
    validate,
    createBooking
  );

router.route('/:id')
  .get(getBookingById);

router.route('/:id/status')
  .put(
    [
      check('status', 'Valid status is required').isIn(['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'])
    ],
    validate,
    updateBookingStatus
  );

module.exports = router;
