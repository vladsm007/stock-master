const IProductRepository = require('../interfaces/IProductRepository');
const database = require('../config/database');

class ProductRepository extends IProductRepository {
    constructor() {
        super();
        this.prisma = database.getClient();
    }

    async create(productData) {
        try {
            const product = await this.prisma.product.create({
                data: {
                    ...productData,
                    price: parseFloat(productData.price),
                    cost: productData.cost ? parseFloat(productData.cost) : null,
                },
                include: {
                    category: true,
                    supplier: true, 
                },
            });
            return product;
        } catch(error) {
            if(error.code === 'P2002') {
                throw new Error('SKU ou código de barras já existe.');
            }
            throw error;
        }
    }

    async findById(id) {
        return await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                supplier: true,
                stockMovements: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    include: {
                        user: {
                            select: { name: true, email: true }
                        }
                    }
                }
            }
        });
    }

    async findAll(filters = {}) {
        const where = {};
        
        if (filters.categoryId) where.categoryId = filters.categoryId;
        if (filters.supplierId) where.supplierId = filters.supplierId;
        if (filters.isActive !== undefined) where.isActive = filters.isActive;
        
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { sku: { contains: filters.search, mode: 'insensitive' } },
                { barcode: { contains: filters.search, mode: 'insensitive' } }
            ];
        }

        const orderBy = {};
        if (filters.sortBy) {
            orderBy[filters.sortBy] = filters.sortOrder || 'asc';
        } else {
            orderBy.createdAt = 'desc';
        }

        return await this.prisma.product.findMany({
            where,
            include: {
                category: true,
                supplier: true
            },
            orderBy,
            skip: filters.skip,
            take: filters.take
        });
    }

    async findBySku(sku) {
        return await this.prisma.product.findUnique({
            where: { sku },
            include: {
                category: true,
                supplier: true
            }
        });
    }

    async update(id, updateData) {
        try {
            const product = await this.prisma.product.update({
                where: { id },
                data: {
                    ...updateData,
                    price: updateData.price ? parseFloat(updateData.price) : undefined,
                    cost: updateData.cost ? parseFloat(updateData.cost) : undefined,
                    updatedAt: new Date()
                },
                include: {
                    category: true,
                    supplier: true
                }
            });
            return product;
        } catch (error) {
            if (error.code === 'P2002') {
                throw new Error('SKU ou código de barras já existe');
            }
            if (error.code === 'P2025') {
                throw new Error('Produto não encontrado');
            }
            throw error;
        }
    }

    async delete(id) {
        try {
            // Soft delete
            await this.prisma.product.update({
                where: { id },
                data: { isActive: false }
            });
            return true;
        } catch (error) {
            if (error.code === 'P2025') {
                return false;
            }
            throw error;
        }
    }

    async updateStock(id, quantity) {
        return await this.prisma.product.update({
            where: { id },
            data: { 
                currentStock: quantity,
                updatedAt: new Date()
            }
        });
    }

    async getLowStockProducts() {
        // Como não temos campos minStock/maxStock na migração atual,
        // vamos considerar produtos com estoque baixo como <= 10
        return await this.prisma.product.findMany({
            where: {
                isActive: true,
                currentStock: {
                    lte: 10
                }
            },
            include: {
                category: true,
                supplier: true
            },
            orderBy: {
                currentStock: 'asc'
            }
        });
    }

    async getStockValue() {
        const result = await this.prisma.product.aggregate({
            where: { isActive: true },
            _sum: {
                currentStock: true
            }
        });
        
        const products = await this.prisma.product.findMany({
            where: { isActive: true },
            select: { currentStock: true, price: true }
        });

        const totalValue = products.reduce((sum, product) => {
            return sum + (product.currentStock * parseFloat(product.price));
        }, 0);

        return {
            totalItems: result._sum.currentStock || 0,
            totalValue: totalValue
        };
    }
}

module.exports = ProductRepository;