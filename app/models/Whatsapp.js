const {
  DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');

module.exports = sequelize.define('whatsapp', {
  nama: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
}, {
  timestamps: true,
  tableName: 'whatsapp'
});