const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BookingStatusHistory = sequelize.define('BookingStatusHistory', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  booking_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  old_status: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  new_status: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  changed_by: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'booking_status_history',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // booking_status_history has no updated_at column
});

module.exports = BookingStatusHistory;
