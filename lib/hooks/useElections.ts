import { useState, useEffect } from 'react';
import { electionService, Election, Candidate } from '../services/elections';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export const useElections = (userId: string, status?: 'active' | 'upcoming' | 'past') => {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchElections = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await electionService.getElections(userId, status);
      setElections(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch elections');
      toast.error('Failed to fetch elections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, [userId, status]);

  return { elections, loading, error, refetch: fetchElections };
};

export const useElection = (id: string) => {
  const { user } = useAuth();
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchElection = async () => {
    try {
      setLoading(true);
      setError(null);
      const [electionData, candidatesData] = await Promise.all([
        electionService.getElectionById(id),
        electionService.getCandidates(id),
      ]);
      setElection(electionData);
      setCandidates(candidatesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch election details');
      toast.error('Failed to fetch election details');
    } finally {
      setLoading(false);
    }
  };

  const submitVote = async (candidateId: string) => {
    try {
      setLoading(true);
      setError(null);
      await electionService.submitVote({ electionId: id, candidateId }, user?.id);
      toast.success('Vote submitted successfully');
      await fetchElection(); // Refresh election data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit vote');
      toast.error('Failed to submit vote');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElection();
  }, [id]);

  return {
    election,
    candidates,
    loading,
    error,
    submitVote,
    refetch: fetchElection,
  };
}; 