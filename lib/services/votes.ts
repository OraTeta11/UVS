import { api } from './api';
import { Vote } from '@/types';

export const voteService = {
  getVotes: async (electionId: number): Promise<Vote[]> => {
    const response = await api.get<Vote[]>(`/elections/${electionId}/votes`);
    return response || [];
  },

  submitVote: async (electionId: number, data: Omit<Vote, 'id' | 'createdAt' | 'position' | 'candidate' | 'user'>): Promise<Vote> => {
    const response = await api.post<Vote>(`/elections/${electionId}`, data);
    return response.data;
  },

  deleteVote: async (electionId: number, voteId: number): Promise<void> => {
    await api.delete(`/elections/${electionId}/votes?voteId=${voteId}`);
  },
}; 