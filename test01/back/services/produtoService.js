const Produto = require('../models/produto');

class ProdutoService {
  async getAllProdutos() {
    return await Produto.findAll();
  }

  async getProdutoById(id) {
    return await Produto.findByPk(id);
  }

  async createProduto(data) {
    return await Produto.create(data);
  }

  async updateProduto(id, data) {
    const produto = await Produto.findByPk(id);
    if (produto) {
      return await produto.update(data);
    }
    return null;
  }

  async deleteProduto(id) {
    const produto = await Produto.findByPk(id);
    if (produto) {
      await produto.destroy();
      return true;
    }
    return false;
  }
}

module.exports = new ProdutoService();
