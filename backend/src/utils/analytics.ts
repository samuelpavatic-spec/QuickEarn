import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const logEvent = async (event: string, userId?: string, metadata?: any) => {
  try {
    await prisma.analyticsEvent.create({
      data: {
        event,
        userId,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (error) {
    console.error('Failed to log analytics event:', error);
  }
};
