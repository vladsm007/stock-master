class IProductRepository {
    async create(productData) {
        throw new Error("O metodo criar deve ser implementado")
    }

    async findById(id) {
        throw new Error("O metodo buscar por id deve ser implementado")
    }

    async findAll() {
        throw new Error("O metodo buscar todos deve ser implementado")
    }

    async findBySku(sku) {
        throw new Error("O metodo buscar por sku deve ser implementado")
    }

    async update(id, productData) {
        throw new Error("O metodo atualizar deve ser implementado")
    }

    async delete(id) {
        throw new Error("O metodo deletar deve ser implementado")
    }

    async updateStock(id, quantity) {
        throw new Error("O metodo atualizar estoque deve ser implementado")
    }

    async getLowStockProducts() {
        throw new Error("O metodo buscar produtos com estoque baixo deve ser implementado")
    }
}

module.exports = IProductRepository;