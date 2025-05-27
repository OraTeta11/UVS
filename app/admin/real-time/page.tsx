"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Activity, AlertCircle, BarChart3, Clock, Download, RefreshCw, Timer, Users } from "lucide-react"
import { LiveVoterCountChart } from "@/components/analytics/live-voter-count-chart"
import { LiveVotingRateChart } from "@/components/analytics/live-voting-rate-chart"
import { LiveFacultyBreakdownChart } from "@/components/analytics/live-faculty-breakdown-chart"
import { LiveVotingHeatmapChart } from "@/components/analytics/live-voting-heatmap-chart"
import { RealtimeVoterList } from "@/components/analytics/realtime-voter-list"
import { useWebSocket } from "@/hooks/use-websocket"

export default function RealTimeAnalyticsPage() {
  const [selectedElection, setSelectedElection] = useState<string>("1")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState("overview")

  // Mock active elections
  const activeElections = [
    {
      id: "1",
      title: "Student Guild Elections 2025",
      startDate: "May 10, 2025",
      endDate: "May 15, 2025",
      isActive: true,
    },
    {
      id: "2",
      title: "Faculty Representatives 2025",
      startDate: "March 5, 2025",
      endDate: "March 10, 2025",
      isActive: true,
    },
  ]

  // Get the selected election
  const election = activeElections.find((e) => e.id === selectedElection) || activeElections[0]

  // Mock real-time metrics
  const [metrics, setMetrics] = useState({
    totalEligibleVoters: 3245,
    currentVoterCount: 1258,
    votesInLastHour: 124,
    votesInLastFiveMinutes: 18,
    currentVotingRate: 3.6, // votes per minute
    peakVotingRate: 5.8, // votes per minute
    peakVotingTime: "12:30 PM",
    malePercentage: 53,
    femalePercentage: 47,
    facultyBreakdown: [
      { name: "Science and Technology", count: 320, percentage: 25.4 },
      { name: "Business and Economics", count: 285, percentage: 22.7 },
      { name: "Medicine and Health Sciences", count: 210, percentage: 16.7 },
      { name: "Arts and Social Sciences", count: 180, percentage: 14.3 },
      { name: "Education", count: 145, percentage: 11.5 },
      { name: "Law", count: 78, percentage: 6.2 },
      { name: "Agriculture", count: 40, percentage: 3.2 },
    ],
    recentVoters: [] as { id: string; time: string; faculty: string }[],
  })

  // WebSocket connection for real-time updates
  const { lastMessage, connectionStatus } = useWebSocket(
    process.env.NEXT_PUBLIC_WEBSOCKET_URL || "wss://echo.websocket.org",
  )

  // Process incoming WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data)
        if (data.type === "voting_update" && data.electionId === selectedElection) {
          // Update metrics with new data
          setMetrics((prevMetrics) => ({
            ...prevMetrics,
            currentVoterCount: data.currentVoterCount || prevMetrics.currentVoterCount,
            votesInLastHour: data.votesInLastHour || prevMetrics.votesInLastHour,
            votesInLastFiveMinutes: data.votesInLastFiveMinutes || prevMetrics.votesInLastFiveMinutes,
            currentVotingRate: data.currentVotingRate || prevMetrics.currentVotingRate,
            // Add other updates as needed
          }))

          // Update last updated time
          setLastUpdated(new Date())
        }
      } catch (e) {
        console.error("Error parsing WebSocket message:", e)
      }
    }
  }, [lastMessage, selectedElection])

  // Simulate real-time updates for demo purposes
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      // Simulate random fluctuations in voting metrics
      const randomChange = () => Math.floor(Math.random() * 11) - 5 // -5 to +5
      const randomSmallChange = () => Math.floor(Math.random() * 5) - 2 // -2 to +2
      const randomPercentage = () => Math.max(0, Math.min(100, Math.random() * 2 - 1 + Math.random() * 2 - 1)) // Small random change

      setMetrics((prev) => {
        // Calculate new voter count (always increasing overall)
        const newVoterCount = prev.currentVoterCount + Math.max(1, randomChange() + 3)

        // Generate a new recent voter
        const faculties = prev.facultyBreakdown.map((f) => f.name)
        const newVoter = {
          id: `voter-${Date.now()}`,
          time: new Date().toLocaleTimeString(),
          faculty: faculties[Math.floor(Math.random() * faculties.length)],
        }

        // Keep only the 10 most recent voters
        const recentVoters = [newVoter, ...prev.recentVoters].slice(0, 10)

        // Update faculty breakdown to reflect new voter
        const facultyBreakdown = prev.facultyBreakdown.map((faculty) => {
          if (faculty.name === newVoter.faculty) {
            return {
              ...faculty,
              count: faculty.count + 1,
              percentage: Number.parseFloat((((faculty.count + 1) / newVoterCount) * 100).toFixed(1)),
            }
          }
          return {
            ...faculty,
            percentage: Number.parseFloat(((faculty.count / newVoterCount) * 100).toFixed(1)),
          }
        })

        return {
          ...prev,
          currentVoterCount: newVoterCount,
          votesInLastHour: prev.votesInLastHour + randomSmallChange() + 1,
          votesInLastFiveMinutes: Math.max(0, prev.votesInLastFiveMinutes + randomSmallChange()),
          currentVotingRate: Number.parseFloat((prev.currentVotingRate + (Math.random() * 0.4 - 0.2)).toFixed(1)),
          malePercentage: Math.max(45, Math.min(55, prev.malePercentage + randomPercentage())),
          femalePercentage: Math.max(45, Math.min(55, prev.femalePercentage + randomPercentage())),
          facultyBreakdown,
          recentVoters,
        }
      })

      setLastUpdated(new Date())
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])

  // Format the last updated time
  const formattedLastUpdated = lastUpdated.toLocaleTimeString()

  // Calculate participation rate
  const participationRate = (metrics.currentVoterCount / metrics.totalEligibleVoters) * 100

  return (
    <>
      <AdminHeader
        title="Real-Time Voting Analytics"
        description="Monitor live voting activity during active elections"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Election selector and controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Select value={selectedElection} onValueChange={setSelectedElection}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select active election" />
              </SelectTrigger>
              <SelectContent>
                {activeElections.map((election) => (
                  <SelectItem key={election.id} value={election.id}>
                    {election.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Badge variant="outline" className="ml-2">
              <Clock className="mr-1 h-4 w-4" />
              {election.startDate} - {election.endDate}
            </Badge>
          </div>

          <div className="flex gap-2 items-center">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? "bg-[#003B71]" : ""}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${autoRefresh ? "animate-spin" : ""}`} />
              {autoRefresh ? "Auto-Refreshing" : "Start Auto-Refresh"}
            </Button>

            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Connection status */}
        {connectionStatus !== "Open" && (
          <Alert variant="warning" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Status: {connectionStatus}</AlertTitle>
            <AlertDescription>
              {connectionStatus === "Connecting"
                ? "Connecting to the real-time data feed..."
                : "Connection to the real-time data feed is closed or has encountered an error. Data may not be current."}
            </AlertDescription>
          </Alert>
        )}

        {/* Last updated indicator */}
        <div className="flex items-center justify-end mb-4 text-sm text-gray-500">
          <Clock className="mr-1 h-4 w-4" />
          Last updated: {formattedLastUpdated}
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-[#003B71]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Voter Count</p>
                  <p className="text-2xl font-bold">{metrics.currentVoterCount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">
                    {participationRate.toFixed(1)}% of {metrics.totalEligibleVoters.toLocaleString()} eligible
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Voting Rate</p>
                  <p className="text-2xl font-bold">{metrics.currentVotingRate}/min</p>
                  <p className="text-xs text-gray-500">
                    Peak: {metrics.peakVotingRate}/min at {metrics.peakVotingTime}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Timer className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Hour</p>
                  <p className="text-2xl font-bold">{metrics.votesInLastHour} votes</p>
                  <p className="text-xs text-gray-500">Last 5 min: {metrics.votesInLastFiveMinutes} votes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender Distribution</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{Math.round(metrics.malePercentage)}% M</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-lg font-bold">{Math.round(metrics.femalePercentage)}% F</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall participation progress */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-[#003B71]">Overall Participation</CardTitle>
            <CardDescription>
              {metrics.currentVoterCount.toLocaleString()} out of {metrics.totalEligibleVoters.toLocaleString()}{" "}
              eligible voters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Participation Rate</span>
                <span>{participationRate.toFixed(1)}%</span>
              </div>
              <Progress value={participationRate} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Detailed analytics tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="voting-rate">Voting Rate</TabsTrigger>
            <TabsTrigger value="faculty-breakdown">Faculty Breakdown</TabsTrigger>
            <TabsTrigger value="heatmap">Time Heatmap</TabsTrigger>
            <TabsTrigger value="recent-voters">Recent Voters</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#003B71]">Live Voter Count</CardTitle>
                <CardDescription>Real-time tracking of votes cast during the election</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <LiveVoterCountChart
                    currentCount={metrics.currentVoterCount}
                    totalEligible={metrics.totalEligibleVoters}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voting-rate">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#003B71]">Live Voting Rate</CardTitle>
                <CardDescription>Votes per minute in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <LiveVotingRateChart currentRate={metrics.currentVotingRate} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faculty-breakdown">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#003B71]">Faculty Breakdown</CardTitle>
                <CardDescription>Live distribution of voters by faculty</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <LiveFacultyBreakdownChart facultyData={metrics.facultyBreakdown} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heatmap">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#003B71]">Voting Time Heatmap</CardTitle>
                <CardDescription>Visualize when voters are most active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <LiveVotingHeatmapChart />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent-voters">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#003B71]">Recent Voters</CardTitle>
                <CardDescription>Live feed of recent voting activity (anonymized)</CardDescription>
              </CardHeader>
              <CardContent>
                <RealtimeVoterList voters={metrics.recentVoters} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Faculty participation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-[#003B71]">Faculty Participation</CardTitle>
            <CardDescription>Live voter turnout by faculty</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.facultyBreakdown.map((faculty) => (
                <div key={faculty.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <span className="text-sm">{faculty.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{faculty.count} votes</span>
                      <span className="text-sm font-medium w-16 text-right">{faculty.percentage}%</span>
                    </div>
                  </div>
                  <Progress value={faculty.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
