import { api } from './api';
import { User } from '@/types';

export const userService = {
  addUser: async (userData: Partial<User>): Promise<User> => {
    const response = await api.post<User>('/users', userData);
    if (response.data) {
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to add user');
    }
  },

  // You can add other user-related methods here (e.g., getUsers, updateUser, deleteUser)
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data || [];
  },
}; 