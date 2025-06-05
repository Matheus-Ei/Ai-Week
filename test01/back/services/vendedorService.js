const Vendedor = require('../models/vendedor');

class VendedorService {
  async getAllVendedores() {
    return await Vendedor.findAll();
  }

  async getVendedorById(id) {
    return await Vendedor.findByPk(id);
  }

  async createVendedor(data) {
    return await Vendedor.create(data);
  }

  async updateVendedor(id, data) {
    const vendedor = await Vendedor.findByPk(id);
    if (vendedor) {
      return await vendedor.update(data);
    }
    return null;
  }

  async deleteVendedor(id) {
    const vendedor = await Vendedor.findByPk(id);
    if (vendedor) {
      await vendedor.destroy();
      return true;
    }
    return false;
  }
}

module.exports = new VendedorService();
