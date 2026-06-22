const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Provider = sequelize.define('Provider', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  service_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  service_category: {
    type: DataTypes.ENUM('Electrician', 'Carpenter', 'Plumber', 'Cleaning', 'AC Repair', 'Appliance Repair'),
    allowNull: false,
    defaultValue: 'Electrician',
  },
  experience_years: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  skills: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  hourly_rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  verification_status: {
    type: DataTypes.ENUM('pending', 'verified', 'rejected'),
    defaultValue: 'pending',
  },
  average_rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00,
  },
  total_jobs_completed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  wallet_balance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
}, {
  tableName: 'providers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Provider;
