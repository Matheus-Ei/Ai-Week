const itemPedidoService = require('../services/itemPedidoService');

class ItemPedidoController {
  async getAll(req, res) {
    try {
      const itensPedido = await itemPedidoService.getAllItensPedido();
      res.json(itensPedido);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch itensPedido', details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const itemPedido = await itemPedidoService.getItemPedidoById(req.params.id);
      if (itemPedido) {
        res.json(itemPedido);
      } else {
        res.status(404).json({ error: 'ItemPedido not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch itemPedido', details: error.message });
    }
  }

  async create(req, res) {
    try {
      const itemPedido = await itemPedidoService.createItemPedido(req.body);
      res.status(201).json(itemPedido);
    } catch (error) {
      console.error('Error creating ItemPedido:', error);
      res.status(500).json({ error: 'Failed to create itemPedido', details: error.message });
    }
  }

  async update(req, res) {
    try {
      const itemPedido = await itemPedidoService.updateItemPedido(req.params.id, req.body);
      if (itemPedido) {
        res.json(itemPedido);
      } else {
        res.status(404).json({ error: 'ItemPedido not found' });
      }
    } catch (error) {
      console.error('Error updating ItemPedido:', error);
      res.status(500).json({ error: 'Failed to update itemPedido', details: error.message });
    }
  }

  async delete(req, res) {
    try {
      const success = await itemPedidoService.deleteItemPedido(req.params.id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'ItemPedido not found' });
      }
    } catch (error) {
      console.error('Error deleting ItemPedido:', error);
      res.status(500).json({ error: 'Failed to delete itemPedido', details: error.message });
    }
  }

  // Novos métodos para facilitar o frontend
  async getAvailablePedidos(req, res) {
    try {
      const pedidos = await itemPedidoService.getAvailablePedidos();
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch pedidos', details: error.message });
    }
  }

  async getAvailableProdutos(req, res) {
    try {
      const produtos = await itemPedidoService.getAvailableProdutos();
      res.json(produtos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch produtos', details: error.message });
    }
  }
}

module.exports = new ItemPedidoController();
