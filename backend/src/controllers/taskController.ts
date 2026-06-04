import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const listTasks = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const where: any = { status: 'ACTIVE' };
    if (type) {
      where.type = type as string;
    }
    const tasks = await prisma.task.findMany({
      where
    });
    res.json(tasks.map(t => ({ ...t, rewardAmount: t.rewardAmount.toString() })));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ ...task, rewardAmount: task.rewardAmount.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const startTask = async (req: Request, res: Response) => {
  try {
    const { id: taskId } = req.params;
    const userId = (req as any).userId;

    const existing = await prisma.userTask.findFirst({
      where: { userId, taskId }
    });

    if (existing) {
      return res.status(400).json({ error: 'Task already started or completed' });
    }

    const userTask = await prisma.userTask.create({
      data: {
        userId,
        taskId,
        status: 'STARTED'
      }
    });

    res.status(201).json(userTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const submitTask = async (req: Request, res: Response) => {
  try {
    const { id: taskId } = req.params;
    const { evidenceData } = req.body;
    const userId = (req as any).userId;

    const userTask = await prisma.userTask.findFirst({
      where: { userId, taskId, status: 'STARTED' }
    });

    if (!userTask) {
      return res.status(404).json({ error: 'Active task session not found' });
    }

    const updated = await prisma.userTask.update({
      where: { id: userTask.id },
      data: {
        status: 'PENDING',
        evidenceData: JSON.stringify(evidenceData),
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const userTasks = await prisma.userTask.findMany({
      where: { userId },
      include: { task: true }
    });
    res.json(userTasks.map(ut => ({
      ...ut,
      rewardPaid: ut.rewardPaid?.toString(),
      task: { ...ut.task, rewardAmount: ut.task.rewardAmount.toString() }
    })));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
