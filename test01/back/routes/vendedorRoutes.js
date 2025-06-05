const express = require('express');
const vendedorController = require('../controllers/vendedorController');

const router = express.Router();

router.get('/', vendedorController.getAll);
router.get('/:id', vendedorController.getById);
router.post('/', vendedorController.create);
router.put('/:id', vendedorController.update);
router.delete('/:id', vendedorController.delete);

module.exports = router;
