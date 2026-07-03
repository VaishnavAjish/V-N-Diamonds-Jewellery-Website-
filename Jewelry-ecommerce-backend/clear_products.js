const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: 'postgresql://postgres:postgres@localhost:5433/Harene' } }
});

async function main() {
  const result = await prisma.product.deleteMany({});
  console.log('Deleted', result.count, 'products successfully.');
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
