import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { email: 'test@example.com' },
    data: { balance: BigInt(50000000) } // $50.00
  });
  console.log('Updated user balance:', user.balance.toString());
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
