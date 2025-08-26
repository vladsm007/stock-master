const express = require('express');
const StockController = require('../controllers/StockController');
const router = express.Router();

// Rotas para movimentações de estoque
router.post('/update/:productId', StockController.updateStock);
router.post('/in/:productId', StockController.stockIn);
router.post('/out/:productId', StockController.stockOut);
router.post('/adjustment/:productId', StockController.adjustment);

// Rotas para consultas
router.get('/history/:productId', StockController.getHistory);
router.get('/report', StockController.getReport);
router.get('/alerts', StockController.getLowStockAlert);
router.get('/value', StockController.getStockValue);

module.exports = router;