"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Users,
  VoteIcon,
  CheckCircle2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { electionService } from '@/lib/services/elections'
import { Election } from '@/types'
import { useAuth } from '@/lib/hooks/useAuth'

export default function AdminDashboardPage() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()
  const { user } = useAuth();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const fetchedElections = await electionService.getElections(user.id);
          setElections(fetchedElections);
          setError(null);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch elections');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchElections();
  }, [user?.id]);

  if (loading) {
    return (
        <div className="space-y-6">
            {/* Loading Skeleton */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="h-5 w-2/5 rounded-md bg-gray-200 dark:bg-gray-700" />
                            <div className="h-6 w-6 rounded-md bg-gray-200 dark:bg-gray-700" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-1/3 rounded-md bg-gray-200 dark:bg-gray-700" />
                            <div className="mt-2 h-4 w-4/5 rounded-md bg-gray-200 dark:bg-gray-700" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="h-96 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  const activeElections = elections.filter((e) => e.status === "active");
  const upcomingElections = elections.filter((e) => e.status === "upcoming");
  const completedElections = elections.filter((e) => e.status === "completed");

  const totalEligibleVoters = elections.reduce((sum, election) => sum + (election.eligibleVoters ?? 0), 0);
  const totalVotes = elections.reduce((sum, election) => sum + (election.totalVotes ?? 0), 0);
  const overallParticipation = totalEligibleVoters > 0 ? (totalVotes / totalEligibleVoters) * 100 : 0;

        return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
               <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Elections</CardTitle>
            <VoteIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{elections.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeElections.length} active, {upcomingElections.length} upcoming
            </p>
                 </CardContent>
               </Card>
               <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEligibleVoters.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all elections</p>
                 </CardContent>
               </Card>
               <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes Cast</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVotes.toLocaleString()}</div>
             <p className="text-xs text-muted-foreground">System-wide votes</p>
                 </CardContent>
               </Card>
               <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Participation</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallParticipation.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average turnout rate</p>
                 </CardContent>
               </Card>
             </div>

       <Card>
        <CardHeader>
          <CardTitle>Active Elections</CardTitle>
          <CardDescription>Overview of elections currently in progress.</CardDescription>
        </CardHeader>
        <CardContent>
            {activeElections.length > 0 ? (
                 <div className="space-y-4">
                    {activeElections.map((election) => {
                        const participation = election.eligibleVoters > 0 ? (election.totalVotes / election.eligibleVoters) * 100 : 0;
        return (
                            <div key={election.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                                <div className="flex justify-between items-start">
                    <div>
                                        <h3 className="font-semibold">{election.name}</h3>
                                        <p className="text-sm text-muted-foreground">{election.description}</p>
                                         <p className="text-sm text-muted-foreground">
                                            Ends on: {new Date(election.endDate).toLocaleDateString()}
                                        </p>
                    </div>
                                    <Button variant="outline" size="sm" onClick={() => router.push(`/admin/dashboard/elections/${election.id}/results`)}>
                                        View Results
                    </Button>
                      </div>
                                <div className="mt-3">
                                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                        <span>Participation: {participation.toFixed(1)}%</span>
                                        <span>{(election.totalVotes ?? 0).toLocaleString()} / {(election.eligibleVoters ?? 0).toLocaleString()} voters</span>
                          </div>
                                    <Progress value={participation} className="h-2" />
                          </div>
                            </div>
                        )
                    })}
            </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No active elections at the moment.</p>
                    </div>
            )}
                </CardContent>
              </Card>
    </div>
  )
}
