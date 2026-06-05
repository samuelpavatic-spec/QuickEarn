import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logEvent } from '../utils/analytics.js';

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
    { 
      id: 'MINECRAFT_HOSTING', 
      name: 'Minecraft Server Hosting', 
      fee: '0', 
      countries: [],
      config: {
        providers: ['Shockbyte', 'PebbleHost', 'Apex', 'BisectHosting'],
        basePricePerGB: 2500000, // $2.50 per GB
        pricePerMod: 100000, // $0.10 per mod
        pricePerAddon: 500000, // $0.50 per addon
      }
    },
    {
      id: 'CHARITY_DONATION',
      name: 'Charity Donation',
      fee: '0',
      countries: [],
      organizations: [
        { id: 'HOSPITAL_A', name: 'City Children\'s Hospital' },
        { id: 'CANCER_ORG_B', name: 'Global Cancer Foundation' },
        { id: 'RED_CROSS', name: 'International Red Cross' }
      ]
    }
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
    const { amount, method, destination, metadata } = req.body;
    let finalAmountBI: bigint;

    // Handle dynamic pricing for Minecraft
    if (method === 'MINECRAFT_HOSTING') {
      if (!metadata || !metadata.ramGB || !metadata.months) {
        return res.status(400).json({ error: 'Minecraft hosting requires ramGB and months in metadata' });
      }
      const ramGB = Number(metadata.ramGB);
      const modCount = Number(metadata.modCount || 0);
      const addonCount = Number(metadata.addonCount || 0);
      const months = Number(metadata.months);

      const basePricePerGB = 2500000;
      const pricePerMod = 100000;
      const pricePerAddon = 500000;
      
      const pricePerMonth = (ramGB * basePricePerGB) + (modCount * pricePerMod) + (addonCount * pricePerAddon);
      finalAmountBI = BigInt(pricePerMonth * months);
    } else {
      if (!amount) return res.status(400).json({ error: 'Amount is required' });
      finalAmountBI = BigInt(amount);
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.balance < finalAmountBI) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    let fee = BigInt(500000); // Default fee
    if (method === 'CHARITY_DONATION' || method === 'MINECRAFT_HOSTING') {
      fee = BigInt(0);
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: finalAmountBI } }
      });

      const payout = await tx.payoutRequest.create({
        data: {
          userId,
          amount: finalAmountBI,
          method,
          destination,
          fee,
          status: 'PENDING',
          metadata: metadata ? JSON.stringify(metadata) : null
        }
      });

      return { updatedUser, payout };
    });

    await logEvent('PAYOUT_REQUESTED', userId, { amount: finalAmountBI.toString(), method });

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
