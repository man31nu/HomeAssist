require('dotenv').config({ path: __dirname + '/.env' });
const axios = require('axios');
const crypto = require('crypto');
const { sequelize } = require('./src/config/db');
const { Service } = require('./src/models');

const BASE_URL = 'http://localhost:5000/api';

async function testPaymentIntegration() {
  try {
    console.log('--- STARTING PAYMENT INTEGRATION TEST ---');

    // 1. Create a dummy customer
    const dummyEmail = `testuser_${Date.now()}@example.com`;
    console.log(`\n1. Registering dummy customer: ${dummyEmail}`);
    const regRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test Customer',
      email: dummyEmail,
      password: 'password123',
      role: 'Customer',
      phone: `99${Math.floor(10000000 + Math.random() * 90000000)}`
    });
    const token = regRes.data.data.token;
    console.log('✅ Customer registered successfully. Token received.');

    // 2. Fetch a service from DB
    await sequelize.authenticate();
    const service = await Service.findOne();
    if (!service) throw new Error('No services found in DB to book!');
    console.log(`\n2. Found Service: ${service.title} (ID: ${service.id}, Price: ₹${service.base_price})`);

    // 3. Create a Booking
    console.log('\n3. Creating a Booking...');
    const bookingRes = await axios.post(`${BASE_URL}/bookings`, {
      service_id: service.id,
      scheduled_date: new Date().toISOString()
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const bookingId = bookingRes.data.data.id;
    console.log(`✅ Booking created! Booking ID: ${bookingId}, Status: ${bookingRes.data.data.booking_status}`);

    // 4. Create Razorpay Order
    console.log('\n4. Initiating Razorpay Order...');
    const orderRes = await axios.post(`${BASE_URL}/payments/create-order`, {
      booking_id: bookingId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const orderId = orderRes.data.data.order_id;
    console.log(`✅ Order created successfully! Razorpay Order ID: ${orderId}`);

    // 5. Simulate Payment Verification
    console.log('\n5. Simulating Frontend Payment Verification with Dummy Details...');
    const dummyPaymentId = `pay_dummy_${Date.now()}`;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    
    // Generate valid signature just like Razorpay does
    const text = orderId + "|" + dummyPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex');

    console.log(`Generated Signature: ${expectedSignature}`);

    const verifyRes = await axios.post(`${BASE_URL}/payments/verify`, {
      razorpay_order_id: orderId,
      razorpay_payment_id: dummyPaymentId,
      razorpay_signature: expectedSignature,
      booking_id: bookingId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✅ Payment Verification Successful! Status: ${verifyRes.data.message}`);

    // 6. Verify Final Booking Status
    console.log('\n6. Checking Final Booking Status...');
    const fetchBookingRes = await axios.get(`${BASE_URL}/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`Final Booking Status: ${fetchBookingRes.data.data.booking_status}`);
    
    if (fetchBookingRes.data.data.booking_status === 'confirmed') {
      console.log('🎉 INTEGRATION TEST PASSED SUCCESSFULLY!');
    } else {
      console.error('❌ INTEGRATION TEST FAILED! Booking status is not confirmed.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ TEST FAILED WITH ERROR:');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

testPaymentIntegration();
