const express = require('express');
const ProductController = require('../controllers/ProductController');
const router = express.Router();

// Rotas básicas CRUD
router.post('/', ProductController.create);
router.get('/', ProductController.getAll);
router.get('/search', ProductController.search);
router.get('/low-stock', ProductController.getLowStock);
router.get('/stock-value', ProductController.getStockValue);
router.get('/:id', ProductController.getById);
router.put('/:id', ProductController.update);
router.delete('/:id', ProductController.delete);

module.exports = router;