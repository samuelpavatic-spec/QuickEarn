import apiClient from '../../api/apiClient';

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'SURVEY' | 'AD' | 'APP_INSTALL' | 'REFERRAL' | 'OTHER';
  rewardAmount: string; // BigInt as string from API
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED';
}

export interface UserTask {
  id: string;
  taskId: string;
  status: 'STARTED' | 'PENDING' | 'COMPLETED' | 'REJECTED';
  rewardPaid: string;
  completedAt?: string;
}

export const getTasks = async (): Promise<Task[]> => {
  const response = await apiClient.get('/tasks');
  return response.data;
};

export const getTaskDetails = async (id: string): Promise<Task> => {
  const response = await apiClient.get(`/tasks/${id}`);
  return response.data;
};

export const startTask = async (id: string): Promise<UserTask> => {
  const response = await apiClient.post(`/tasks/${id}/start`);
  return response.data;
};

export const submitTask = async (id: string, evidenceData: any): Promise<UserTask> => {
  const response = await apiClient.post(`/tasks/${id}/submit`, { evidenceData });
  return response.data;
};

export const getMyTasks = async (): Promise<UserTask[]> => {
  const response = await apiClient.get('/my-tasks');
  return response.data;
};
