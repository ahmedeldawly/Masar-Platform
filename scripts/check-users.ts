import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.user.count();
  const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, fullName: true }, take: 20 });
  console.log('User count:', count);
  console.log(users);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
