const database = require('../config/database');

class CategoryController {
  constructor() {
    this.prisma = database.getClient();
  }

  async create(req, res, next) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'Nome da categoria é obrigatório'
        });
      }

      const category = await this.prisma.category.create({
        data: { name, description }
      });

      res.status(201).json({
        success: true,
        data: category,
        message: 'Categoria criada com sucesso'
      });
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'Categoria já existe'
        });
      }
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const categories = await this.prisma.category.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: { products: true }
          }
        },
        orderBy: { name: 'asc' }
      });

      res.json({
        success: true,
        data: categories,
        count: categories.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: req.params.id },
        include: {
          products: {
            where: { isActive: true },
            take: 10
          },
          _count: {
            select: { products: true }
          }
        }
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Categoria não encontrada'
        });
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { name, description } = req.body;

      const category = await this.prisma.category.update({
        where: { id: req.params.id },
        data: { 
          name, 
          description,
          updatedAt: new Date()
        }
      });

      res.json({
        success: true,
        data: category,
        message: 'Categoria atualizada com sucesso'
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          error: 'Categoria não encontrada'
        });
      }
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'Nome da categoria já existe'
        });
      }
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      // Verificar se há produtos na categoria
      const productsCount = await this.prisma.product.count({
        where: { 
          categoryId: req.params.id,
          isActive: true 
        }
      });

      if (productsCount > 0) {
        return res.status(400).json({
          success: false,
          error: 'Não é possível deletar categoria com produtos associados'
        });
      }

      // Soft delete
      await this.prisma.category.update({
        where: { id: req.params.id },
        data: { isActive: false }
      });

      res.json({
        success: true,
        message: 'Categoria deletada com sucesso'
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          error: 'Categoria não encontrada'
        });
      }
      next(error);
    }
  }
}

module.exports = new CategoryController();