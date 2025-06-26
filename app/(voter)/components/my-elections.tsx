"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock,
  Search,
  Users,
  VoteIcon,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/hooks/useAuth"
import { useElections } from "@/lib/hooks/useElections"

function ElectionCard({ election }: { election: any }) {
  const participationRate = (election.totalVotes / election.eligibleVoters) * 100 || 0

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl text-[#003B71]">{election.title}</CardTitle>
          <Badge
            variant={election.status === "active" ? "default" : "outline"}
            className={
              election.status === "active"
                ? "bg-[#003B71]"
                : election.status === "upcoming"
                ? "bg-orange-100 text-orange-800"
                : "bg-gray-100 text-gray-800"
            }
          >
            {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
          </Badge>
        </div>
        <CardDescription>{election.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-gray-500" />
            <span>
              {election.startDate} - {election.endDate}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4 text-gray-500" />
            <span>Positions: {election.positions?.join(", ") || "No positions"}</span>
          </div>

          {election.status === "active" && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Voter Participation</span>
                  <span>{participationRate.toFixed(1)}%</span>
                </div>
                <Progress value={participationRate} className="h-2" />
              </div>

              {!election.hasVoted ? (
                <div className="space-y-2">
                  <div className="flex items-center text-orange-600 text-sm">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    <span>{election.timeLeft || "Voting open"}</span>
                  </div>
                  <Button asChild className="w-full bg-[#003B71] hover:bg-[#002a52]">
                    <Link href={`/vote/${election.id}`}>
                      Cast Your Vote
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    <span>You have voted</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Results
                  </Button>
                </div>
              )}
            </>
          )}

          {election.status === "upcoming" && (
            <div className="space-y-2">
              <div className="flex items-center text-orange-600 text-sm">
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>{election.timeUntilStart || "Coming soon"}</span>
              </div>
              <Button variant="outline" className="w-full">
                View Candidates
              </Button>
            </div>
          )}

          {election.status === "completed" && election.results && (
            <>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="font-medium text-[#003B71] mb-1">Your Vote</p>
                <p className="text-sm">
                  Position: {election.yourVote?.position || "N/A"}
                </p>
                <p className="text-sm">
                  Candidate: {election.yourVote?.candidate || "N/A"}
                </p>
                <div className="border-t border-gray-200 my-2"></div>
                <p className="font-medium text-[#003B71] mb-1">Election Results</p>
                <p className="text-sm">
                  Winner: {election.results.winner} ({election.results.position})
                </p>
                <p className="text-sm">Total Votes: {election.results.votes}</p>
              </div>
              <Button variant="outline" className="w-full">
                View Detailed Results
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function MyElections() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const { user } = useAuth()
  const { elections, loading, error } = useElections(user?.id || '')

  // Group elections by status
  const groupedElections = {
    active: elections.filter(election => election.status === 'active'),
    upcoming: elections.filter(election => election.status === 'upcoming'),
    past: elections.filter(election => election.status === 'completed'),
  }

  const filteredElections = {
    active: groupedElections.active.filter(
      (election) =>
        election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        election.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    upcoming: groupedElections.upcoming.filter(
      (election) =>
        election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        election.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    past: groupedElections.past.filter(
      (election) =>
        election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        election.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003B71] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your elections...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Failed to load elections</p>
          <p className="text-sm text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#003B71]">My Elections</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search my elections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <VoteIcon className="h-6 w-6 text-[#003B71]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Elections</p>
                <p className="text-2xl font-bold">{groupedElections.active.length}</p>
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
                <p className="text-2xl font-bold">{groupedElections.upcoming.length}</p>
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
                <p className="text-2xl font-bold">{groupedElections.past.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Elections</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Elections</TabsTrigger>
          <TabsTrigger value="past">Past Elections</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredElections.active.length > 0 ? (
              filteredElections.active.map((election) => (
                <ElectionCard key={election.id} election={election} />
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                No active elections found
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredElections.upcoming.length > 0 ? (
              filteredElections.upcoming.map((election) => (
                <ElectionCard key={election.id} election={election} />
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                No upcoming elections found
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredElections.past.length > 0 ? (
              filteredElections.past.map((election) => (
                <ElectionCard key={election.id} election={election} />
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                No past elections found
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 