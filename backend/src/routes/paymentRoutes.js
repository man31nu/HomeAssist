const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validate } = require('../middlewares/validate');
const { processPayment, getPayments, createRazorpayOrder, verifyRazorpayPayment } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getPayments)
  .post(
    [
      check('bookingId', 'Booking ID is required').notEmpty(),
      check('amount', 'Valid amount is required').isNumeric()
    ],
    validate,
    processPayment
  );

router.route('/create-order')
  .post(
    [
      check('booking_id', 'Booking ID is required').notEmpty()
    ],
    validate,
    createRazorpayOrder
  );

router.route('/verify')
  .post(
    [
      check('razorpay_order_id', 'Razorpay Order ID is required').notEmpty(),
      check('razorpay_payment_id', 'Razorpay Payment ID is required').notEmpty(),
      check('razorpay_signature', 'Razorpay Signature is required').notEmpty(),
      check('booking_id', 'Booking ID is required').notEmpty()
    ],
    validate,
    verifyRazorpayPayment
  );

module.exports = router;
