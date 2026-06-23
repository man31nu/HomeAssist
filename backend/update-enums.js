require('dotenv').config();
const { sequelize } = require('./src/config/db');

async function updateEnums() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    await sequelize.query(`
      ALTER TABLE bookings 
      MODIFY COLUMN service_category ENUM('Electrician', 'Carpenter', 'Plumber', 'Cleaning', 'AC Repair', 'Appliance Repair', 'Salon for Women') NOT NULL DEFAULT 'Electrician';
    `);

    await sequelize.query(`
      ALTER TABLE providers 
      MODIFY COLUMN service_category ENUM('Electrician', 'Carpenter', 'Plumber', 'Cleaning', 'AC Repair', 'Appliance Repair', 'Salon for Women') NOT NULL DEFAULT 'Electrician';
    `);

    console.log('ENUMs updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating ENUMs:', error);
    process.exit(1);
  }
}

updateEnums();
