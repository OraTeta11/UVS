"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, CheckCircle2, Clock, Users, VoteIcon, Home, Settings, LayoutDashboard, CircleUser, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const activeElections = [
    {
      id: 1,
      title: "Student Guild Elections 2025",
      description: "Vote for your student representatives for the 2025-2026 academic year",
      startDate: "May 10, 2025",
      endDate: "May 15, 2025",
      status: "active",
      positions: ["President", "Vice President", "Secretary", "Treasurer"],
      hasVoted: false,
    },
    {
      id: 2,
      title: "Faculty of Science Representative",
      description: "Select your faculty representative for the academic council",
      startDate: "May 8, 2025",
      endDate: "May 12, 2025",
      status: "active",
      positions: ["Faculty Representative"],
      hasVoted: true,
    },
  ]

  const upcomingElections = [
    {
      id: 3,
      title: "Department Head Selection",
      description: "Vote for the new department head of Computer Science",
      startDate: "May 20, 2025",
      endDate: "May 25, 2025",
      status: "upcoming",
      positions: ["Department Head"],
      hasVoted: false,
    },
  ]

  const pastElections = [
    {
      id: 4,
      title: "Student Council Elections 2024",
      description: "Vote for your student representatives for the 2024-2025 academic year",
      startDate: "May 10, 2024",
      endDate: "May 15, 2024",
      status: "completed",
      positions: ["President", "Vice President", "Secretary", "Treasurer"],
      hasVoted: true,
      results: {
        winner: "John Doe",
        position: "President",
        votes: 1245,
      },
    },
  ]

  return (
    <div className="flex min-h-screen">
      <div className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-[#003B71] text-white flex flex-col transition-all duration-300`}>
        <div className="p-4 border-b border-[#002a52] flex items-center">
          <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
          {!isSidebarCollapsed && (
            <div>
              <p className="font-semibold">Voter Name</p>
              <p className="text-sm text-gray-300">Student ID: 12345</p>
            </div>
          )}
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          <Link href="/dashboard" className="flex items-center px-3 py-2 rounded-md hover:bg-[#002a52]">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            {!isSidebarCollapsed && <span>Dashboard Home</span>}
          </Link>
          <Link href="/elections" className="flex items-center px-3 py-2 rounded-md hover:bg-[#002a52]">
            <VoteIcon className="mr-2 h-4 w-4" />
            {!isSidebarCollapsed && <span>My Elections</span>}
          </Link>
          <Link href="/profile" className="flex items-center px-3 py-2 rounded-md hover:bg-[#002a52]">
            <CircleUser className="mr-2 h-4 w-4" />
            {!isSidebarCollapsed && <span>My Profile</span>}
          </Link>
          <div
            onClick={() => {
              // TODO: Implement voter logout logic here
              console.log("Voter Logout clicked");
              // Example: Redirect to login page
              // window.location.href = '/login';
            }}
            className="flex items-center px-3 py-2 rounded-md hover:bg-[#002a52] cursor-pointer mb-4 mx-2"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {!isSidebarCollapsed && <span>Logout</span>}
          </div>
        </nav>
        {!isSidebarCollapsed && (
          <div className="p-4 text-xs text-gray-400 border-t border-[#002a52]">
            <p>Election Period:</p>
            <p>Start: May 10, 2025</p>
            <p>End: May 15, 2025</p>
          </div>
        )}
        <Button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="mt-auto mb-4 mx-2">
          {isSidebarCollapsed ? '>' : '<'}
        </Button>
      </div>

      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <VoteIcon className="h-6 w-6 text-[#003B71]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Elections</p>
                  <p className="text-2xl font-bold">{activeElections.length}</p>
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
                  <p className="text-sm text-gray-500">Completed Votes</p>
                  <p className="text-2xl font-bold">1</p>
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
                  <p className="text-2xl font-bold">{upcomingElections.length}</p>
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
              {activeElections.map((election) => (
                <Card key={election.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-[#003B71]">{election.title}</CardTitle>
                      <Badge
                        variant={election.hasVoted ? "outline" : "default"}
                        className={election.hasVoted ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-[#003B71]"}
                      >
                        {election.hasVoted ? "Voted" : "Not Voted"}
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

                      {!election.hasVoted ? (
                        <Button className="w-full bg-[#003B71] hover:bg-[#002a52]">
                          <Link href={`/vote/${election.id}`}>Cast Your Vote</Link>
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full">
                          <Link href={`/elections/${election.id}/results`}>View Results</Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingElections.map((election) => (
                <Card key={election.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-[#003B71]">{election.title}</CardTitle>
                      <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                        Upcoming
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

                      <Button variant="outline" className="w-full">
                        <Link href={`/elections/${election.id}/candidates`}>View Candidates</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastElections.map((election) => (
                <Card key={election.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-[#003B71]">{election.title}</CardTitle>
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                        Completed
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

                      {election.results && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="font-medium text-[#003B71] mb-1">Election Results</p>
                          <p className="text-sm">
                            Winner: {election.results.winner} ({election.results.position})
                          </p>
                          <p className="text-sm">Total Votes: {election.results.votes}</p>
                        </div>
                      )}

                      <Button variant="outline" className="w-full">
                        <Link href={`/elections/${election.id}/results`}>View Detailed Results</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
