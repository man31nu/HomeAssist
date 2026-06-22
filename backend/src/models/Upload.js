const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Upload = sequelize.define('Upload', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  file_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  file_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  file_type: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  tableName: 'uploads',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // uploads table has no updated_at column
});

module.exports = Upload;
