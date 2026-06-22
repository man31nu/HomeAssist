require('dotenv').config({ path: 'c:/Assigned-Project/services-booking-app/backend/.env' });
const bcrypt = require('bcrypt');
const { sequelize } = require('./src/config/db');
const { User, Role } = require('./src/models');

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    
    // Find Admin role
    const adminRole = await Role.findOne({ where: { name: 'Admin' } });
    if (!adminRole) {
      console.error('Admin role not found!');
      process.exit(1);
    }

    const email = 'mannu@example.com';
    const password = 'mannu123';
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        full_name: 'mannu',
        email: email,
        password_hash: password_hash,
        role_id: adminRole.id,
        phone: '1234567890',
        is_verified: true,
        is_active: true
      }
    });

    if (created) {
      console.log(`Admin user created! Email: ${email}, Password: ${password}`);
    } else {
      // If user exists, update it to be Admin and update password
      user.role_id = adminRole.id;
      user.password_hash = password_hash;
      user.full_name = 'mannu';
      await user.save();
      console.log(`Admin user updated! Email: ${email}, Password: ${password}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Failed to create Admin:', error);
    process.exit(1);
  }
};

createAdmin();
