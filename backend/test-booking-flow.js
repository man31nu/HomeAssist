const http = require('http');

async function request(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTest() {
  try {
    console.log('1. Logging in as customer...');
    const loginRes = await request('/api/auth/login', 'POST', {
      email: 'customer1@gmail.com',
      password: 'customer1'
    });
    if (loginRes.status !== 200) throw new Error('Login failed: ' + JSON.stringify(loginRes.data));
    const token = loginRes.data.data.token;
    console.log('✅ Login successful');

    console.log('2. Fetching services...');
    const servicesRes = await request('/api/services', 'GET');
    if (servicesRes.status !== 200 || !servicesRes.data.data.length) throw new Error('Failed to fetch services');
    const service = servicesRes.data.data[0];
    console.log(`✅ Found service: ${service.title} (ID: ${service.id}, Category: ${service.ServiceCategory?.name || 'Unknown'})`);

    console.log('3. Creating booking...');
    const bookingRes = await request('/api/bookings', 'POST', {
      service_id: service.id,
      service_category: service.ServiceCategory?.name || 'Cleaning',
      scheduled_date: '2026-07-01T10:00',
      notes: 'Test booking'
    }, token);
    if (bookingRes.status !== 201) throw new Error('Booking failed: ' + JSON.stringify(bookingRes.data));
    const bookingId = bookingRes.data.data.id;
    console.log(`✅ Booking created successfully (ID: ${bookingId})`);

    console.log('4. Creating Razorpay order...');
    const orderRes = await request('/api/payments/create-order', 'POST', {
      booking_id: bookingId
    }, token);
    if (orderRes.status !== 200) throw new Error('Razorpay order failed: ' + JSON.stringify(orderRes.data));
    const orderData = orderRes.data.data;
    console.log(`✅ Razorpay order created (Order ID: ${orderData.order_id}, Amount: ${orderData.amount})`);

    // We can't fully simulate step 5/6 (verification) without the Razorpay secret generating a valid signature
    // But reaching this step confirms the entire backend integration works up to checkout!
    console.log('🎉 Booking and payment creation flow works perfectly!');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

runTest();
