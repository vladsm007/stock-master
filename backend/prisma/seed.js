const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@stockmanager.com' },
    update: {},
    create: {
      email: 'admin@stockmanager.com',
      name: 'Administrador',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  // Criar categorias
  const electronics = await prisma.category.upsert({
    where: { name: 'Eletrônicos' },
    update: {},
    create: {
      name: 'Eletrônicos',
      description: 'Produtos eletrônicos e tecnologia'
    }
  });

  const office = await prisma.category.upsert({
    where: { name: 'Escritório' },
    update: {},
    create: {
      name: 'Escritório',
      description: 'Material de escritório e papelaria'
    }
  });

  // Criar fornecedores
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'TechSupply Ltda',
      email: 'contato@techsupply.com',
      phone: '(11) 99999-9999',
      cnpj: '12.345.678/0001-90',
      address: 'Rua Falsa 121'
    }
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'Office Solutions',
      email: 'vendas@officesolutions.com',
      phone: '(11) 88888-8888',
      cnpj: '98.765.432/0001-10',
      address: 'Rua Não Existo 121'
    }
  });

  // Criar produtos de exemplo
  const products = [
    {
      name: 'Mouse Wireless',
      description: 'Mouse sem fio com tecnologia ótica',
      sku: 'MW001',
      barcode: '7891234567890',
      price: 59.90,
      cost: 35.00,
      minStock: 10,
      maxStock: 100,
      currentStock: 25,
      categoryId: electronics.id,
      supplierId: supplier1.id
    },
    {
      name: 'Teclado Mecânico',
      description: 'Teclado mecânico RGB para gaming',
      sku: 'TM001',
      barcode: '7891234567891',
      price: 299.90,
      cost: 180.00,
      minStock: 5,
      maxStock: 50,
      currentStock: 8,
      categoryId: electronics.id,
      supplierId: supplier1.id
    },
    {
      name: 'Papel A4 500 folhas',
      description: 'Resma de papel A4 branco 75g',
      sku: 'PA4001',
      barcode: '7891234567892',
      price: 24.90,
      cost: 18.00,
      minStock: 20,
      maxStock: 200,
      currentStock: 45,
      categoryId: office.id,
      supplierId: supplier2.id
    }
  ];

  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData
    });

    // Criar movimentação inicial
    await prisma.stockMovement.create({
      data: {
        type: 'IN',
        quantity: productData.currentStock,
        previousStock: 0,
        newStock: productData.currentStock,
        reason: 'Estoque inicial',
        reference: 'SEED-001',
        productId: product.id,
        userId: admin.id
      }
    });
  }

  console.log('✅ Seed concluído com sucesso!');
  console.log('👤 Admin criado: admin@stockmanager.com / admin123');
  console.log(`📦 ${products.length} produtos criados`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erro durante o seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });