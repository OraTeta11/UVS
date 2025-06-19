"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Users, BarChart3, CheckCircle2, VoteIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ElectionDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock election data
  const election = {
    id: params.id,
    title: "Student Guild Elections 2025",
    description: "Vote for your student representatives for the 2025-2026 academic year",
    startDate: "May 10, 2025",
    endDate: "May 15, 2025",
    status: "active",
    totalVotes: 980,
    eligibleVoters: 1150,
    positions: ["President", "Vice President", "Secretary", "Treasurer"],
    candidates: {
      president: [
        {
          id: "c1",
          name: "Alice Uwimana",
          faculty: "Science and Technology",
          year: "Year 3",
          manifesto: "I will work to improve student facilities and create more opportunities for academic growth.",
          image: "/placeholder.svg?height=100&width=100",
        },
        {
          id: "c2",
          name: "Bob Mugisha",
          faculty: "Business and Economics",
          year: "Year 4",
          manifesto: "My focus will be on enhancing student welfare and creating a more inclusive campus environment.",
          image: "/placeholder.svg?height=100&width=100",
        },
        {
          id: "c3",
          name: "Claire Niyonzima",
          faculty: "Medicine and Health Sciences",
          year: "Year 3",
          manifesto: "I plan to advocate for better healthcare services and mental health support for all students.",
          image: "/placeholder.svg?height=100&width=100",
        },
      ],
      "vice president": [
        {
          id: "c4",
          name: "David Hakizimana",
          faculty: "Arts and Social Sciences",
          year: "Year 4",
          manifesto: "I will focus on improving student-teacher relationships and academic support systems.",
          image: "/placeholder.svg?height=100&width=100",
        },
        {
          id: "c5",
          name: "Eva Mutoni",
          faculty: "Science and Technology",
          year: "Year 3",
          manifesto: "My goal is to enhance research opportunities and laboratory facilities for students.",
          image: "/placeholder.svg?height=100&width=100",
        },
      ],
    },
    hasVoted: false,
  }

  const participationRate = (election.totalVotes / election.eligibleVoters) * 100

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-[#003B71]"
      case "upcoming":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "completed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return "bg-gray-100"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "upcoming":
        return "Upcoming"
      case "completed":
        return "Completed"
      default:
        return status
    }
  }

  return (
    <div className="flex-1 p-8">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center text-[#003B71] hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <VoteIcon className="h-6 w-6 text-[#003B71]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Votes</p>
                <p className="text-2xl font-bold">{election.totalVotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Eligible Voters</p>
                <p className="text-2xl font-bold">{election.eligibleVoters}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Participation Rate</p>
                <p className="text-2xl font-bold">{participationRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-[#003B71]">{election.title}</CardTitle>
              <CardDescription className="mt-1">{election.description}</CardDescription>
            </div>
            <Badge
              variant={election.status === "active" ? "default" : "outline"}
              className={getStatusColor(election.status)}
            >
              {getStatusText(election.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Date Range</h3>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <span>
                  {election.startDate} - {election.endDate}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Positions</h3>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-gray-500" />
                <span>{election.positions.join(", ")}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Voter Participation</h3>
              <div className="flex items-center">
                <BarChart3 className="mr-2 h-4 w-4 text-gray-500" />
                <span>
                  {election.totalVotes} / {election.eligibleVoters} ({participationRate.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {election.status === "active" && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Participation Progress</span>
                <span>{participationRate.toFixed(1)}%</span>
              </div>
              <Progress value={participationRate} className="h-2" />
            </div>
          )}

          {!election.hasVoted && election.status === "active" && (
            <Button className="w-full bg-[#003B71] hover:bg-[#002a52]">
              <Link href={`/vote/${election.id}`}>Cast Your Vote</Link>
            </Button>
          )}

          {election.hasVoted && (
            <div className="flex items-center justify-center text-green-600 bg-green-50 p-4 rounded-lg">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              <span>You have cast your vote in this election</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="rules">Rules & Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Election Overview</CardTitle>
              <CardDescription>Important information about this election</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Eligibility</h3>
                <p className="text-gray-600">
                  All registered students of the University of Rwanda are eligible to vote in this election.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Voting Process</h3>
                <p className="text-gray-600">
                  The voting process requires face verification to ensure the integrity of the election. Each student can
                  vote once for each position.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Results</h3>
                <p className="text-gray-600">
                  Results will be announced after the election period ends. The candidate with the majority of votes for
                  each position will be declared the winner.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates">
          <div className="space-y-6">
            {election.positions.map((position) => (
              <Card key={position}>
                <CardHeader>
                  <CardTitle>{position}</CardTitle>
                  <CardDescription>Meet the candidates running for {position}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {election.candidates[position.toLowerCase() as keyof typeof election.candidates]?.map((candidate) => (
                      <Card key={candidate.id}>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            <img
                              src={candidate.image}
                              alt={candidate.name}
                              className="w-24 h-24 rounded-full mb-4 object-cover"
                            />
                            <h3 className="font-semibold text-lg">{candidate.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">
                              {candidate.faculty} • {candidate.year}
                            </p>
                            <p className="text-sm text-gray-600">{candidate.manifesto}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Rules & Guidelines</CardTitle>
              <CardDescription>Important rules and guidelines for this election</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Voting Rules</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Each student can vote once for each position</li>
                  <li>Face verification is required to cast your vote</li>
                  <li>Votes cannot be changed once submitted</li>
                  <li>Voting is anonymous and secure</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Code of Conduct</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Respect all candidates and their views</li>
                  <li>No campaigning within 50 meters of polling stations</li>
                  <li>No sharing of voting credentials</li>
                  <li>Report any suspicious activity to election officials</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Important Dates</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Registration Period: April 1 - April 30, 2025</li>
                  <li>Campaign Period: May 1 - May 9, 2025</li>
                  <li>Voting Period: May 10 - May 15, 2025</li>
                  <li>Results Announcement: May 16, 2025</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 