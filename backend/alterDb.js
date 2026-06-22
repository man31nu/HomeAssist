require('dotenv').config();
const { sequelize } = require('./src/config/db');

async function alterSchema() {
  try {
    await sequelize.authenticate();
    await sequelize.query("ALTER TABLE bookings ADD COLUMN service_category ENUM('Electrician', 'Carpenter', 'Plumber', 'Cleaning', 'AC Repair', 'Appliance Repair') NOT NULL DEFAULT 'Electrician';");
    console.log('Schema altered successfully.');
  } catch (e) {
    console.error('Error:', e);
  }
  process.exit();
}

alterSchema();
