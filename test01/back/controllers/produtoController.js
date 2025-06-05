const produtoService = require('../services/produtoService');

class ProdutoController {
  async getAll(req, res) {
    try {
      const produtos = await produtoService.getAllProdutos();
      res.json(produtos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch produtos', details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const produto = await produtoService.getProdutoById(req.params.id);
      if (produto) {
        res.json(produto);
      } else {
        res.status(404).json({ error: 'Produto not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch produto', details: error.message });
    }
  }

  async create(req, res) {
    try {
      const produto = await produtoService.createProduto(req.body);
      res.status(201).json(produto);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create produto', details: error.message });
    }
  }

  async update(req, res) {
    try {
      const produto = await produtoService.updateProduto(req.params.id, req.body);
      if (produto) {
        res.json(produto);
      } else {
        res.status(404).json({ error: 'Produto not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update produto', details: error.message });
    }
  }

  async delete(req, res) {
    try {
      const success = await produtoService.deleteProduto(req.params.id);      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Produto not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete produto', details: error.message });
    }
  }
}

module.exports = new ProdutoController();
