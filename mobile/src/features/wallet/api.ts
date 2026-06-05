import apiClient from '../../api/apiClient';

export const getPayoutMethods = async () => {
  return [
    { id: '1', type: 'MPesa', minAmount: 1 },
    { id: '2', type: 'UPI', minAmount: 1 },
    { id: '3', type: 'PayPal', minAmount: 5 },
    { id: '4', type: 'Amazon Gift Card', minAmount: 10 },
    { id: '5', type: 'Netflix Gift Card', minAmount: 15 },
    { id: '6', type: 'USDT (Crypto)', minAmount: 20 },
    { id: '7', type: 'Minecraft Hosting', minAmount: 5 },
    { id: '8', type: 'Charity Donation', minAmount: 1 },
  ];
};

export const getCharityOrganizations = async () => {
  return [
    { id: 'org1', name: 'Cancer Research Foundation', icon: 'heart' },
    { id: 'org2', name: 'Global Children Education', icon: 'book' },
    { id: 'org3', name: 'Clean Water Initiative', icon: 'droplet' },
    { id: 'org4', name: 'Emergency Food Relief', icon: 'utensils' },
  ];
};

export const getMinecraftProviders = async () => {
  return [
    { id: 'p1', name: 'Apex Hosting', basePrice: 5 },
    { id: 'p2', name: 'Shockbyte', basePrice: 4.5 },
    { id: 'p3', name: 'BisectHosting', basePrice: 6 },
    { id: 'p4', name: 'MelonCube', basePrice: 3.5 },
  ];
};

export const requestPayout = async (data: { method: string, amount: string, destination: string, metadata?: any }) => {
  const response = await apiClient.post('/payouts/request', data);
  return response.data;
};

export const getPayoutHistory = async () => {
  const response = await apiClient.get('/payouts/history');
  return response.data;
};
