import { api } from './api';

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'past';
  totalVotes: number;
  eligibleVoters: number;
  positions: Array<{ id: string; title: string }>;
  hasVoted?: boolean;
  timeLeft?: string;
  timeUntilStart?: string;
}

export interface Candidate {
  id: string;
  name: string;
  faculty: string;
  year: string;
  manifesto: string;
  image: string;
  position: string;
}

export interface VoteData {
  electionId: string;
  candidateId: string;
}

export const electionService = {
  getElections: async (userId: string, status?: 'active' | 'upcoming' | 'past'): Promise<Election[]> => {
    try {
      console.log('Fetching elections with status:', status);
      const endpoint = status ? `/elections?status=${status}` : '/elections';
      const data = await api.get<Election[]>(endpoint, userId ? { 'x-user-id': userId } : undefined);
      console.log('Received elections data:', data);
      return data;
    } catch (error) {
      console.error('Error in getElections:', error);
      throw error;
    }
  },

  getElectionById: async (id: string): Promise<Election> => {
    try {
      const data = await api.get<Election>(`/elections/${id}`);
      return data;
    } catch (error) {
      console.error('Error in getElectionById:', error);
      throw error;
    }
  },

  getCandidates: async (electionId: string): Promise<Candidate[]> => {
    try {
      const data = await api.get<Candidate[]>(`/elections/${electionId}/candidates`);
      return data;
    } catch (error) {
      console.error('Error in getCandidates:', error);
      throw error;
    }
  },

  submitVote: async (voteData: VoteData, userId?: string): Promise<{ success: boolean }> => {
    try {
      const headers = userId ? { 'x-user-id': userId } : undefined;
      const data = await api.post<{ success: boolean }>(`/elections/${voteData.electionId}`, {
        candidateId: parseInt(voteData.candidateId),
        faceVerified: true
      }, headers);
      return data;
    } catch (error) {
      console.error('Error in submitVote:', error);
      throw error;
    }
  },

  // Admin methods
  createElection: async (electionData: Omit<Election, 'id'>): Promise<Election> => {
    try {
      const data = await api.post<Election>('/admin/elections', electionData);
      return data;
    } catch (error) {
      console.error('Error in createElection:', error);
      throw error;
    }
  },

  updateElection: async (id: string, electionData: Partial<Election>): Promise<Election> => {
    try {
      const data = await api.put<Election>(`/admin/elections/${id}`, electionData);
      return data;
    } catch (error) {
      console.error('Error in updateElection:', error);
      throw error;
    }
  },

  deleteElection: async (id: string): Promise<{ success: boolean }> => {
    try {
      const data = await api.delete<{ success: boolean }>(`/admin/elections/${id}`);
      return data;
    } catch (error) {
      console.error('Error in deleteElection:', error);
      throw error;
    }
  },

  addCandidate: async (electionId: string, candidateData: Omit<Candidate, 'id'>): Promise<Candidate> => {
    try {
      const data = await api.post<Candidate>(`/admin/elections/${electionId}/candidates`, candidateData);
      return data;
    } catch (error) {
      console.error('Error in addCandidate:', error);
      throw error;
    }
  },

  removeCandidate: async (electionId: string, candidateId: string): Promise<{ success: boolean }> => {
    try {
      const data = await api.delete<{ success: boolean }>(`/admin/elections/${electionId}/candidates/${candidateId}`);
      return data;
    } catch (error) {
      console.error('Error in removeCandidate:', error);
      throw error;
    }
  },
}; 