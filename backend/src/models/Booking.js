const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  booking_number: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true,
  },
  customer_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  provider_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  service_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  scheduled_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  scheduled_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  final_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  booking_status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
}, {
  tableName: 'bookings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Booking;
