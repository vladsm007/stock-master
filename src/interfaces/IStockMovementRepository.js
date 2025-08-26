class IStockMovementRepository {
 async create(movementData) {
    throw new Error('Method create must be implemented');
  }

  async findByProductId(productId, limit = 50) {
    throw new Error('Method findByProductId must be implemented');
  }

  async findAll(filters = {}) {
    throw new Error('Method findAll must be implemented');
  }

  async getMovementsSummary(productId, startDate, endDate) {
    throw new Error('Method getMovementsSummary must be implemented');
  }
}

module.exports = IStockMovementRepository;