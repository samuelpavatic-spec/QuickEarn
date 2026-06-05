import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Payout API', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    // Create a test user with balance
    const email = `payout-test-${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email,
        password: 'password123',
        fullName: 'Payout Tester',
        country: 'US'
      });
    
    token = res.body.accessToken;
    userId = res.body.user.id;

    // Add balance to user
    await prisma.user.update({
      where: { id: userId },
      data: { balance: BigInt(20000000) } // $20.00
    });
  });

  afterAll(async () => {
    await prisma.payoutRequest.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it('should list payout methods including Minecraft and Charity', async () => {
    const res = await request(app)
      .get('/api/v1/payouts/methods')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const methods = res.body;
    expect(methods.find((m: any) => m.id === 'MINECRAFT_HOSTING')).toBeDefined();
    expect(methods.find((m: any) => m.id === 'CHARITY_DONATION')).toBeDefined();
  });

  it('should request a charity donation', async () => {
    const res = await request(app)
      .post('/api/v1/payouts/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: '1000000', // $1.00
        method: 'CHARITY_DONATION',
        destination: 'RED_CROSS',
        metadata: { organizationId: 'RED_CROSS' }
      });

    expect(res.status).toBe(201);
    expect(res.body.method).toBe('CHARITY_DONATION');
    expect(res.body.fee).toBe('0');
  });

  it('should request Minecraft hosting with dynamic pricing', async () => {
    // 2GB RAM * 2.50 = $5.00
    // 10 Mods * 0.10 = $1.00
    // 1 Addon * 0.50 = $0.50
    // Total = $6.50 = 6500000 micro-units
    // 1 month
    const res = await request(app)
      .post('/api/v1/payouts/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        method: 'MINECRAFT_HOSTING',
        destination: 'Shockbyte',
        metadata: {
          provider: 'Shockbyte',
          ramGB: 2,
          modCount: 10,
          addonCount: 1,
          months: 1
        }
      });

    expect(res.status).toBe(201);
    expect(res.body.amount).toBe('6500000');
    expect(res.body.fee).toBe('0');
  });

  it('should fail if balance is insufficient for Minecraft hosting', async () => {
    const res = await request(app)
      .post('/api/v1/payouts/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        method: 'MINECRAFT_HOSTING',
        destination: 'Shockbyte',
        metadata: {
          provider: 'Shockbyte',
          ramGB: 16, // Very expensive
          modCount: 0,
          addonCount: 0,
          months: 12
        }
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Insufficient balance');
  });
});
