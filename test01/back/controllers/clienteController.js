const clienteService = require('../services/clienteService');

class ClienteController {
  async getAll(req, res) {
    try {
      const clientes = await clienteService.getAllClientes();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch clientes', details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const cliente = await clienteService.getClienteById(req.params.id);
      if (cliente) {
        res.json(cliente);
      } else {
        res.status(404).json({ error: 'Cliente not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cliente', details: error.message });
    }
  }

  async create(req, res) {
    try {
      const cliente = await clienteService.createCliente(req.body);
      res.status(201).json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create cliente', details: error.message });
    }
  }

  async update(req, res) {
    try {
      const cliente = await clienteService.updateCliente(req.params.id, req.body);
      if (cliente) {
        res.json(cliente);
      } else {
        res.status(404).json({ error: 'Cliente not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update cliente', details: error.message });
    }
  }

  async delete(req, res) {
    try {
      const success = await clienteService.deleteCliente(req.params.id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Cliente not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete cliente', details: error.message });
    }
  }
}

module.exports = new ClienteController();
