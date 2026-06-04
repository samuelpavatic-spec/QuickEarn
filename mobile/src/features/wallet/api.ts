import apiClient from '../../api/apiClient';

export interface PayoutMethod {
  id: string;
  name: string;
  type: 'MPESA' | 'UPI' | 'GCASH' | 'AIRTIME' | 'BANK' | 'USDT';
  minAmount: string;
  fee: string;
}

export interface PayoutRequest {
  id: string;
  amount: string;
  method: string;
  destination: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  createdAt: string;
  processedAt?: string;
}

export const getPayoutMethods = async (): Promise<PayoutMethod[]> => {
  const response = await apiClient.get('/payouts/methods');
  return response.data;
};

export const requestPayout = async (data: {
  amount: string;
  method: string;
  destination: string;
}): Promise<PayoutRequest> => {
  const response = await apiClient.post('/payouts/request', data);
  return response.data;
};

export const getPayoutHistory = async (): Promise<PayoutRequest[]> => {
  const response = await apiClient.get('/payouts/history');
  return response.data;
};
