import { api } from './api';
import { Position, Candidate } from '@/types';

export const positionService = {
  getPositions: async (electionId: number): Promise<Position[]> => {
    const response = await api.get<Position[]>(`/elections/${electionId}/positions`);
    return response.data || [];
  },

  addPosition: async (electionId: number, data: Omit<Position, 'id' | 'candidates' | 'createdAt' | 'updatedAt'>): Promise<Position> => {
    const response = await api.post<Position>(`/elections/${electionId}/positions`, data);
    return response.data;
  },

  deletePosition: async (electionId: number, positionId: number): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/elections/${electionId}/positions/${positionId}`);
    return response.data;
  },
};

export const candidateService = {
  getCandidates: async (electionId: number): Promise<Candidate[]> => {
    const positions = await positionService.getPositions(electionId);
    return positions.flatMap(position => position.candidates || []);
  },
  addCandidate: async (electionId: number, positionId: number, data: Partial<Candidate>) => {
    const response = await api.post(`/elections/${electionId}/positions/${positionId}/candidates`, data);
    return response.data;
  },
  updateCandidate: async (electionId: number, positionId: number, candidateId: number, data: Partial<Candidate>) => {
    const response = await api.patch(`/elections/${electionId}/positions/${positionId}/candidates?candidateId=${candidateId}`, data);
    return response.data;
  },
  deleteCandidate: async (electionId: number, positionId: number, candidateId: number) => {
    const response = await api.delete(`/elections/${electionId}/positions/${positionId}/candidates?candidateId=${candidateId}`);
    return response.data;
  },
}; 