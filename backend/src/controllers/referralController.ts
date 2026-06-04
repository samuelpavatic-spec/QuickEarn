import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getReferralStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const referralsCount = await prisma.user.count({
      where: { referredById: userId }
    });
    
    // For now simple count, could calculate earnings from referrals if logic exists
    res.json({
      count: referralsCount,
      earnings: "0" 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getReferralList = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const referrals = await prisma.user.findMany({
      where: { referredById: userId },
      select: {
        id: true,
        fullName: true,
        createdAt: true,
      }
    });
    res.json(referrals);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
