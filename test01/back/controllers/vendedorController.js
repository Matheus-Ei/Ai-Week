const vendedorService = require('../services/vendedorService');

class VendedorController {
  async getAll(req, res) {
    try {
      const vendedores = await vendedorService.getAllVendedores();
      res.json(vendedores);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch vendedores', details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const vendedor = await vendedorService.getVendedorById(req.params.id);
      if (vendedor) {
        res.json(vendedor);
      } else {
        res.status(404).json({ error: 'Vendedor not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch vendedor', details: error.message });
    }
  }

  async create(req, res) {
    try {
      const vendedor = await vendedorService.createVendedor(req.body);
      res.status(201).json(vendedor);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create vendedor', details: error.message });
    }
  }

  async update(req, res) {
    try {
      const vendedor = await vendedorService.updateVendedor(req.params.id, req.body);
      if (vendedor) {
        res.json(vendedor);
      } else {
        res.status(404).json({ error: 'Vendedor not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update vendedor', details: error.message });
    }
  }

  async delete(req, res) {
    try {
      const success = await vendedorService.deleteVendedor(req.params.id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Vendedor not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete vendedor', details: error.message });
    }
  }
}

module.exports = new VendedorController();
