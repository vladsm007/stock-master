const express = require('express');
const ProductController = require('../controllers/ProductController');
const router = express.Router();

// Rota de teste
router.get('/test', (req, res) => {
  res.json({ message: 'Rota de produtos funcionando!' });
});

// Rotas básicas CRUD
router.post('/', ProductController.create.bind(ProductController));
router.get('/', ProductController.getAll.bind(ProductController));
router.get('/search', ProductController.search.bind(ProductController));
router.get('/low-stock', ProductController.getLowStock.bind(ProductController));
router.get('/stock-value', ProductController.getStockValue.bind(ProductController));
router.get('/:id', ProductController.getById.bind(ProductController));
router.put('/:id', ProductController.update.bind(ProductController));
router.delete('/:id', ProductController.delete.bind(ProductController));

module.exports = router;    