const pedidoService = require('../services/pedidoService');

class PedidoController {
  async getAll(req, res) {
    try {
      const pedidos = await pedidoService.getAllPedidos();
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch pedidos', details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const pedido = await pedidoService.getPedidoById(req.params.id);
      if (pedido) {
        res.json(pedido);
      } else {
        res.status(404).json({ error: 'Pedido not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch pedido', details: error.message });
    }
  }
  async create(req, res) {
    try {
      const pedido = await pedidoService.createPedido(req.body);
      res.status(201).json(pedido);
    } catch (error) {
      console.error('Error creating Pedido:', error);
      res.status(500).json({ error: 'Failed to create pedido', details: error.message });
    }
  }

  async update(req, res) {    try {
      const pedido = await pedidoService.updatePedido(req.params.id, req.body);
      if (pedido) {
        res.json(pedido);
      } else {
        res.status(404).json({ error: 'Pedido not found' });
      }
    } catch (error) {
      console.error('Error updating Pedido:', error);
      res.status(500).json({ error: 'Failed to update pedido', details: error.message });
    }
  }

  async delete(req, res) {    try {
      const success = await pedidoService.deletePedido(req.params.id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Pedido not found' });
      }
    } catch (error) {
      console.error('Error deleting Pedido:', error);
      res.status(500).json({ error: 'Failed to delete pedido', details: error.message });
    }
  }

  // Novos métodos para facilitar o frontend
  async getAvailableClientes(req, res) {
    try {
      const clientes = await pedidoService.getAvailableClientes();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch clientes', details: error.message });
    }
  }

  async getAvailableVendedores(req, res) {
    try {
      const vendedores = await pedidoService.getAvailableVendedores();
      res.json(vendedores);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch vendedores', details: error.message });
    }
  }
}

module.exports = new PedidoController();
