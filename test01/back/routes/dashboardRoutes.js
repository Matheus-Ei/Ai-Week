const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Estatísticas gerais
router.get('/stats', dashboardController.getStats);

// Vendas por período
router.get('/vendas-periodo', dashboardController.getVendasPorPeriodo);

// Top produtos
router.get('/top-produtos', dashboardController.getTopProdutos);

// Top vendedores
router.get('/top-vendedores', dashboardController.getTopVendedores);

// Análise de clientes
router.get('/analise-clientes', dashboardController.getAnaliseClientes);

// Distribuição por cidades
router.get('/distribuicao-cidades', dashboardController.getDistribuicaoCidades);

// Análise de estoque
router.get('/analise-estoque', dashboardController.getAnaliseEstoque);

// Evolução mensal
router.get('/evolucao-mensal', dashboardController.getEvolucaoMensal);

module.exports = router;
