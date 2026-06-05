import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import payoutRoutes from './routes/payoutRoutes.js';
import referralRoutes from './routes/referralRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/payouts', payoutRoutes);
app.use('/api/v1/referrals', referralRoutes);

export default app;
