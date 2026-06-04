import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPayoutMethods = async (req: Request, res: Response) => {
  const { country } = req.query;
  
  // Base list of all methods
  const allMethods = [
    { id: 'PAYPAL', name: 'PayPal', fee: '1000000', countries: ['US', 'GB', 'CA', 'BR', 'IN', 'NG', 'PH'] },
    { id: 'MPESA', name: 'M-Pesa', fee: '500000', countries: ['KE', 'TZ', 'UG', 'GH'] },
    { id: 'UPI', name: 'UPI', fee: '250000', countries: ['IN'] },
    { id: 'GCASH', name: 'GCash', fee: '250000', countries: ['PH'] },
    { id: 'AIRTIME', name: 'Airtime Top-up', fee: '100000', countries: ['KE', 'NG', 'IN', 'BR', 'PH'] },
    { id: 'BANK', name: 'Bank Transfer', fee: '2000000', countries: ['US', 'GB', 'CA', 'BR', 'IN', 'NG', 'PH', 'KE'] },
    { id: 'USDT', name: 'USDT (TRC-20)', fee: '1000000', countries: [] }, // Global
    { id: 'AMAZON_GIFT', name: 'Amazon Gift Card', fee: '0', countries: ['US', 'GB', 'CA', 'BR', 'IN'] },
    { id: 'NETFLIX_GIFT', name: 'Netflix Gift Card', fee: '0', countries: ['US', 'GB', 'CA', 'BR', 'IN'] },
    { id: 'SPOTIFY_GIFT', name: 'Spotify Gift Card', fee: '0', countries: ['US', 'GB', 'CA', 'BR', 'IN'] },
    { id: 'VISA_PREPAID', name: 'Visa Prepaid Card', fee: '2000000', countries: ['US', 'GB', 'CA', 'BR', 'IN', 'NG', 'PH'] },
    { id: 'MINECRAFT_HOSTING', name: 'Minecraft Server Hosting', fee: '0', countries: [] }, // Global
  ];

  let filteredMethods = allMethods;
  if (country) {
    filteredMethods = allMethods.filter(m => 
      m.countries.length === 0 || m.countries.includes(country as string)
    );
  }

  res.json(filteredMethods.map(({ countries, ...rest }) => rest));
};

export const requestPayout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { amount, method, destination } = req.body;
    const amountBI = BigInt(amount);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.balance < amountBI) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const fee = BigInt(500000); // Fixed fee example

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: amountBI } }
      });

      const payout = await tx.payoutRequest.create({
        data: {
          userId,
          amount: amountBI,
          method,
          destination,
          fee,
          status: 'PENDING'
        }
      });

      return { updatedUser, payout };
    });

    res.status(201).json({
      ...result.payout,
      amount: result.payout.amount.toString(),
      fee: result.payout.fee.toString(),
      userBalance: result.updatedUser.balance.toString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPayoutHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const payouts = await prisma.payoutRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(payouts.map(p => ({
      ...p,
      amount: p.amount.toString(),
      fee: p.fee.toString()
    })));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
