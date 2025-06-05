const Cliente = require('../models/cliente');

class ClienteService {
  async getAllClientes() {
    return await Cliente.findAll();
  }

  async getClienteById(id) {
    return await Cliente.findByPk(id);
  }

  async createCliente(data) {
    return await Cliente.create(data);
  }

  async updateCliente(id, data) {
    const cliente = await Cliente.findByPk(id);
    if (cliente) {
      return await cliente.update(data);
    }
    return null;
  }

  async deleteCliente(id) {
    const cliente = await Cliente.findByPk(id);
    if (cliente) {
      await cliente.destroy();
      return true;
    }
    return false;
  }
}

module.exports = new ClienteService();
