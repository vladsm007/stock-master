const ProductRepository = require('../repositories/ProductRepository');
const { validateProduct, validateProductUpdate } = require('../utils/validators');

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(productData) {
    const { error, value } = validateProduct(productData);
    if (error) {
      throw new Error(`Dados inválidos: ${error.details[0].message}`);
    }

    // Verificar se SKU já existe
    const existingProduct = await this.productRepository.findBySku(value.sku);
    if (existingProduct) {
      throw new Error('SKU já existe no sistema');
    }

    return await this.productRepository.create(value);
  }

  async getProduct(id) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Produto não encontrado');
    }
    return product;
  }

  async getAllProducts(filters = {}) {
    // Preparar filtros para paginação
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const productFilters = {
      ...filters,
      skip,
      take: limit
    };

    return await this.productRepository.findAll(productFilters);
  }

  async updateProduct(id, updateData) {
    const { error, value } = validateProductUpdate(updateData);
    if (error) {
      throw new Error(`Dados inválidos: ${error.details[0].message}`);
    }

    // Se SKU foi alterado, verificar se não existe
    if (value.sku) {
      const existingProduct = await this.productRepository.findBySku(value.sku);
      if (existingProduct && existingProduct.id !== id) {
        throw new Error('SKU já existe no sistema');
      }
    }

    const product = await this.productRepository.update(id, value);
    if (!product) {
      throw new Error('Produto não encontrado');
    }
    return product;
  }

  async deleteProduct(id) {
    const success = await this.productRepository.delete(id);
    if (!success) {
      throw new Error('Produto não encontrado');
    }
    return { message: 'Produto deletado com sucesso' };
  }

  async getLowStockProducts() {
    return await this.productRepository.getLowStockProducts();
  }

  async getStockValue() {
    return await this.productRepository.getStockValue();
  }

  async searchProducts(searchTerm) {
    return await this.productRepository.findAll({ search: searchTerm });
  }
}

module.exports = ProductService;