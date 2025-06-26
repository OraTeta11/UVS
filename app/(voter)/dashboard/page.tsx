"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, CheckCircle2, Clock, Users, VoteIcon } from "lucide-react"
import Link from "next/link"
import { ElectionCard } from "@/components/ui/ElectionCard"
import { useAuth } from '@/lib/hooks/useAuth'
import { useElections, useElection } from '@/lib/hooks/useElections'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VoteModalContent from '@/components/voter/VoteModalContent';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user } = useAuth();
  const { elections, loading, error, refetch } = useElections(user?.id || '');
  const [activeTab, setActiveTab] = useState("active");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCandidatesModal, setShowCandidatesModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedElection, setSelectedElection] = useState<any>(null);
  const [modalElectionId, setModalElectionId] = useState<string | null>(null);
  const [votingElectionId, setVotingElectionId] = useState<string | null>(null);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);

  const {
    election: modalElection,
    candidates: modalCandidates,
    loading: modalLoading,
    error: modalError,
  } = useElection(modalElectionId || '');

  const {
    election: votingElection,
    candidates: votingCandidates,
    loading: votingLoading,
    error: votingError,
    submitVote: submitVotingVote,
  } = useElection(votingElectionId || '');

  const filteredElections = {
    active: elections.filter(
      (election) =>
        election.status === 'active' &&
        (election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          election.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    upcoming: elections.filter(
      (election) =>
        election.status === 'upcoming' &&
        (election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          election.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    past: elections.filter(
      (election) =>
        election.status === 'completed' &&
        (election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          election.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  };

  // Handler for viewing candidates
  const handleViewCandidates = (election: any) => {
    setSelectedElection(election);
    setModalElectionId(election.id?.toString?.() || election.id);
    setShowCandidatesModal(true);
  };

  // Handler for viewing results
  const handleViewResults = (election: any) => {
    setSelectedElection(election);
    setModalElectionId(election.id?.toString?.() || election.id);
    setShowResultsModal(true);
  };

  return (
    <div className="space-y-8">
      {!showVoteModal && (
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#003B71]">Dashboard</h1>
          <div className="relative w-64">
            <input
              placeholder="Search elections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border rounded-md py-2 px-3 w-full"
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <VoteIcon className="h-6 w-6 text-[#003B71]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Elections</p>
                <p className="text-2xl font-bold">{filteredElections.active.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <CalendarDays className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Upcoming Elections</p>
                <p className="text-2xl font-bold">{filteredElections.upcoming.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Elections</p>
                <p className="text-2xl font-bold">{filteredElections.past.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Elections</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Elections</TabsTrigger>
          <TabsTrigger value="past">Past Elections</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredElections.active.map((election) => {
              const now = new Date();
              const end = new Date(election.endDate);
              const daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
              const showDaysLeft = (election.status === 'active' || election.status === 'upcoming') && daysLeft > 0;
              return (
                <ElectionCard
                  key={election.id}
                  id={election.id}
                  title={election.title}
                  description={election.description}
                  startDate={election.startDate}
                  endDate={election.endDate}
                  positions={election.positions}
                  status={election.status}
                  hasVoted={election.hasVoted}
                  daysLeft={daysLeft}
                  showDaysLeft={showDaysLeft}
                  actionButton={
                    !election.hasVoted && election.status === 'active' ? (
                      <button
                        className="block w-full text-center bg-[#003B71] text-white py-2 rounded-md hover:bg-[#002a52] transition-colors mt-2"
                        onClick={() => {
                          setVotingElectionId(election.id.toString());
                          setShowVoteModal(true);
                        }}
                      >
                        Vote Now
                      </button>
                    ) : null
                  }
                  showViewCandidates={true}
                  onViewCandidates={() => handleViewCandidates(election)}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredElections.upcoming.map((election) => {
              const now = new Date();
              const end = new Date(election.endDate);
              const daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
              const showDaysLeft = (election.status === 'active' || election.status === 'upcoming') && daysLeft > 0;
              return (
                <ElectionCard
                  key={election.id}
                  id={election.id}
                  title={election.title}
                  description={election.description}
                  startDate={election.startDate}
                  endDate={election.endDate}
                  positions={election.positions}
                  status={election.status}
                  hasVoted={election.hasVoted}
                  daysLeft={daysLeft}
                  showDaysLeft={showDaysLeft}
                  showViewCandidates={true}
                  onViewCandidates={() => handleViewCandidates(election)}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredElections.past.map((election) => (
              <ElectionCard
                key={election.id}
                id={election.id}
                title={election.title}
                description={election.description}
                startDate={election.startDate}
                endDate={election.endDate}
                positions={election.positions}
                status={election.status}
                hasVoted={election.hasVoted}
                daysLeft={0}
                showDaysLeft={false}
                showViewResults={true}
                onViewResults={() => handleViewResults(election)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Candidates Modal */}
      <Dialog open={showCandidatesModal} onOpenChange={setShowCandidatesModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Election Candidates</DialogTitle>
          </DialogHeader>
          {modalLoading ? (
            <p>Loading candidates...</p>
          ) : modalError ? (
            <p className="text-red-600">Failed to load candidates.</p>
          ) : modalElection && modalCandidates ? (
            <div>
              <p className="font-semibold mb-2">{modalElection.title}</p>
              {modalCandidates.length === 0 ? (
                <p>No candidates found for this election.</p>
              ) : (
                <ul className="space-y-4">
                  {modalCandidates.map((candidate) => (
                    <li key={candidate.id} className="border rounded-lg p-3 flex items-center gap-4">
                      <img src={candidate.image || '/placeholder.svg'} alt={candidate.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold">{candidate.name}</p>
                        <p className="text-xs text-gray-500">{candidate.position}</p>
                        <p className="text-xs text-gray-500">{candidate.faculty} | {candidate.year}</p>
                        <p className="text-sm mt-1">{candidate.manifesto}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
      {/* Results Modal */}
      <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Election Results</DialogTitle>
          </DialogHeader>
          {modalLoading ? (
            <p>Loading results...</p>
          ) : modalError ? (
            <p className="text-red-600">Failed to load results.</p>
          ) : modalElection ? (
            <div>
              <p className="font-semibold mb-2">{modalElection.title}</p>
              <p className="text-sm text-gray-600 mb-2">{modalElection.description}</p>
              <div className="mb-2 text-xs text-gray-500">
                <span>Start: {new Date(modalElection.startDate).toLocaleString()}</span><br />
                <span>End: {new Date(modalElection.endDate).toLocaleString()}</span>
              </div>
              {modalElection.positions && modalElection.positions.length > 0 ? (
                <div>
                  <h4 className="font-semibold mt-2 mb-1">Results by Position:</h4>
                  {modalElection.positions.map((pos: any) => (
                    <div key={pos.id} className="mb-3">
                      <p className="font-medium text-[#003B71]">{pos.title}</p>
                      {pos.candidates && pos.candidates.length > 0 ? (
                        <ul className="ml-4 space-y-1">
                          {pos.candidates.map((c: any) => (
                            <li key={c.id} className="flex items-center gap-2">
                              <span className="font-semibold">{c.full_name || c.name}</span>
                              <span className="text-xs text-gray-500">Votes: {c.vote_count || 0}</span>
                              {c.is_winner && <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Winner</span>}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-400 ml-4">No candidates for this position.</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No positions or results found for this election.</p>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
      <Dialog open={showVoteModal} onOpenChange={setShowVoteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vote in Election</DialogTitle>
          </DialogHeader>
          {votingLoading ? (
            <div>Loading election data...</div>
          ) : votingError || !votingElection ? (
            <div className="text-red-600">Failed to load election data.</div>
          ) : (
            <VoteModalContent
              election={votingElection}
              candidates={votingCandidates}
              onVote={async (candidateId, position) => {
                await submitVotingVote(candidateId, position);
                setShowVoteModal(false);
                setVotingElectionId(null);
                setVoteSuccess(true);
                await refetch();
                toast.success('Vote submitted successfully!');
              }}
              onCancel={() => {
                setShowVoteModal(false);
                setVotingElectionId(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      {voteSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          Vote submitted successfully!
          <button className="ml-4 underline" onClick={() => setVoteSuccess(false)}>Dismiss</button>
        </div>
      )}
    </div>
  )
}
