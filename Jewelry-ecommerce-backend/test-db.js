const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admins = await prisma.admin.findMany();
  console.log('Admins:', admins);
  
  const users = await prisma.user.findMany();
  console.log('Users:', users);
}

main()
  .catch(console.log)
  .finally(() => prisma.$disconnect());
