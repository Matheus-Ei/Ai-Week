const express = require('express');
const itemPedidoController = require('../controllers/itemPedidoController');

const router = express.Router();

// Rotas para buscar dados auxiliares
router.get('/pedidos-disponiveis', itemPedidoController.getAvailablePedidos);
router.get('/produtos-disponiveis', itemPedidoController.getAvailableProdutos);

// Rotas CRUD padrão
router.get('/', itemPedidoController.getAll);
router.get('/:id', itemPedidoController.getById);
router.post('/', itemPedidoController.create);
router.put('/:id', itemPedidoController.update);
router.delete('/:id', itemPedidoController.delete);

module.exports = router;
