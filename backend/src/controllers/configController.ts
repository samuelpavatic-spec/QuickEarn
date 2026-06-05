import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getConfig = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const config = await prisma.globalConfig.findUnique({
      where: { key }
    });
    if (!config) return res.status(404).json({ error: 'Config not found' });
    res.json(JSON.parse(config.value));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const listConfigs = async (req: Request, res: Response) => {
  try {
    const configs = await prisma.globalConfig.findMany();
    const result: any = {};
    configs.forEach(c => {
      result[c.key] = JSON.parse(c.value);
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
