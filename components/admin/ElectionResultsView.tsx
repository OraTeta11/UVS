"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Users, VoteIcon, Calendar, BarChart3, Clock, Trophy, Share2, Printer, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Chart, registerables } from "chart.js"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image";
import Link from "next/link";

Chart.register(...registerables)

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

interface ElectionResultsViewProps {
  electionId: string;
}

export function ElectionResultsView({ electionId }: ElectionResultsViewProps) {
  const router = useRouter()
  const [election, setElection] = useState<ElectionResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [chartView, setChartView] = useState("bar")
  const [selectedPosition, setSelectedPosition] = useState("President")
  const [exportFormat, setExportFormat] = useState("pdf")

  const barChartRef = useRef<HTMLCanvasElement>(null)
  const pieChartRef = useRef<HTMLCanvasElement>(null)
  const timeChartRef = useRef<HTMLCanvasElement>(null)
  const facultyChartRef = useRef<HTMLCanvasElement>(null)

  const barChartInstance = useRef<Chart | null>(null)
  const pieChartInstance = useRef<Chart | null>(null)
  const timeChartInstance = useRef<Chart | null>(null)
  const facultyChartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    const fetchElectionResults = async () => {
      try {
        setLoading(true)
        const mockElection: ElectionResult = {
          id: parseInt(electionId),
          title: "Student Guild Elections 2025",
          description: "Vote for your student representatives for the 2025-2026 academic year",
          startDate: "2025-05-10",
          endDate: "2025-05-15",
          status: "completed",
          totalVotes: 520,
          eligibleVoters: 1200,
          positions: ["President", "Vice President", "Secretary", "Treasurer"],
          candidates: [
            { id: 1, name: "John Doe", position: "President", votes: 320, percentage: 61.5 },
            { id: 2, name: "Jane Smith", position: "President", votes: 200, percentage: 38.5 },
            { id: 3, name: "Mike Johnson", position: "Vice President", votes: 280, percentage: 53.8 },
            { id: 4, name: "Sarah Williams", position: "Vice President", votes: 240, percentage: 46.2 }
          ]
        }
        setElection(mockElection)
      } catch (error) {
        console.error("Error fetching election results:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchElectionResults()
  }, [electionId])

  useEffect(() => {
    if (!election) return;

    const selectedCandidates = election.candidates.filter((candidate) => candidate.position === selectedPosition)

    console.log('Election data:', election);
    console.log('Selected position:', selectedPosition);
    console.log('Filtered candidates for chart:', selectedCandidates);

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
                backgroundColor: selectedCandidates.map((candidate) => `rgba(0, 59, 113, ${candidate.percentage / 100 + 0.2})`),
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
                backgroundColor: selectedCandidates.map((candidate) => `rgba(0, 59, 113, ${candidate.percentage / 100 + 0.2})`),
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

    // Time distribution chart - using mock data for demonstration purposes
    if (timeChartRef.current) {
      const ctx = timeChartRef.current.getContext("2d")
      if (ctx) {
        if (timeChartInstance.current) {
          timeChartInstance.current.destroy()
        }

        const mockTimeDistribution = [
          { time: "6-8 AM", votes: 120 },
          { time: "8-10 AM", votes: 180 },
          { time: "10-12 PM", votes: 210 },
          { time: "12-2 PM", votes: 190 },
          { time: "2-4 PM", votes: 240 },
          { time: "4-6 PM", votes: 280 },
          { time: "6-8 PM", votes: 220 },
          { time: "8-10 PM", votes: 90 },
          { time: "10-12 AM", votes: 45 },
        ];

        timeChartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: mockTimeDistribution.map((item) => item.time),
            datasets: [
              {
                label: "Votes Cast",
                data: mockTimeDistribution.map((item) => item.votes),
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

    // Faculty participation chart - using mock data for demonstration purposes
    if (facultyChartRef.current) {
      const ctx = facultyChartRef.current.getContext("2d")
      if (ctx) {
        if (facultyChartInstance.current) {
          facultyChartInstance.current.destroy()
        }

        const mockFacultyParticipation = [
          { name: "Science and Technology", rate: 48.2, voters: 520 },
          { name: "Business and Economics", rate: 45.7, voters: 410 },
          { name: "Medicine and Health Sciences", rate: 42.3, voters: 315 },
          { name: "Arts and Social Sciences", rate: 38.5, voters: 280 },
          { name: "Education", rate: 36.9, voters: 220 },
          { name: "Law", rate: 35.2, voters: 180 },
          { name: "Agriculture", rate: 33.8, voters: 150 },
        ];

        facultyChartInstance.current = new Chart(ctx, {
          type: "horizontalBar",
          data: {
            labels: mockFacultyParticipation.map((item) => item.name),
            datasets: [
              {
                label: "Participation Rate (%)",
                data: mockFacultyParticipation.map((item) => item.rate),
                backgroundColor: mockFacultyParticipation.map((_, index) => {
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
  }, [selectedPosition, election])

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading election results...</p>
      </div>
    )
  }

  if (!election) {
    return (
      <div className="p-8">
        <p>Election not found</p>
      </div>
    )
  }

  const participationRate = (election.totalVotes / election.eligibleVoters) * 100
  const selectedCandidates = election.candidates.filter((candidate) => candidate.position === selectedPosition)

  return (
    <>
      {/* <AdminHeader title="Election Results" description={`View detailed results for ${election.title}`} /> */}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/dashboard?section=elections')}
            className="inline-flex items-center text-[#003B71] hover:underline mb-4 sm:mb-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Elections
          </Button>
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={() => console.log("Exporting results...")}>
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
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
                  {format(new Date(election.startDate), "MMM d, yyyy")} -{" "}
                  {format(new Date(election.endDate), "MMM d, yyyy")}
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
                          <TableHead>Votes</TableHead>
                          <TableHead>Percentage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCandidates.map((candidate) => (
                          <TableRow key={candidate.id}>
                            <TableCell>{candidate.name}</TableCell>
                            <TableCell>{candidate.votes}</TableCell>
                            <TableCell>{candidate.percentage}%</TableCell>
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
                        candidate.percentage === Math.max(...selectedCandidates.map((c) => c.percentage)) ? "border-[#003B71] bg-blue-50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <Image
                          src={"/placeholder.svg"}
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
                            </h3>
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
                              className={`h-2.5 rounded-full ${candidate.percentage === Math.max(...selectedCandidates.map((c) => c.percentage)) ? "bg-[#003B71]" : "bg-gray-400"}`}
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
                        {[ // Mock Data for Device Usage
                          { name: "Mobile", votes: 720, percentage: 57.8 },
                          { name: "Desktop", votes: 410, percentage: 32.9 },
                          { name: "Tablet", votes: 115, percentage: 9.3 },
                        ].map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{item.name}</span>
                              <span>
                                {item.votes} votes ({item.percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">                              <div
                                className="h-2 rounded-full bg-[#003B71]"
                                style={{
                                  width: `${item.percentage}%`,
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
                        {[ // Mock Data for Verification Methods
                          { name: "Facial Recognition", votes: 980, percentage: 78.7 },
                          { name: "Manual Verification", votes: 265, percentage: 21.3 },
                        ].map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{item.name}</span>
                              <span>
                                {item.votes} votes ({item.percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-[#003B71]"
                                style={{
                                  width: `${item.percentage}%`,
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
                          <p className="text-2xl font-bold">{12}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Blank Votes</h3>
                          <p className="text-2xl font-bold">{5}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Participation Rate</h3>
                          <p className="text-2xl font-bold">{participationRate.toFixed(1)}%</p>
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
                          {[ // Mock Data for Faculty Breakdown
                            { name: "Science and Technology", voters: 520, rate: 48.2 },
                            { name: "Business and Economics", voters: 410, rate: 45.7 },
                            { name: "Medicine and Health Sciences", voters: 315, rate: 42.3 },
                            { name: "Arts and Social Sciences", voters: 280, rate: 38.5 },
                            { name: "Education", voters: 220, rate: 36.9 },
                            { name: "Law", voters: 180, rate: 35.2 },
                            { name: "Agriculture", voters: 150, rate: 33.8 },
                          ].map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell className="text-right">{item.voters}</TableCell>
                              <TableCell className="text-right">{item.rate}%</TableCell>
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