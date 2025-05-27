"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  Plus,
  Search,
  Trash2,
  Users,
  VoteIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

function ElectionCard({ election }: ElectionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-[#003B71]"
      case "upcoming":
        return "bg-orange-500"
      case "completed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
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
        return "Unknown"
    }
  }

  const votePercentage = (election.totalVotes / election.eligibleVoters) * 100 || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-[#003B71]">{election.title}</CardTitle>
          <Badge className={getStatusColor(election.status)}>{getStatusText(election.status)}</Badge>
        </div>
        <CardDescription className="text-sm">{election.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        <div className="flex items-center text-xs">
          <Clock className="mr-1 h-3 w-3 text-gray-500" />
          <span>
            {election.startDate} - {election.endDate}
          </span>
        </div>
        <div className="flex items-center text-xs">
          <Users className="mr-1 h-3 w-3 text-gray-500" />
          <span>Positions: {election.positions.join(", ")}</span>
        </div>
        <div className="flex items-center text-xs">
          <VoteIcon className="mr-1 h-3 w-3 text-gray-500" />
          <span>Votes: {election.totalVotes} of {election.eligibleVoters}</span>
        </div>

        <div className="space-y-2">
           <Progress value={votePercentage} aria-label={`${votePercentage.toFixed(1)}% election progress`} className="h-2" />
           <p className="text-xs text-gray-600 text-right">{votePercentage.toFixed(1)}% Participation</p>
        </div>

        <div className="flex space-x-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            <Eye className="mr-1 h-3 w-3" />
            View Results
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs">
             <Edit className="mr-1 h-3 w-3" />
             Edit
          </Button>
           <Button variant="destructive" size="sm" className="flex-1 text-xs">
             <Trash2 className="mr-1 h-3 w-3" />
             Delete
           </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ElectionCardProps {
  election: {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    totalVotes: number;
    eligibleVoters: number;
    positions: string[];
  };
}

export default function ElectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const elections = [
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
    },
    {
      id: 2,
      title: "Faculty of Science Representative",
      description: "Select your faculty representative for the academic council",
      startDate: "May 8, 2025",
      endDate: "May 12, 2025",
      status: "active",
      totalVotes: 310,
      eligibleVoters: 450,
      positions: ["Faculty Representative"],
    },
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
    },
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
    },
  ]

  const filteredElections = elections.filter(
    (election) =>
      election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      election.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-8">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-[#003B71]">Elections</h2>
          <p className="text-gray-600">Manage all university elections</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search elections..."
              className="pl-8 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-[#003B71] hover:bg-[#002a52]">
            <Plus className="mr-2 h-4 w-4" />
            <div>Create Election</div>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Elections</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 gap-6">
            {filteredElections.map((election) => (
              <ElectionCard key={election.id} election={election} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="grid grid-cols-1 gap-6">
            {filteredElections
              .filter((election) => election.status === "active")
              .map((election) => (
                <ElectionCard key={election.id} election={election} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 gap-6">
            {filteredElections
              .filter((election) => election.status === "upcoming")
              .map((election) => (
                <ElectionCard key={election.id} election={election} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid grid-cols-1 gap-6">
            {filteredElections
              .filter((election) => election.status === "completed")
              .map((election) => (
                <ElectionCard key={election.id} election={election} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 