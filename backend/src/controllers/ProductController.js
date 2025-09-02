const ProductService = require('../services/ProductService');
const StockService = require('../services/StockService');

class ProductController {
  constructor() {
    this.productService = new ProductService();
    this.stockService = new StockService();
  }

  async create(req, res, next) {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json({
        success: true,
        data: product,
        message: 'Produto criado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const product = await this.productService.getProduct(req.params.id);
      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const products = await this.productService.getAllProducts(req.query);
      res.json({
        success: true,
        data: products,
        count: products.length,
        pagination: {
          page: parseInt(req.query.page) || 1,
          limit: parseInt(req.query.limit) || 20
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const product = await this.productService.updateProduct(req.params.id, req.body);
      res.json({
        success: true,
        data: product,
        message: 'Produto atualizado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await this.productService.deleteProduct(req.params.id);
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  async getLowStock(req, res, next) {
    try {
      const products = await this.productService.getLowStockProducts();
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
      const stockValue = await this.productService.getStockValue();
      res.json({
        success: true,
        data: stockValue
      });
    } catch (error) {
      next(error);
    }
  }

  async search(req, res, next) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Parâmetro de busca (q) é obrigatório'
        });
      }

      const products = await this.productService.searchProducts(q);
      res.json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();