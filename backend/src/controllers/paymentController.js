const { Payment, Booking, Notification, Service, User } = require('../models');
const apiResponse = require('../utils/apiResponse');

const processPayment = async (req, res, next) => {
  try {
    const { booking_id, amount, payment_method } = req.body;

    const booking = await Booking.findByPk(booking_id);
    if (!booking) {
      return apiResponse.error(res, 'Booking not found', null, 404);
    }

    if (Number(booking.customer_id) !== Number(req.user.id) && req.user.role.toLowerCase() !== 'admin') {
      return apiResponse.error(res, 'Not authorized', null, 403);
    }

    const validMethods = ['upi', 'card', 'wallet', 'cash'];
    const method = payment_method ? payment_method.toLowerCase() : 'cash';
    if (!validMethods.includes(method)) {
      return apiResponse.error(res, `Invalid payment_method. Must be one of: ${validMethods.join(', ')}`, null, 400);
    }

    // Mock payment gateway — 90% success rate
    const isSuccess = Math.random() > 0.1;
    const payment_status = isSuccess ? 'success' : 'failed';
    const transaction_id = isSuccess ? `TXN-${Date.now()}` : null;

    const payment = await Payment.create({
      booking_id,
      amount,
      payment_method: method,
      payment_status,
      transaction_id,
    });

    if (isSuccess) {
      await Notification.create({
        user_id: req.user.id,
        title: 'Payment Successful',
        message: `Your payment of ₹${amount} for booking #${booking.booking_number || booking_id} was successful.`,
      });
      return apiResponse.success(res, 'Payment processed successfully', payment, 201);
    } else {
      return apiResponse.error(res, 'Payment failed to process', payment, 400);
    }
  } catch (error) {
    next(error);
  }
};

const Razorpay = require('razorpay');
const crypto = require('crypto');

const getPayments = async (req, res, next) => {
  try {
    let whereClause = {};
    if (req.user.role.toLowerCase() === 'customer') {
      const bookings = await Booking.findAll({
        where: { customer_id: req.user.id },
        attributes: ['id']
      });
      const bookingIds = bookings.map(b => b.id);
      whereClause.booking_id = bookingIds;
    }

    const payments = await Payment.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });
    return apiResponse.success(res, 'Payments fetched successfully', payments);
  } catch (error) {
    next(error);
  }
};

// ==========================================
// RAZORPAY INTEGRATION
// ==========================================

const createRazorpayOrder = async (req, res, next) => {
  try {
    const { booking_id } = req.body;
    
    const booking = await Booking.findByPk(booking_id, {
      include: [
        { model: Service, attributes: ['title'] },
        { model: User, as: 'Customer', attributes: ['email', 'full_name'] }
      ]
    });
    if (!booking) return apiResponse.error(res, 'Booking not found', null, 404);

    // Make sure user owns the booking
    if (Number(booking.customer_id) !== Number(req.user.id)) {
      return apiResponse.error(res, 'Not authorized', null, 403);
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Amount must be in the smallest currency unit (paise)
    const options = {
      amount: Math.round(Number(booking.final_amount) * 100),
      currency: 'INR',
      receipt: `receipt_order_${booking.id}`,
      notes: {
        booking_id: booking.id.toString(),
        booking_number: booking.booking_number || '',
        service_title: booking.Service ? booking.Service.title : 'Unknown Service',
        customer_name: booking.Customer ? booking.Customer.full_name : 'Unknown',
        customer_email: booking.Customer ? booking.Customer.email : 'Unknown'
      }
    };

    const order = await razorpay.orders.create(options);
    
    return apiResponse.success(res, 'Order created successfully', {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    next(error);
  }
};

const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = req.body;

    const booking = await Booking.findByPk(booking_id);
    if (!booking) return apiResponse.error(res, 'Booking not found', null, 404);

    // Verify signature
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text.toString())
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return apiResponse.error(res, 'Payment verification failed', null, 400);
    }

    // Payment is authentic!
    const payment = await Payment.create({
      booking_id,
      amount: booking.final_amount,
      payment_method: 'card', // For generic razorpay recording
      payment_status: 'success',
      transaction_id: razorpay_payment_id,
    });

    // Update booking to confirmed
    booking.booking_status = 'confirmed';
    await booking.save();

    await Notification.create({
      user_id: req.user.id,
      title: 'Payment Successful',
      message: `Your payment for booking #${booking.booking_number} was verified successfully.`,
    });

    return apiResponse.success(res, 'Payment verified successfully', payment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processPayment,
  getPayments,
  createRazorpayOrder,
  verifyRazorpayPayment,
};
