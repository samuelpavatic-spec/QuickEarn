import apiClient from '../../api/apiClient';

export const getPayoutMethods = async () => {
  return [
    { id: '1', type: 'MPesa', minAmount: 1 },
    { id: '2', type: 'UPI', minAmount: 1 },
    { id: '3', type: 'PayPal', minAmount: 5 },
    { id: '4', type: 'Amazon Gift Card', minAmount: 10 },
    { id: '5', type: 'Netflix Gift Card', minAmount: 15 },
    { id: '6', type: 'Spotify Gift Card', minAmount: 10 },
    { id: '7', type: 'Visa Prepaid', minAmount: 25 },
    { id: '8', type: 'USDT (Crypto)', minAmount: 20 },
    { id: '9', type: 'Minecraft Hosting', minAmount: 5 },
    { id: '10', type: 'Charity Donation', minAmount: 1 },
  ];
};

export const getCharityOrganizations = async () => {
  return [
    { id: 'org1', name: 'St. Jude Children Hospital', category: 'Hospital' },
    { id: 'org2', name: 'American Cancer Society', category: 'Cancer' },
    { id: 'org3', name: 'Clean Water Initiative', category: 'Environment' },
    { id: 'org4', name: 'Red Cross Emergency Relief', category: 'Relief' },
    { id: 'org5', name: 'Mayo Clinic Foundation', category: 'Hospital' },
  ];
};

export const getMinecraftProviders = async () => {
  return [
    { id: 'p1', name: 'Shockbyte', basePrice: 4.5 },
    { id: 'p2', name: 'PebbleHost', basePrice: 3.0 },
    { id: 'p3', name: 'Apex Hosting', basePrice: 5.0 },
    { id: 'p4', name: 'BisectHosting', basePrice: 6.0 },
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
