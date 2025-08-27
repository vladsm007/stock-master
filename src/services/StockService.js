const ProductRepository = require('../repositories/ProductRepository');
const StockMovementRepository = require('../repositories/StockMovementRepository');
const database = require('../config/database'); // Import corrigido

class StockService {
  constructor() {
    this.productRepository = new ProductRepository();
    this.stockMovementRepository = new StockMovementRepository();
  }

  async updateStock(productId, quantity, type, userId, reason = null, reference = null, unitCost = null) {
    // Iniciar transação
    return await database.getClient().$transaction(async (prisma) => {
      // Buscar produto atual
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product) {
        throw new Error('Produto não encontrado');
      }

      const previousStock = product.currentStock;
      let newStock;

      // Calcular novo estoque baseado no tipo de movimentação
      switch (type) {
        case 'IN':
        case 'RETURN':
          newStock = previousStock + quantity;
          break;
        case 'OUT':
        case 'LOSS':
          newStock = previousStock - quantity;
          if (newStock < 0) {
            throw new Error('Estoque insuficiente');
          }
          break;
        case 'ADJUSTMENT':
          newStock = quantity;
          break;
        case 'TRANSFER':
          // Para transferências, a quantidade pode ser positiva (entrada) ou negativa (saída)
          newStock = previousStock + quantity;
          if (newStock < 0) {
            throw new Error('Estoque insuficiente para transferência');
          }
          break;
        default:
          throw new Error('Tipo de movimentação inválido');
      }

      // Atualizar estoque do produto
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { 
          currentStock: newStock,
          updatedAt: new Date()
        },
        include: {
          category: true,
          supplier: true
        }
      });

      // Registrar movimentação
      const movement = await prisma.stockMovement.create({
        data: {
          type,
          quantity: Math.abs(quantity),
          previousStock,
          newStock,
          reason,
          reference,
          unitCost: unitCost ? parseFloat(unitCost) : null,
          productId,
          userId
        },
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      });

      return {
        product: updatedProduct,
        movement: movement
      };
    });
  }

  async getStockHistory(productId, limit = 50) {
    return await this.stockMovementRepository.findByProductId(productId, limit);
  }

  async getStockReport(filters = {}) {
    const movements = await this.stockMovementRepository.findAll(filters);
    const summary = await this.stockMovementRepository.getMovementsSummary(
      filters.productId, 
      filters.startDate, 
      filters.endDate
    );

    return {
      movements,
      summary
    };
  }

  async getLowStockAlert() {
    return await this.productRepository.getLowStockProducts();
  }

  async getStockValue() {
    return await this.productRepository.getStockValue();
  }

  // Método para entrada de estoque (compras)
  async stockIn(productId, quantity, userId, reference = null, unitCost = null) {
    return await this.updateStock(
      productId, 
      quantity, 
      'IN', 
      userId, 
      'Entrada de estoque', 
      reference, 
      unitCost
    );
  }

  // Método para saída de estoque (vendas)
  async stockOut(productId, quantity, userId, reference = null) {
    return await this.updateStock(
      productId, 
      quantity, 
      'OUT', 
      userId, 
      'Saída de estoque', 
      reference
    );
  }

  // Método para ajuste de estoque
  async stockAdjustment(productId, newQuantity, userId, reason) {
    return await this.updateStock(
      productId, 
      newQuantity, 
      'ADJUSTMENT', 
      userId, 
      reason
    );
  }
}

module.exports = StockService;