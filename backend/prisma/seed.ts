import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Cleaning up database...');
  await prisma.userTask.deleteMany();
  await prisma.payoutRequest.deleteMany();
  await prisma.task.deleteMany();
  
  console.log('Seeding tasks...');
  await prisma.task.createMany({
    data: [
      {
        title: 'Quick Survey',
        description: 'Complete this 2-minute survey about mobile usage.',
        type: 'SURVEY',
        rewardAmount: BigInt(500000),
      },
      {
        title: 'Watch Ad Video',
        description: 'Watch a 30-second ad video to earn rewards.',
        type: 'AD',
        rewardAmount: BigInt(100000),
      },
      {
        title: 'Download App',
        description: 'Download and open the specified app.',
        type: 'APP_INSTALL',
        rewardAmount: BigInt(1000000),
      },
      {
        title: 'Refer a Friend',
        description: 'Invite a friend to join QuickEarn.',
        type: 'REFERRAL',
        rewardAmount: BigInt(2000000),
      }
    ]
  });
  console.log('Database seeded successfully.');
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
