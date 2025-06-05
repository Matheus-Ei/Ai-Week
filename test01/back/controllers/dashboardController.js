const { Cliente, Vendedor, Pedido, Produto, ItemPedido } = require('../models/associations');
const { Op, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const dashboardController = {  // Obter estatísticas gerais
  async getStats(req, res) {
    try {
      const [
        totalClientes,
        totalVendedores,
        totalProdutos,
        totalPedidos,
        totalItens
      ] = await Promise.all([
        Cliente.count(),
        Vendedor.count(),
        Produto.count(),
        Pedido.count(),
        ItemPedido.count()
      ]);

      // Valor total de vendas
      const vendas = await ItemPedido.findOne({
        attributes: [
          [Sequelize.fn('SUM', Sequelize.literal('quantidade * preco_unitario')), 'total']
        ]
      });

      res.json({
        totalClientes,
        totalVendedores,
        totalProdutos,
        totalPedidos,
        totalItens,
        valorTotalVendas: vendas?.dataValues?.total || 0
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },  // Vendas por período
  async getVendasPorPeriodo(req, res) {
    try {
      const { periodo = '30' } = req.query;
      const diasAtras = parseInt(periodo);
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - diasAtras);

      const vendas = await sequelize.query(`
        SELECT 
          DATE(p.data_pedido) as data,
          COUNT(DISTINCT p.id) as quantidade_pedidos,
          SUM(ip.quantidade * ip.preco_unitario) as valor_total
        FROM pedido p
        LEFT JOIN item_pedido ip ON p.id = ip.id_pedido
        WHERE p.data_pedido >= :dataLimite
        GROUP BY DATE(p.data_pedido)
        ORDER BY DATE(p.data_pedido) ASC
      `, {
        replacements: { dataLimite },
        type: Sequelize.QueryTypes.SELECT
      });

      res.json(vendas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },  // Top produtos mais vendidos
  async getTopProdutos(req, res) {
    try {
      const { limit = 10 } = req.query;

      const produtos = await sequelize.query(`
        SELECT 
          p.id,
          p.nome,
          p.preco_unitario,
          SUM(ip.quantidade) as total_vendido,
          SUM(ip.quantidade * ip.preco_unitario) as receita_total
        FROM produto p
        LEFT JOIN item_pedido ip ON p.id = ip.id_produto
        GROUP BY p.id, p.nome, p.preco_unitario
        ORDER BY SUM(ip.quantidade) DESC
        LIMIT :limit
      `, {
        replacements: { limit: parseInt(limit) },
        type: Sequelize.QueryTypes.SELECT
      });

      res.json(produtos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Top vendedores
  async getTopVendedores(req, res) {
    try {
      const { limit = 10 } = req.query;

      const vendedores = await sequelize.query(`
        SELECT 
          v.id,
          v.nome,
          v.regiao,
          COUNT(p.id) as total_pedidos,
          SUM(ip.quantidade * ip.preco_unitario) as receita_total
        FROM vendedor v
        LEFT JOIN pedido p ON v.id = p.id_vendedor
        LEFT JOIN item_pedido ip ON p.id = ip.id_pedido
        GROUP BY v.id, v.nome, v.regiao
        ORDER BY SUM(ip.quantidade * ip.preco_unitario) DESC
        LIMIT :limit
      `, {
        replacements: { limit: parseInt(limit) },
        type: Sequelize.QueryTypes.SELECT
      });

      res.json(vendedores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Análise de clientes
  async getAnaliseClientes(req, res) {
    try {
      const clientes = await sequelize.query(`
        SELECT 
          c.id,
          c.nome,
          c.email,
          c.cidade,
          COUNT(p.id) as total_pedidos,
          SUM(ip.quantidade * ip.preco_unitario) as valor_total_compras,
          AVG(ip.quantidade * ip.preco_unitario) as ticket_medio
        FROM cliente c
        LEFT JOIN pedido p ON c.id = p.id_cliente
        LEFT JOIN item_pedido ip ON p.id = ip.id_pedido
        GROUP BY c.id, c.nome, c.email, c.cidade
        ORDER BY SUM(ip.quantidade * ip.preco_unitario) DESC
      `, {
        type: Sequelize.QueryTypes.SELECT
      });

      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Distribuição por cidade
  async getDistribuicaoCidades(req, res) {
    try {
      const cidades = await Cliente.findAll({
        attributes: [
          'cidade',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'total_clientes']
        ],
        group: ['cidade'],
        order: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'DESC']]
      });

      res.json(cidades);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Análise de estoque (produtos com baixo estoque)
  async getAnaliseEstoque(req, res) {
    try {
      const produtos = await Produto.findAll({
        where: {
          estoque: {
            [Op.lte]: 10 // Produtos com estoque <= 10
          }
        },
        order: [['estoque', 'ASC']]
      });

      res.json(produtos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },  // Evolução mensal de vendas
  async getEvolucaoMensal(req, res) {
    try {
      const evolucao = await sequelize.query(`
        SELECT 
          EXTRACT(YEAR FROM p.data_pedido) as ano,
          EXTRACT(MONTH FROM p.data_pedido) as mes,
          COUNT(p.id) as total_pedidos,
          SUM(ip.quantidade * ip.preco_unitario) as receita
        FROM pedido p
        LEFT JOIN item_pedido ip ON p.id = ip.id_pedido
        GROUP BY EXTRACT(YEAR FROM p.data_pedido), EXTRACT(MONTH FROM p.data_pedido)
        ORDER BY EXTRACT(YEAR FROM p.data_pedido) ASC, EXTRACT(MONTH FROM p.data_pedido) ASC
      `, {
        type: Sequelize.QueryTypes.SELECT
      });

      res.json(evolucao);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = dashboardController;
