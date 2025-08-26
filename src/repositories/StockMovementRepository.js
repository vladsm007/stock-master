const IStockMovementRepository = require('../interfaces/IStockMovementRepository')
const database = require('../config/database')

class StockMovementRepository extends IStockMovementRepository {
  constructor() {
    super();
    this.prisma = database.getClient();
  }

  async create(movementData) {
    return await this.prisma.stockMovement.create({
      data: {
        ...movementData,
        unitCost: movementData.unitCost ? parseFloat(movementData.unitCost) : null
      },
      include: {
        product: true,
        user: {
          select: { name: true, email: true }
        }
      }
    });
  }

  async findByProductId(productId, limit = 50) {
    return await this.prisma.stockMovement.findMany({
      where: { productId },
      include: {
        product: {
          select: { name: true, sku: true }
        },
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  async findAll(filters = {}) {
    const where = {};
    
    if (filters.productId) where.productId = filters.productId;
    if (filters.userId) where.userId = filters.userId;
    if (filters.type) where.type = filters.type;
    if (filters.startDate && filters.endDate) {
      where.createdAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate)
      };
    }

    return await this.prisma.stockMovement.findMany({
      where,
      include: {
        product: {
          select: { name: true, sku: true }
        },
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: filters.skip,
      take: filters.take
    });
  }

  async getMovementsSummary(productId, startDate, endDate) {
    const where = { productId };
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const movements = await this.prisma.stockMovement.groupBy({
      by: ['type'],
      where,
      _sum: {
        quantity: true
      },
      _count: {
        id: true
      }
    });

    return movements.reduce((summary, movement) => {
      summary[movement.type] = {
        totalQuantity: movement._sum.quantity,
        totalMovements: movement._count.id
      };
      return summary;
    }, {});
  }
}

module.exports = StockMovementRepository;