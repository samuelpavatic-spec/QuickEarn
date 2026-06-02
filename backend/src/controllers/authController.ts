import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  hashPassword, 
  comparePassword, 
  generateAccessToken, 
  generateRefreshToken,
  verifyRefreshToken
} from '../utils/auth';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, country, referralCode } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const userReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    let referredBy = null;
    if (referralCode) {
      referredBy = await prisma.user.findUnique({ where: { referralCode } });
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        fullName,
        country,
        referralCode: userReferralCode,
        referredById: referredBy ? referredBy.id : null,
      },
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        referralCode: user.referralCode,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        referralCode: user.referralCode,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    // userId will be attached by auth middleware
    const userId = (req as any).userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        country: true,
        balance: true,
        referralCode: true,
        createdAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Convert BigInt to Number/String for JSON
    const userJson = {
      ...user,
      balance: user.balance.toString(),
    };

    res.json(userJson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
