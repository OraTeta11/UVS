"use client"

import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Trophy, Share2, Printer, FileText, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useRef, useEffect } from "react"
import { Chart, registerables } from "chart.js"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

Chart.register(...registerables)

export default function ElectionResultsPage({ params }: { params: { id: string } }) {
  const [chartView, setChartView] = useState("bar")
  const [selectedPosition, setSelectedPosition] = useState("president")
  const [exportFormat, setExportFormat] = useState("pdf")

  const barChartRef = useRef<HTMLCanvasElement>(null)
  const pieChartRef = useRef<HTMLCanvasElement>(null)
  const timeChartRef = useRef<HTMLCanvasElement>(null)
  const facultyChartRef = useRef<HTMLCanvasElement>(null)

  const barChartInstance = useRef<Chart | null>(null)
  const pieChartInstance = useRef<Chart | null>(null)
  const timeChartInstance = useRef<Chart | null>(null)
  const facultyChartInstance = useRef<Chart | null>(null)

  // Mock election results data
  const election = {
    id: params.id,
    title: "Student Guild Elections 2025",
    description: "Results for the student representative election for the 2025-2026 academic year",
    startDate: "May 10, 2025",
    endDate: "May 15, 2025",
    totalVotes: 1245,
    eligibleVoters: 3000,
    positions: ["President", "Vice President", "Secretary", "Treasurer"],
    results: {
      president: [
        {
          id: "c1",
          name: "Alice Uwimana",
          faculty: "Science and Technology",
          votes: 520,
          percentage: 41.8,
          image: "/placeholder.svg?height=100&width=100",
          isWinner: true,
          color: "#003B71",
        },
        {
          id: "c2",
          name: "Bob Mugisha",
          faculty: "Business and Economics",
          votes: 410,
          percentage: 32.9,
          image: "/placeholder.svg?height=100&width=100",
          isWinner: false,
          color: "#0056a8",
        },
        {
          id: "c3",
          name: "Claire Niyonzima",
          faculty: "Medicine and Health Sciences",
          votes: 315,
          percentage: 25.3,
          image: "/placeholder.svg?height=100&width=100",
          isWinner: false,
          color: "#3a95ff",
        },
      ],
      "vice president": [
        {
          id: "c4",
          name: "David Hakizimana",
          faculty: "Arts and Social Sciences",
          votes: 620,
          percentage: 49.8,
          image: "/placeholder.svg?height=100&width=100",
          isWinner: true,
          color: "#003B71",
        },
        {
          id: "c5",
          name: "Eva Mutoni",
          faculty: "Science and Technology",
          votes: 625,
          percentage: 50.2,
          image: "/placeholder.svg?height=100&width=100",
          isWinner: false,
          color: "#0056a8",
        },
      ],
      secretary: [
        {
          id: "c6",
          name: "Frank Mugabo",
          faculty: "Business and Economics",
          votes: 780,
          percentage: 62.7,
          image: "/placeholder.svg?height=100&width=100",
          isWinner: true,
          color: "#003B71",
        },
        {
          id: "c7",
          name: "Grace Umutesi",
          faculty: "Education",
          votes: 465,
          percentage: 37.3,
          image: "/placeholder.svg?height=100&width=100",
          isWinner: false,
          color: "#0056a8",
        },
      ],
      treasurer: [
        {
          id: "c8",
          name: "Henry Ndayishimiye",
          faculty: "Business and Economics",
          votes: 890,
          percentage: 71.5,
          image: "/placeholder.svg?height=100&width=100",
          isWinner: true,
          color: "#003B71",
        },
        {
          id: "c9",
          name: "Irene Mukamana",
          faculty: "Science and Technology",
          votes: 355,
          percentage: 28.5,
          image: "/placeholder.svg?height=100&width=100",
          isWinner: false,
          color: "#0056a8",
        },
      ],
    },
    votingStats: {
      totalRegistered: 3000,
      totalVoted: 1245,
      participationRate: 41.5,
      invalidVotes: 12,
      blankVotes: 5,
      facultyParticipation: [
        { name: "Science and Technology", rate: 48.2, voters: 520 },
        { name: "Business and Economics", rate: 45.7, voters: 410 },
        { name: "Medicine and Health Sciences", rate: 42.3, voters: 315 },
        { name: "Arts and Social Sciences", rate: 38.5, voters: 280 },
        { name: "Education", rate: 36.9, voters: 220 },
        { name: "Law", rate: 35.2, voters: 180 },
        { name: "Agriculture", rate: 33.8, voters: 150 },
      ],
      timeDistribution: [
        { time: "6-8 AM", votes: 120 },
        { time: "8-10 AM", votes: 180 },
        { time: "10-12 PM", votes: 210 },
        { time: "12-2 PM", votes: 190 },
        { time: "2-4 PM", votes: 240 },
        { time: "4-6 PM", votes: 280 },
        { time: "6-8 PM", votes: 220 },
        { time: "8-10 PM", votes: 90 },
        { time: "10-12 AM", votes: 45 },
      ],
      deviceTypes: [
        { type: "Mobile", count: 720, percentage: 57.8 },
        { type: "Desktop", count: 410, percentage: 32.9 },
        { type: "Tablet", count: 115, percentage: 9.3 },
      ],
      verificationMethods: [
        { method: "Facial Recognition", count: 980, percentage: 78.7 },
        { method: "Manual Verification", count: 265, percentage: 21.3 },
      ],
    },
  }

  const participationRate = (election.totalVotes / election.eligibleVoters) * 100
  const selectedCandidates = election.results[selectedPosition as keyof typeof election.results] || []

  // Create and update charts
  useEffect(() => {
    // Bar chart
    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext("2d")
      if (ctx) {
        if (barChartInstance.current) {
          barChartInstance.current.destroy()
        }

        barChartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: selectedCandidates.map((candidate) => candidate.name),
            datasets: [
              {
                label: "Votes",
                data: selectedCandidates.map((candidate) => candidate.votes),
                backgroundColor: selectedCandidates.map((candidate) => candidate.color),
                borderWidth: 0,
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const votes = context.raw as number
                    const percentage = (votes / election.totalVotes) * 100
                    return `${votes} votes (${percentage.toFixed(1)}%)`
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Number of Votes",
                },
              },
            },
          },
        })
      }
    }

    // Pie chart
    if (pieChartRef.current) {
      const ctx = pieChartRef.current.getContext("2d")
      if (ctx) {
        if (pieChartInstance.current) {
          pieChartInstance.current.destroy()
        }

        pieChartInstance.current = new Chart(ctx, {
          type: "pie",
          data: {
            labels: selectedCandidates.map((candidate) => candidate.name),
            datasets: [
              {
                data: selectedCandidates.map((candidate) => candidate.votes),
                backgroundColor: selectedCandidates.map((candidate) => candidate.color),
                borderWidth: 1,
                borderColor: "#fff",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const votes = context.raw as number
                    const percentage = (votes / election.totalVotes) * 100
                    return `${votes} votes (${percentage.toFixed(1)}%)`
                  },
                },
              },
            },
          },
        })
      }
    }

    // Time distribution chart
    if (timeChartRef.current) {
      const ctx = timeChartRef.current.getContext("2d")
      if (ctx) {
        if (timeChartInstance.current) {
          timeChartInstance.current.destroy()
        }

        timeChartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: election.votingStats.timeDistribution.map((item) => item.time),
            datasets: [
              {
                label: "Votes Cast",
                data: election.votingStats.timeDistribution.map((item) => item.votes),
                borderColor: "#003B71",
                backgroundColor: "rgba(0, 59, 113, 0.1)",
                tension: 0.3,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Number of Votes",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Time of Day",
                },
              },
            },
          },
        })
      }
    }

    // Faculty participation chart
    if (facultyChartRef.current) {
      const ctx = facultyChartRef.current.getContext("2d")
      if (ctx) {
        if (facultyChartInstance.current) {
          facultyChartInstance.current.destroy()
        }

        facultyChartInstance.current = new Chart(ctx, {
          type: "horizontalBar",
          data: {
            labels: election.votingStats.facultyParticipation.map((item) => item.name),
            datasets: [
              {
                label: "Participation Rate (%)",
                data: election.votingStats.facultyParticipation.map((item) => item.rate),
                backgroundColor: election.votingStats.facultyParticipation.map((_, index) => {
                  const opacity = 0.6 + index * 0.05
                  return `rgba(0, 59, 113, ${opacity})`
                }),
                borderWidth: 0,
                borderRadius: 4,
              },
            ],
          },
          options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: "Participation Rate (%)",
                },
              },
            },
          },
        } as any)
      }
    }

    return () => {
      if (barChartInstance.current) barChartInstance.current.destroy()
      if (pieChartInstance.current) pieChartInstance.current.destroy()
      if (timeChartInstance.current) timeChartInstance.current.destroy()
      if (facultyChartInstance.current) facultyChartInstance.current.destroy()
    }
  }, [selectedPosition, selectedCandidates, election.totalVotes, election.votingStats])

  const handleExport = () => {
    // In a real application, this would generate and download the report
    alert(`Exporting results as ${exportFormat.toUpperCase()}...`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${election.title} - Results`,
          text: `Check out the results for the ${election.title}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error))
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Could not copy text: ", err))
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <AdminHeader title="Election Results" description={`View detailed results for ${election.title}`} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center text-[#003B71] hover:underline mb-4 sm:mb-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <div className="flex items-center">
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="w-[100px] h-9">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="ml-2" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <div>
                <CardTitle className="text-2xl text-[#003B71]">{election.title}</CardTitle>
                <CardDescription className="mt-1">{election.description}</CardDescription>
              </div>
              <div className="flex items-center mt-4 md:mt-0 text-sm text-gray-500">
                <Clock className="mr-2 h-4 w-4" />
                <span>
                  {election.startDate} - {election.endDate}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Votes Cast</h3>
                <p className="text-2xl font-bold">{election.totalVotes}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Eligible Voters</h3>
                <p className="text-2xl font-bold">{election.eligibleVoters}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Voter Participation</h3>
                <p className="text-2xl font-bold">{participationRate.toFixed(1)}%</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Voter Participation</span>
                <span>{participationRate.toFixed(1)}%</span>
              </div>
              <Progress value={participationRate} className="h-2" />
            </div>

            <Tabs defaultValue="results" className="mt-8">
              <TabsList className="mb-4">
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                <TabsTrigger value="raw-data">Raw Data</TabsTrigger>
              </TabsList>

              <TabsContent value="results">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Position:</span>
                    <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Position" />
                      </SelectTrigger>
                      <SelectContent>
                        {election.positions.map((position) => (
                          <SelectItem key={position} value={position.toLowerCase().replace(/\s+/g, " ")}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">View:</span>
                    <Select value={chartView} onValueChange={setChartView}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Chart Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                        <SelectItem value="table">Table</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {chartView === "table" ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Candidate</TableHead>
                          <TableHead>Faculty</TableHead>
                          <TableHead className="text-right">Votes</TableHead>
                          <TableHead className="text-right">Percentage</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCandidates.map((candidate) => (
                          <TableRow key={candidate.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <Image
                                  src={candidate.image || "/placeholder.svg"}
                                  alt={candidate.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full mr-2"
                                />
                                {candidate.name}
                              </div>
                            </TableCell>
                            <TableCell>{candidate.faculty}</TableCell>
                            <TableCell className="text-right">{candidate.votes}</TableCell>
                            <TableCell className="text-right">{candidate.percentage}%</TableCell>
                            <TableCell className="text-center">
                              {candidate.isWinner ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <Trophy className="h-3 w-3 mr-1" />
                                  Winner
                                </span>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="text-lg font-medium mb-4">
                      {selectedPosition.charAt(0).toUpperCase() + selectedPosition.slice(1)} Results
                    </h3>
                    <div className="h-80">
                      {chartView === "bar" ? <canvas ref={barChartRef}></canvas> : <canvas ref={pieChartRef}></canvas>}
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  {selectedCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className={`relative flex items-start space-x-4 p-4 rounded-lg border ${
                        candidate.isWinner ? "border-[#003B71] bg-blue-50" : "border-gray-200"
                      }`}
                    >
                      {candidate.isWinner && (
                        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                          <div className="bg-[#003B71] text-white p-2 rounded-full">
                            <Trophy className="h-5 w-5" />
                          </div>
                        </div>
                      )}

                      <div className="flex-shrink-0">
                        <Image
                          src={candidate.image || "/placeholder.svg"}
                          alt={candidate.name}
                          width={80}
                          height={80}
                          className="rounded-full"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium">
                              {candidate.name}
                              {candidate.isWinner && (
                                <span className="ml-2 text-sm font-normal text-[#003B71]">(Winner)</span>
                              )}
                            </h3>
                            <div className="text-sm text-gray-500 mt-1 mb-2">{candidate.faculty}</div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold">{candidate.votes}</p>
                            <p className="text-sm text-gray-500">votes</p>
                          </div>
                        </div>

                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Vote Percentage</span>
                            <span>{candidate.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${candidate.isWinner ? "bg-[#003B71]" : "bg-gray-400"}`}
                              style={{ width: `${candidate.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Voting Time Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <canvas ref={timeChartRef}></canvas>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Device Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {election.votingStats.deviceTypes.map((device, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{device.type}</span>
                              <span>
                                {device.count} votes ({device.percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-[#003B71]"
                                style={{
                                  width: `${device.percentage}%`,
                                  opacity: 0.7 + index * 0.1,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-6" />

                      <h4 className="text-sm font-medium mb-4">Verification Methods</h4>
                      <div className="space-y-4">
                        {election.votingStats.verificationMethods.map((method, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{method.method}</span>
                              <span>
                                {method.count} votes ({method.percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-[#003B71]"
                                style={{
                                  width: `${method.percentage}%`,
                                  opacity: 0.7 + index * 0.1,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Key Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Votes</h3>
                          <p className="text-2xl font-bold">{election.totalVotes}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Invalid Votes</h3>
                          <p className="text-2xl font-bold">{election.votingStats.invalidVotes}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Blank Votes</h3>
                          <p className="text-2xl font-bold">{election.votingStats.blankVotes}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Participation Rate</h3>
                          <p className="text-2xl font-bold">{election.votingStats.participationRate}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="demographics">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Faculty Participation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <canvas ref={facultyChartRef}></canvas>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Faculty Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Faculty</TableHead>
                            <TableHead className="text-right">Voters</TableHead>
                            <TableHead className="text-right">Rate (%)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {election.votingStats.facultyParticipation.map((faculty, index) => (
                            <TableRow key={index}>
                              <TableCell>{faculty.name}</TableCell>
                              <TableCell className="text-right">{faculty.voters}</TableCell>
                              <TableCell className="text-right">{faculty.rate}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="raw-data">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Raw Election Data</CardTitle>
                    <CardDescription>Download the complete dataset for further analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-[#003B71] mr-2" />
                          <div>
                            <p className="font-medium">Complete Election Results</p>
                            <p className="text-sm text-gray-500">All votes and candidate data</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download CSV
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-[#003B71] mr-2" />
                          <div>
                            <p className="font-medium">Voter Demographics</p>
                            <p className="text-sm text-gray-500">Anonymized voter data</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download CSV
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-[#003B71] mr-2" />
                          <div>
                            <p className="font-medium">Voting Time Data</p>
                            <p className="text-sm text-gray-500">Timestamps and voting patterns</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download CSV
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
