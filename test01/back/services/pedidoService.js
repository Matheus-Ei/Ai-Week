const Pedido = require('../models/pedido');
const Cliente = require('../models/cliente');
const Vendedor = require('../models/vendedor');

class PedidoService {
  async getAllPedidos() {
    return await Pedido.findAll({
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Vendedor, as: 'vendedor' }
      ]
    });
  }

  async getPedidoById(id) {
    return await Pedido.findByPk(id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Vendedor, as: 'vendedor' }
      ]
    });
  }
  async createPedido(data) {
    // Normalizar os nomes dos campos para o padrão do banco
    const processedData = { ...data };
    
    // Aceitar tanto cliente_id quanto id_cliente
    if (data.cliente_id && !data.id_cliente) {
      processedData.id_cliente = data.cliente_id;
      delete processedData.cliente_id;
    }
    
    // Aceitar tanto vendedor_id quanto id_vendedor
    if (data.vendedor_id && !data.id_vendedor) {
      processedData.id_vendedor = data.vendedor_id;
      delete processedData.vendedor_id;
    }
    
    // Se receber cliente_nome/vendedor_nome, converter para IDs
    if (data.cliente_nome && !processedData.id_cliente) {
      const cliente = await Cliente.findOne({ where: { nome: data.cliente_nome } });
      if (!cliente) throw new Error('Cliente não encontrado');
      processedData.id_cliente = cliente.id;
      delete processedData.cliente_nome;
    }
    
    if (data.vendedor_nome && !processedData.id_vendedor) {
      const vendedor = await Vendedor.findOne({ where: { nome: data.vendedor_nome } });
      if (!vendedor) throw new Error('Vendedor não encontrado');
      processedData.id_vendedor = vendedor.id;
      delete processedData.vendedor_nome;
    }
    
    return await Pedido.create(processedData);
  }
  async updatePedido(id, data) {
    const processedData = { ...data };
    
    // Normalizar os nomes dos campos para o padrão do banco
    // Aceitar tanto cliente_id quanto id_cliente
    if (data.cliente_id && !data.id_cliente) {
      processedData.id_cliente = data.cliente_id;
      delete processedData.cliente_id;
    }
    
    // Aceitar tanto vendedor_id quanto id_vendedor
    if (data.vendedor_id && !data.id_vendedor) {
      processedData.id_vendedor = data.vendedor_id;
      delete processedData.vendedor_id;
    }
    
    // Se receber cliente_nome/vendedor_nome, converter para IDs
    if (data.cliente_nome && !processedData.id_cliente) {
      const cliente = await Cliente.findOne({ where: { nome: data.cliente_nome } });
      if (!cliente) throw new Error('Cliente não encontrado');
      processedData.id_cliente = cliente.id;
      delete processedData.cliente_nome;
    }
    
    if (data.vendedor_nome && !processedData.id_vendedor) {
      const vendedor = await Vendedor.findOne({ where: { nome: data.vendedor_nome } });
      if (!vendedor) throw new Error('Vendedor não encontrado');
      processedData.id_vendedor = vendedor.id;
      delete processedData.vendedor_nome;
    }
    
    const pedido = await Pedido.findByPk(id);
    if (pedido) {
      return await pedido.update(processedData);
    }
    return null;
  }

  async deletePedido(id) {
    const pedido = await Pedido.findByPk(id);
    if (pedido) {
      await pedido.destroy();
      return true;
    }
    return false;
  }

  // Métodos auxiliares para o frontend
  async getAvailableClientes() {
    return await Cliente.findAll({
      order: ['nome']
    });
  }

  async getAvailableVendedores() {
    return await Vendedor.findAll({
      order: ['nome']
    });
  }
}

module.exports = new PedidoService();
