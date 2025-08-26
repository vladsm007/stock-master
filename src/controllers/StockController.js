const StockService = require('../services/StockService');

class StockController {
  constructor() {
    this.stockService = new StockService();
  }

  async updateStock(req, res, next) {
    try {
      const { productId } = req.params;
      const { quantity, type, reason, reference, unitCost } = req.body;
      const userId = req.user?.id || 'system'; // Temporário até implementar auth

      if (!quantity || !type) {
        return res.status(400).json({
          success: false,
          error: 'Quantidade e tipo são obrigatórios'
        });
      }

      const result = await this.stockService.updateStock(
        productId,
        parseInt(quantity),
        type,
        userId,
        reason,
        reference,
        unitCost
      );

      res.json({
        success: true,
        data: result,
        message: 'Estoque atualizado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async stockIn(req, res, next) {
    try {
      const { productId } = req.params;
      const { quantity, reference, unitCost } = req.body;
      const userId = req.user?.id || 'system';

      const result = await this.stockService.stockIn(
        productId,
        parseInt(quantity),
        userId,
        reference,
        unitCost
      );

      res.json({
        success: true,
        data: result,
        message: 'Entrada de estoque realizada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async stockOut(req, res, next) {
    try {
      const { productId } = req.params;
      const { quantity, reference } = req.body;
      const userId = req.user?.id || 'system';

      const result = await this.stockService.stockOut(
        productId,
        parseInt(quantity),
        userId,
        reference
      );

      res.json({
        success: true,
        data: result,
        message: 'Saída de estoque realizada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async adjustment(req, res, next) {
    try {
      const { productId } = req.params;
      const { newQuantity, reason } = req.body;
      const userId = req.user?.id || 'system';

      const result = await this.stockService.stockAdjustment(
        productId,
        parseInt(newQuantity),
        userId,
        reason
      );

      res.json({
        success: true,
        data: result,
        message: 'Ajuste de estoque realizado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    try {
      const { productId } = req.params;
      const limit = parseInt(req.query.limit) || 50;

      const history = await this.stockService.getStockHistory(productId, limit);
      res.json({
        success: true,
        data: history,
        count: history.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getReport(req, res, next) {
    try {
      const filters = {
        productId: req.query.productId,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        type: req.query.type,
        skip: parseInt(req.query.skip) || 0,
        take: parseInt(req.query.take) || 100
      };

      const report = await this.stockService.getStockReport(filters);
      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      next(error);
    }
  }

  async getLowStockAlert(req, res, next) {
    try {
      const products = await this.stockService.getLowStockAlert();
      res.json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getStockValue(req, res, next) {
    try {
      const stockValue = await this.stockService.getStockValue();
      res.json({
        success: true,
        data: stockValue
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StockController();