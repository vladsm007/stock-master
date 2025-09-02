const express = require('express');
const StockController = require('../controllers/StockController');
const router = express.Router();

// Rota de teste
router.get('/test', (req, res) => {
  res.json({ message: 'Rota de produtos funcionando!' });
});

// Rotas para movimentações de estoque
router.post('/update/:productId', StockController.updateStock.bind(StockController));
router.post('/in/:productId', StockController.stockIn.bind(StockController));
router.post('/out/:productId', StockController.stockOut.bind(StockController));
router.post('/adjustment/:productId', StockController.adjustment.bind(StockController));

// Rotas para consultas
router.get('/history/:productId', StockController.getHistory.bind(StockController));
router.get('/report', StockController.getReport.bind(StockController));
router.get('/alerts', StockController.getLowStockAlert.bind(StockController));
router.get('/value', StockController.getStockValue.bind(StockController));

module.exports = router;