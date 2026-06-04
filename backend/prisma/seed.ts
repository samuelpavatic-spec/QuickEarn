import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tasks = [
    {
      title: 'Quick Survey',
      description: 'Complete this 2-minute survey about mobile usage.',
      type: 'SURVEY',
      rewardAmount: BigInt(500000), // -bash.05
    },
    {
      title: 'Watch Ad Video',
      description: 'Watch a 30-second ad video to earn rewards.',
      type: 'AD',
      rewardAmount: BigInt(100000), // -bash.01
    },
    {
      title: 'Download App',
      description: 'Download and open the specified app.',
      type: 'APP_INSTALL',
      rewardAmount: BigInt(1000000), // -bash.10
    }
  ];

  for (const task of tasks) {
    await prisma.task.upsert({
      where: { id: task.title }, // This is just for seeding, title isn't unique in schema but I'll use it as a dummy key if I had one, wait, schema doesn't have unique title.
      update: {},
      create: task,
    });
  }
}
// Actually, I'll just use create
async function seed() {
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
      }
    ]
  });
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
