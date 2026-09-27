const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('Successfully connected to SQLite dev.db. Users count:', users.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
