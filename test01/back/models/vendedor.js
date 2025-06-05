const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vendedor = sequelize.define('Vendedor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  regiao: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'vendedor',
  timestamps: false,
});

module.exports = Vendedor;
