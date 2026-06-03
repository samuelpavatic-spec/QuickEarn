import apiClient from '../../api/apiClient';
import { LoginCredentials, RegisterCredentials, AuthResponse } from './types';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/register', credentials);
  return response.data;
};

export const getMe = async (): Promise<AuthResponse['user']> => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};
