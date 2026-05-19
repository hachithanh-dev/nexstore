const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log("Products:", products);
  const users = await prisma.user.findMany();
  console.log("Users:", users);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
