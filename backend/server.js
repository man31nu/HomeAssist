require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/config/db');

// Register all models and associations
require('./src/models/index');
const { Role } = require('./src/models');

const PORT = process.env.PORT || 5000;

/** Ensure the roles table always has the 3 base roles */
async function seedRoles() {
  const baseRoles = [
    { name: 'Customer', description: 'A customer who books home services' },
    { name: 'Provider', description: 'A service provider who fulfills bookings' },
    { name: 'Admin',    description: 'System administrator with full access' },
  ];

  for (const r of baseRoles) {
    await Role.findOrCreate({ where: { name: r.name }, defaults: r });
  }
  console.log('✅ Roles seeded (Customer / Provider / Admin).');
}

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connection established successfully.');

    await sequelize.sync({ alter: false, force: false });
    console.log('✅ Sequelize models synced to existing homeassist_db tables.');

    await seedRoles();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
