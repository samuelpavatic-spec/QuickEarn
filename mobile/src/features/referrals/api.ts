import apiClient from '../../api/apiClient';

export interface ReferralStats {
  totalReferrals: number;
  totalEarnings: string;
}

export interface ReferredUser {
  id: string;
  fullName: string;
  createdAt: string;
}

export const getReferralStats = async (): Promise<ReferralStats> => {
  const response = await apiClient.get('/referrals/stats');
  return response.data;
};

export const getReferralsList = async (): Promise<ReferredUser[]> => {
  const response = await apiClient.get('/referrals/list');
  return response.data;
};
