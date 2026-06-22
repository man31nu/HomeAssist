const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ServiceCategory = sequelize.define('ServiceCategory', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  }
}, {
  tableName: 'service_categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ServiceCategory;
