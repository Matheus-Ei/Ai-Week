const Cliente = require('./cliente');
const Vendedor = require('./vendedor');
const Pedido = require('./pedido');
const Produto = require('./produto');
const ItemPedido = require('./item_pedido');

// Definir associações
Cliente.hasMany(Pedido, { foreignKey: 'id_cliente', as: 'pedidos' });
Pedido.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });

Vendedor.hasMany(Pedido, { foreignKey: 'id_vendedor', as: 'pedidos' });
Pedido.belongsTo(Vendedor, { foreignKey: 'id_vendedor', as: 'vendedor' });

Pedido.hasMany(ItemPedido, { foreignKey: 'id_pedido', as: 'itens' });
ItemPedido.belongsTo(Pedido, { foreignKey: 'id_pedido', as: 'pedido' });

Produto.hasMany(ItemPedido, { foreignKey: 'id_produto', as: 'itens_pedido' });
ItemPedido.belongsTo(Produto, { foreignKey: 'id_produto', as: 'produto' });

module.exports = {
  Cliente,
  Vendedor,
  Pedido,
  Produto,
  ItemPedido
};
