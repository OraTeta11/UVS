"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  TrendingUp,
  PieChart,
  Calendar,
  Download,
  Filter,
  Users2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";
import { format, subMonths } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DemographicsChart } from "@/components/analytics/demographics-chart";
import { ParticipationTrendsChart } from "@/components/analytics/participation-trends-chart";
import { VoterTurnoutChart } from "@/components/analytics/voter-turnout-chart";
import { VotingTimeChart } from "@/components/analytics/voting-time-chart";
import { ElectionComparisonChart } from "@/components/analytics/election-comparison-chart";

export default function AnalyticsPage() {
  // Analytics states
  const [date, setDate] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 6),
    to: new Date(),
  });
  const [selectedElection, setSelectedElection] = useState<string>("all");
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>(["all"]);
  const [selectedYears, setSelectedYears] = useState<string[]>(["all"]);
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("all");

  // Chart visibility states
  const [showDemographics, setShowDemographics] = useState(false);
  const [showParticipation, setShowParticipation] = useState(false);
  const [showTurnout, setShowTurnout] = useState(false);
  const [showTiming, setShowTiming] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Analytics mock data
  const keyMetrics = {
    totalVoters: 3245,
    activeVoters: 2876,
    averageTurnout: 78.5,
    topFaculty: "Science and Technology",
    topFacultyRate: 86.2,
    lowestFaculty: "Arts and Social Sciences",
    lowestFacultyRate: 64.8,
  };

  const faculties = [
    "Science and Technology",
    "Business and Economics",
    "Medicine and Health Sciences",
    "Arts and Social Sciences",
    "Education",
    "Law",
    "Agriculture",
  ];

  const studyYears = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Postgraduate"];

  const analyticsElections = [
    {
      id: "1",
      title: "Student Guild Elections 2025",
      date: "May 2025",
      turnout: 82.3,
      maleVotes: 600,
      femaleVotes: 550,
    },
    {
      id: "2",
      title: "Faculty Representatives 2025",
      date: "March 2025",
      turnout: 76.8,
      maleVotes: 500,
      femaleVotes: 450,
    },
    {
      id: "3",
      title: "Department Heads Selection",
      date: "February 2025",
      turnout: 68.5,
      maleVotes: 400,
      femaleVotes: 350,
    },
    {
      id: "4",
      title: "Student Council Elections 2024",
      date: "November 2024",
      turnout: 79.2,
      maleVotes: 600,
      femaleVotes: 550,
    },
  ];

  // Analytics helper functions
  const toggleFaculty = (faculty: string) => {
    if (faculty === "all") {
      setSelectedFaculties(["all"]);
      return;
    }
    let newSelection = selectedFaculties.filter((f) => f !== "all");
    if (newSelection.includes(faculty)) {
      newSelection = newSelection.filter((f) => f !== faculty);
    } else {
      newSelection.push(faculty);
    }
    setSelectedFaculties(newSelection.length === 0 ? ["all"] : newSelection);
  };

  const toggleYear = (year: string) => {
    if (year === "all") {
      setSelectedYears(["all"]);
      return;
    }
    let newSelection = selectedYears.filter((y) => y !== "all");
    if (newSelection.includes(year)) {
      newSelection = newSelection.filter((y) => y !== year);
    } else {
      newSelection.push(year);
    }
    setSelectedYears(newSelection.length === 0 ? ["all"] : newSelection);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <div className="flex flex-wrap gap-2">
          <DatePickerWithRange date={date} setDate={setDate} />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Election</h4>
                  <Select value={selectedElection} onValueChange={setSelectedElection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select election" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Elections</SelectItem>
                      {analyticsElections.map((election) => (
                        <SelectItem key={election.id} value={election.id}>
                          {election.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Faculty</h4>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="faculty-all"
                        checked={selectedFaculties.includes("all")}
                        onCheckedChange={() => toggleFaculty("all")}
                      />
                      <Label htmlFor="faculty-all" className="text-sm">All Faculties</Label>
                    </div>
                    {faculties.map((faculty) => (
                      <div key={faculty} className="flex items-center space-x-2">
                        <Checkbox
                          id={`faculty-${faculty}`}
                          checked={selectedFaculties.includes(faculty)}
                          onCheckedChange={() => toggleFaculty(faculty)}
                          disabled={selectedFaculties.includes("all")}
                        />
                        <Label htmlFor={`faculty-${faculty}`} className="text-xs">
                          {faculty.length > 15 ? faculty.substring(0, 15) + "..." : faculty}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Year of Study</h4>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="year-all"
                        checked={selectedYears.includes("all")}
                        onCheckedChange={() => toggleYear("all")}
                      />
                      <Label htmlFor="year-all" className="text-sm">All Years</Label>
                    </div>
                    {studyYears.map((year) => (
                      <div key={year} className="flex items-center space-x-2">
                        <Checkbox
                          id={`year-${year}`}
                          checked={selectedYears.includes(year)}
                          onCheckedChange={() => toggleYear(year)}
                          disabled={selectedYears.includes("all")}
                        />
                        <Label htmlFor={`year-${year}`} className="text-xs">{year}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Gender</h4>
                  <Select value={selectedGender} onValueChange={setSelectedGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Age Group</h4>
                  <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Age Groups</SelectItem>
                      <SelectItem value="18-21">18-21</SelectItem>
                      <SelectItem value="22-25">22-25</SelectItem>
                      <SelectItem value="26-30">26-30</SelectItem>
                      <SelectItem value="31+">31+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button variant="outline" size="sm" className="h-9">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="h-5 w-5 text-[#003B71]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Voters</p>
                <p className="text-lg font-bold">{keyMetrics.totalVoters}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Active Voters</p>
                <p className="text-lg font-bold">{keyMetrics.activeVoters}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <PieChart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Average Turnout</p>
                <p className="text-lg font-bold">{keyMetrics.averageTurnout}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Top Faculty</p>
                <p className="text-lg font-bold">{keyMetrics.topFacultyRate}%</p>
                <p className="text-xs text-gray-500">{keyMetrics.topFaculty}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="demographics" className="mb-4">
        <TabsList className="mb-3">
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="participation">Participation Trends</TabsTrigger>
          <TabsTrigger value="turnout">Voter Turnout</TabsTrigger>
          <TabsTrigger value="timing">Voting Time Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Election Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="demographics">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-[#003B71]">Voter Demographics</CardTitle>
              <CardDescription className="text-sm">Detailed breakdown of voter demographics</CardDescription>
              <Button variant="outline" size="sm" onClick={() => setShowDemographics(!showDemographics)} className="mt-2">
                {showDemographics ? 'Hide Chart' : 'Show Chart'}
              </Button>
            </CardHeader>
            {showDemographics && (
              <CardContent>
                <div className="h-[250px]">
                  <DemographicsChart />
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="participation">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-[#003B71]">Participation Trends</CardTitle>
              <CardDescription className="text-sm">Voter participation trends over time</CardDescription>
              <Button variant="outline" size="sm" onClick={() => setShowParticipation(!showParticipation)} className="mt-2">
                {showParticipation ? 'Hide Chart' : 'Show Chart'}
              </Button>
            </CardHeader>
            {showParticipation && (
              <CardContent>
                <div className="h-[250px]">
                  <ParticipationTrendsChart />
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="turnout">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-[#003B71]">Voter Turnout Analysis</CardTitle>
              <CardDescription className="text-sm">Detailed analysis of voter turnout by demographics</CardDescription>
              <Button variant="outline" size="sm" onClick={() => setShowTurnout(!showTurnout)} className="mt-2">
                {showTurnout ? 'Hide Chart' : 'Show Chart'}
              </Button>
            </CardHeader>
            {showTurnout && (
              <CardContent>
                <div className="h-[250px]">
                  <VoterTurnoutChart />
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="timing">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-[#003B71]">Voting Time Analysis</CardTitle>
              <CardDescription className="text-sm">When voters cast their votes during election periods</CardDescription>
              <Button variant="outline" size="sm" onClick={() => setShowTiming(!showTiming)} className="mt-2">
                {showTiming ? 'Hide Chart' : 'Show Chart'}
              </Button>
            </CardHeader>
            {showTiming && (
              <CardContent>
                <div className="h-[250px]">
                  <VotingTimeChart />
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-[#003B71]">Election Comparison</CardTitle>
              <CardDescription className="text-sm">Compare turnout and participation across different elections</CardDescription>
              <Button variant="outline" size="sm" onClick={() => setShowComparison(!showComparison)} className="mt-2">
                {showComparison ? 'Hide Chart' : 'Show Chart'}
              </Button>
            </CardHeader>
            {showComparison && (
              <CardContent>
                <div className="h-[250px]">
                  <ElectionComparisonChart />
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Elections Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-[#003B71]">Recent Elections</CardTitle>
          <CardDescription className="text-sm">Voter turnout for recent elections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border">Election</th>
                  <th className="text-left p-2 border">Date</th>
                  <th className="text-center p-2 border">Turnout</th>
                  <th className="text-center p-2 border">M/F Ratio</th>
                  <th className="text-center p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {analyticsElections.map((election) => (
                  <tr key={election.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{election.title}</td>
                    <td className="p-2 border">{election.date}</td>
                    <td className="p-2 border text-center">{election.turnout}%</td>
                    <td className="p-2 border text-center">
                      {election.maleVotes && election.femaleVotes ? 
                        `${(election.maleVotes / election.femaleVotes).toFixed(2)}:1`
                        : 'N/A'}
                    </td>
                    <td className="p-2 border text-center">
                      <Badge variant={election.turnout > 75 ? "default" : "secondary"}>
                        {election.turnout > 75 ? "High" : "Medium"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 