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

const myElections = {
  active: [
    {
      id: 1,
      title: "Student Guild Elections 2025",
      description: "Vote for your student representatives for the 2025-2026 academic year",
      startDate: "May 10, 2025",
      endDate: "May 15, 2025",
      status: "active",
      totalVotes: 520,
      eligibleVoters: 1200,
      positions: ["President", "Vice President", "Secretary", "Treasurer"],
      hasVoted: false,
      timeLeft: "3 days left",
    },
  ],
  upcoming: [
    {
      id: 3,
      title: "Department Head Selection",
      description: "Vote for the new department head of Computer Science",
      startDate: "May 20, 2025",
      endDate: "May 25, 2025",
      status: "upcoming",
      totalVotes: 0,
      eligibleVoters: 120,
      positions: ["Department Head"],
      timeUntilStart: "5 days until start",
    },
  ],
  past: [
    {
      id: 4,
      title: "Student Council Elections 2024",
      description: "Vote for your student representatives for the 2024-2025 academic year",
      startDate: "May 10, 2024",
      endDate: "May 15, 2024",
      status: "completed",
      totalVotes: 980,
      eligibleVoters: 1150,
      positions: ["President", "Vice President", "Secretary", "Treasurer"],
      hasVoted: true,
      results: {
        winner: "John Doe",
        position: "President",
        votes: 1245,
      },
      yourVote: {
        position: "President",
        candidate: "John Doe",
      },
    },
  ],
}

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
            <span>Positions: {election.positions.join(", ")}</span>
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
                    <span>{election.timeLeft}</span>
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
                <span>{election.timeUntilStart}</span>
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
                  Position: {election.yourVote.position}
                </p>
                <p className="text-sm">
                  Candidate: {election.yourVote.candidate}
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

  const filteredElections = {
    active: myElections.active.filter(
      (election) =>
        election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        election.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    upcoming: myElections.upcoming.filter(
      (election) =>
        election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        election.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    past: myElections.past.filter(
      (election) =>
        election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        election.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
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
                <p className="text-2xl font-bold">{myElections.active.length}</p>
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
                <p className="text-2xl font-bold">{myElections.upcoming.length}</p>
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
                <p className="text-2xl font-bold">{myElections.past.length}</p>
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
            {filteredElections.active.map((election) => (
              <ElectionCard key={election.id} election={election} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredElections.upcoming.map((election) => (
              <ElectionCard key={election.id} election={election} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredElections.past.map((election) => (
              <ElectionCard key={election.id} election={election} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 