const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  booking_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  payment_method: {
    type: DataTypes.ENUM('upi', 'card', 'wallet', 'cash'),
    allowNull: true,
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'success', 'failed', 'refunded'),
    allowNull: true,
  },
  transaction_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'payments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Payment;
