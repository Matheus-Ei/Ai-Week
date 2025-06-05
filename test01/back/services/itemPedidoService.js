const ItemPedido = require('../models/item_pedido');
const Pedido = require('../models/pedido');
const Produto = require('../models/produto');
const Cliente = require('../models/cliente');
const Vendedor = require('../models/vendedor');
const { Op } = require('sequelize');

class ItemPedidoService {
  async getAllItensPedido() {
    return await ItemPedido.findAll({
      include: [
        {
          model: Pedido,
          as: 'pedido',
          include: [
            { model: Cliente, as: 'cliente' },
            { model: Vendedor, as: 'vendedor' }
          ]
        },
        {
          model: Produto,
          as: 'produto'
        }
      ]
    });
  }

  async getItemPedidoById(id) {
    return await ItemPedido.findByPk(id, {
      include: [
        {
          model: Pedido,
          as: 'pedido',
          include: [
            { model: Cliente, as: 'cliente' },
            { model: Vendedor, as: 'vendedor' }
          ]
        },
        {
          model: Produto,
          as: 'produto'
        }
      ]
    });
  }

  async createItemPedido(data) {
    // Se receber pedido_numero/produto_nome, converter para IDs
    const processedData = { ...data };
    
    if (data.pedido_numero && !data.id_pedido) {
      const pedido = await Pedido.findOne({ where: { id: data.pedido_numero } });
      if (!pedido) throw new Error('Pedido não encontrado');
      processedData.id_pedido = pedido.id;
      delete processedData.pedido_numero;
    }
    
    if (data.produto_nome && !data.id_produto) {
      const produto = await Produto.findOne({ where: { nome: data.produto_nome } });
      if (!produto) throw new Error('Produto não encontrado');
      processedData.id_produto = produto.id;
      // Se não informou preço unitário, usar o do produto
      if (!processedData.preco_unitario) {
        processedData.preco_unitario = produto.preco_unitario;
      }
      delete processedData.produto_nome;
    }
    
    return await ItemPedido.create(processedData);
  }
  async updateItemPedido(id, data) {
    const processedData = { ...data };
    
    // Se receber pedido_numero/produto_nome, converter para IDs
    if (data.pedido_numero && !data.id_pedido) {
      const pedido = await Pedido.findOne({ where: { id: data.pedido_numero } });
      if (!pedido) throw new Error('Pedido não encontrado');
      processedData.id_pedido = pedido.id;
      delete processedData.pedido_numero;
    }
    
    if (data.produto_nome && !data.id_produto) {
      const produto = await Produto.findOne({ where: { nome: data.produto_nome } });
      if (!produto) throw new Error('Produto não encontrado');
      processedData.id_produto = produto.id;
      delete processedData.produto_nome;
    }
    
    const itemPedido = await ItemPedido.findByPk(id);
    if (itemPedido) {
      return await itemPedido.update(processedData);
    }
    return null;
  }

  async deleteItemPedido(id) {
    const itemPedido = await ItemPedido.findByPk(id);
    if (itemPedido) {
      await itemPedido.destroy();
      return true;
    }
    return false;
  }

  // Métodos auxiliares para o frontend
  async getAvailablePedidos() {
    return await Pedido.findAll({
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Vendedor, as: 'vendedor' }
      ],
      order: [['data_pedido', 'DESC']]
    });
  }  async getAvailableProdutos() {
    return await Produto.findAll({
      where: {
        estoque: {
          [Op.gt]: 0
        }
      },
      order: ['nome']
    });
  }
}

module.exports = new ItemPedidoService();
