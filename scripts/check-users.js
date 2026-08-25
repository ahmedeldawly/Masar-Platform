const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const count = await prisma.user.count();
    const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, fullName: true }, take: 20 });
    console.log('User count:', count);
    console.log(users);
  } catch (e) {
    console.error('Error checking users:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
