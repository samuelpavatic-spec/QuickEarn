import apiClient from '../../api/apiClient';

export const getPayoutMethods = async () => {
  // Mocking more methods as requested by lead
  return [
    { id: '1', type: 'MPesa', minAmount: 1 },
    { id: '2', type: 'UPI', minAmount: 1 },
    { id: '3', type: 'PayPal', minAmount: 5 },
    { id: '4', type: 'Amazon Gift Card', minAmount: 10 },
    { id: '5', type: 'Netflix Gift Card', minAmount: 15 },
    { id: '6', type: 'USDT (Crypto)', minAmount: 20 },
    { id: '7', type: 'Minecraft Hosting', minAmount: 5 },
  ];
};

export const requestPayout = async (data: { method: string, amount: string, destination: string }) => {
  const response = await apiClient.post('/payouts/request', data);
  return response.data;
};

export const getPayoutHistory = async () => {
  const response = await apiClient.get('/payouts/history');
  return response.data;
};
