const express = require('express');
const pedidoController = require('../controllers/pedidoController');

const router = express.Router();

// Rotas para buscar dados auxiliares
router.get('/clientes-disponiveis', pedidoController.getAvailableClientes);
router.get('/vendedores-disponiveis', pedidoController.getAvailableVendedores);

// Rotas CRUD padrão
router.get('/', pedidoController.getAll);
router.get('/:id', pedidoController.getById);
router.post('/', pedidoController.create);
router.put('/:id', pedidoController.update);
router.delete('/:id', pedidoController.delete);

module.exports = router;
