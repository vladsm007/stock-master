const { PrismaClient } = require('@prisma/client');

class DatabaseConnection {
  constructor() {
    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      errorFormat: 'pretty'
    });
  }

  async connect() {
    try{
        await this.prisma.$connect()
        console.log('Conectado ao banco de dados')
    }catch (error) {
        console.error('Erro ao conectar ao banco:', error)
        throw error
        }
  }

  async disconnect() {
    await this.prisma.$disconnect()
    console.log('Desconectado do banco de dados')
  }

  getClient() {
    return this.prisma
  }

  async healthCheck() {
    try {
        await this.prisma.$queryRaw`SELECT 1`
        return { status: 'healthy', timestamp: new Date() }
    }catch(error) {
        return { status: 'unhealthy', error: error.message, timestamp: new Date() };
    }
  }

}

module.exports = new DatabaseConnection()
