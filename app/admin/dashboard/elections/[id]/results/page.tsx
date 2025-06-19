"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Users, VoteIcon, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface Candidate {
  id: number;
  name: string;
  position: string;
  votes: number;
  percentage: number;
}

interface ElectionResult {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  totalVotes: number;
  eligibleVoters: number;
  positions: string[];
  candidates: Candidate[];
}

export default function ElectionResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [election, setElection] = useState<ElectionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API call - replace with actual API call
    const fetchElectionResults = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockElection: ElectionResult = {
          id: parseInt(params.id),
          title: "Student Guild Elections 2025",
          description: "Vote for your student representatives for the 2025-2026 academic year",
          startDate: "2025-05-10",
          endDate: "2025-05-15",
          status: "completed",
          totalVotes: 520,
          eligibleVoters: 1200,
          positions: ["President", "Vice President", "Secretary", "Treasurer"],
          candidates: [
            {
              id: 1,
              name: "John Doe",
              position: "President",
              votes: 320,
              percentage: 61.5
            },
            {
              id: 2,
              name: "Jane Smith",
              position: "President",
              votes: 200,
              percentage: 38.5
            },
            {
              id: 3,
              name: "Mike Johnson",
              position: "Vice President",
              votes: 280,
              percentage: 53.8
            },
            {
              id: 4,
              name: "Sarah Williams",
              position: "Vice President",
              votes: 240,
              percentage: 46.2
            }
          ]
        };
        setElection(mockElection);
      } catch (error) {
        console.error("Error fetching election results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchElectionResults();
  }, [params.id]);

  const handleExportResults = () => {
    // Implement export functionality
    console.log("Exporting results...");
  };

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading election results...</p>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="p-8">
        <p>Election not found</p>
      </div>
    );
  }

  const participationRate = (election.totalVotes / election.eligibleVoters) * 100;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Elections
        </Button>
        <Button
          onClick={handleExportResults}
          className="flex items-center gap-2"
          style={{ background: '#003B71', color: 'white' }}
        >
          <Download className="h-4 w-4" />
          Export Results
        </Button>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-[#003B71]">{election.title}</CardTitle>
            <CardDescription>{election.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-[#003B71]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Voters</p>
                  <p className="text-xl font-bold">{election.eligibleVoters}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <VoteIcon className="h-6 w-6 text-[#003B71]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Votes Cast</p>
                  <p className="text-xl font-bold">{election.totalVotes}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-[#003B71]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Election Period</p>
                  <p className="text-sm font-bold">
                    {format(new Date(election.startDate), "MMM d, yyyy")} -{" "}
                    {format(new Date(election.endDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={participationRate} className="h-2" />
              <p className="text-sm text-gray-600 text-right">
                {participationRate.toFixed(1)}% Participation
              </p>
            </div>
          </CardContent>
        </Card>

        {election.positions.map((position) => (
          <Card key={position}>
            <CardHeader>
              <CardTitle>{position}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {election.candidates
                  .filter((candidate) => candidate.position === position)
                  .map((candidate) => (
                    <div key={candidate.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{candidate.name}</span>
                        <span className="text-sm text-gray-600">
                          {candidate.votes} votes ({candidate.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={candidate.percentage} className="h-2" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 