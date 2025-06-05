const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./cliente');
const Vendedor = require('./vendedor');

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cliente,
      key: 'id',
      onDelete: 'CASCADE',
    },
  },
  id_vendedor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Vendedor,
      key: 'id',
      onDelete: 'CASCADE',
    },
  },
  data_pedido: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  valor_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
}, {
  tableName: 'pedido',
  timestamps: false,
});

module.exports = Pedido;
