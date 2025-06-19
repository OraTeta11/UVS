"use client"

import { useState, useEffect } from "react"
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
  LayoutDashboard,
  CircleUser,
  Home,
  Settings,
  ClipboardList,
  User2,
  Users2,
  Menu,
  LogOut,
  Filter,
  X,
  UserCheck,
} from "lucide-react"
import AnalyticsPage from "./analytics/page"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import ElectionsPage from "./elections/page"
import { VotesTable } from '@/components/admin/VotesTable'
import { voteService } from '@/lib/services/votes'
import { Vote, Candidate, User } from '@/types'
import { CandidatesTable } from '@/components/admin/CandidatesTable'
import { candidateService } from '@/lib/services/positions'
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AddCandidateModal } from '@/components/admin/AddCandidateModal';
import { AddVoterModal } from '@/components/admin/AddVoterModal';
import { userService } from '@/lib/services/users';
import { ElectionResultsView } from "@/components/admin/ElectionResultsView";

export default function AdminDashboardPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [votes, setVotes] = useState<Vote[]>([])
  const [loadingVotes, setLoadingVotes] = useState(true)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loadingCandidates, setLoadingCandidates] = useState(true)
  const router = useRouter()
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Modal states
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [showAddVoterModal, setShowAddVoterModal] = useState(false);

  // State for users (for AddCandidateModal and future user management)
  const [users, setUsers] = useState<User[]>([]);

  // Local Search states for Candidates and Voters sections
  const [candidatesSearchQuery, setCandidatesSearchQuery] = useState("");
  const [votersSearchQuery, setVotersSearchQuery] = useState("");

  // Filter states
  const [selectedElectionId, setSelectedElectionId] = useState<string>("all");
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>(["all"]);
  const [selectedYears, setSelectedYears] = useState<string[]>(["all"]);

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
  ];

  // Mock data for filter options (matching analytics page)
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

  const activeCount = elections.filter((e) => e.status === "active").length;
  const upcomingCount = elections.filter((e) => e.status === "upcoming").length;
  const completedCount = elections.filter((e) => e.status === "completed").length;

  const totalEligibleVoters = elections.reduce((sum, election) => sum + election.eligibleVoters, 0);
  const totalVotes = elections.reduce((sum, election) => sum + election.totalVotes, 0);
  const participationRate = totalEligibleVoters > 0 ? (totalVotes / totalEligibleVoters) * 100 : 0;

  // Dashboard Summary Elections Data (Mock)
  const dashboardElectionsSummary = [
    {
      id: 1,
      title: "Student Guild Elections 2025",
      status: "active",
      date: "May 10 - 15, 2025",
    },
    {
      id: 2,
      title: "Faculty of Science Representative",
      status: "active",
      date: "May 8 - 12, 2025",
    },
    {
      id: 3,
      title: "Department Head Selection",
      status: "upcoming",
      date: "May 20 - 25, 2025",
    },
  ];

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

  // Fetch candidates: filter by selectedElectionId, selectedFaculties, selectedYears, and candidatesSearchQuery
  useEffect(() => {
    if (activeSection === 'candidates') {
      setLoadingCandidates(true);
      candidateService.getCandidates(1).then(fetchedCandidates => {
        const filtered = fetchedCandidates.filter(candidate => {
          const matchesElection = selectedElectionId === "all" || candidate.electionId === parseInt(selectedElectionId);
          const matchesFaculty = selectedFaculties.includes("all") || (candidate.user?.department && selectedFaculties.includes(candidate.user.department));
          const matchesYear = selectedYears.includes("all") || (candidate.user?.studentId && studyYears[parseInt(candidate.user.studentId.substring(1,2)) -1] && selectedYears.includes(studyYears[parseInt(candidate.user.studentId.substring(1,2)) -1]));
          
          const matchesSearch = candidatesSearchQuery === "" || 
                                (candidate.user?.firstName.toLowerCase().includes(candidatesSearchQuery.toLowerCase())) ||
                                (candidate.user?.lastName.toLowerCase().includes(candidatesSearchQuery.toLowerCase())) ||
                                (candidate.user?.studentId.toLowerCase().includes(candidatesSearchQuery.toLowerCase())) ||
                                (candidate.manifesto?.toLowerCase().includes(candidatesSearchQuery.toLowerCase()));

          return matchesElection && matchesFaculty && matchesYear && matchesSearch;
        });
        setCandidates(filtered);
        setLoadingCandidates(false);
      }).catch(error => {
        console.error('Error fetching candidates:', error);
        setLoadingCandidates(false);
      });
    }
  }, [activeSection, selectedElectionId, selectedFaculties, selectedYears, candidatesSearchQuery]);

  // Fetch votes: filter by selectedElectionId, selectedFaculties, selectedYears, and votersSearchQuery
  useEffect(() => {
    if (activeSection === 'voters') {
      setLoadingVotes(true);
      voteService.getVotes(1).then(fetchedVotes => {
        const filtered = fetchedVotes.filter(vote => {
          const matchesElection = selectedElectionId === "all" || vote.electionId === parseInt(selectedElectionId);
          const matchesFaculty = selectedFaculties.includes("all") || (vote.user?.department && selectedFaculties.includes(vote.user.department));
          const matchesYear = selectedYears.includes("all") || (vote.user?.studentId && studyYears[parseInt(vote.user.studentId.substring(1,2)) -1] && selectedYears.includes(studyYears[parseInt(vote.user.studentId.substring(1,2)) -1]));

          const matchesSearch = votersSearchQuery === "" ||
                                (vote.user?.firstName.toLowerCase().includes(votersSearchQuery.toLowerCase())) ||
                                (vote.user?.lastName.toLowerCase().includes(votersSearchQuery.toLowerCase())) ||
                                (vote.user?.studentId.toLowerCase().includes(votersSearchQuery.toLowerCase())) ||
                                (vote.candidate?.user?.firstName.toLowerCase().includes(votersSearchQuery.toLowerCase())) ||
                                (vote.candidate?.user?.lastName.toLowerCase().includes(votersSearchQuery.toLowerCase()));
          
          return matchesElection && matchesFaculty && matchesYear && matchesSearch;
        });
        setVotes(filtered);
        setLoadingVotes(false);
      }).catch(error => {
        console.error('Error fetching votes:', error);
        setLoadingVotes(false);
      });
    }
  }, [activeSection, selectedElectionId, selectedFaculties, selectedYears, votersSearchQuery]);

  // Fetch users for modals (e.g., AddCandidateModal)
  useEffect(() => {
    userService.getUsers()
      .then(fetchedUsers => {
        setUsers(fetchedUsers);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleEdit = (candidate: Candidate) => {
    // Implement edit logic using candidateService
    candidateService.updateCandidate(1, candidate.positionId, candidate.id, { verified: !candidate.verified })
      .then(() => {
        setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, verified: !c.verified } : c));
      })
      .catch(error => console.error('Error updating candidate:', error));
  };

  const handleDelete = (candidate: Candidate) => {
    // Implement delete logic using candidateService
    candidateService.deleteCandidate(1, candidate.positionId, candidate.id)
      .then(() => {
        setCandidates(prev => prev.filter(c => c.id !== candidate.id));
      })
      .catch(error => console.error('Error deleting candidate:', error));
  };

  const handleAddCandidate = () => {
    setShowAddCandidateModal(true);
  };

  const handleSaveNewCandidate = (newCandidateData: Partial<Candidate>) => {
    if (newCandidateData.userId && newCandidateData.positionId) {
      candidateService.addCandidate(1, newCandidateData.positionId, newCandidateData)
        .then(response => {
          // Optimistically update the UI, or refetch if needed
          const addedCandidate = { 
            ...newCandidateData, 
            id: response.id, 
            electionId: 1, // Assuming default election ID for now
            voteCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            user: users.find(u => u.id === newCandidateData.userId) // Add user details for display
          } as Candidate;
          setCandidates(prev => [...prev, addedCandidate]);
          setShowAddCandidateModal(false);
        })
        .catch(error => {
          console.error('Error adding candidate:', error);
          alert('Failed to add candidate.');
        });
    }
  };

  const handleDeleteVote = (vote: Vote) => {
    // Implement delete vote logic using voteService
    voteService.deleteVote(1, vote.id)
      .then(() => {
        setVotes(prev => prev.filter(v => v.id !== vote.id));
      })
      .catch(error => console.error('Error deleting vote:', error));
  };

  const handleAddVoter = () => {
    setShowAddVoterModal(true);
  };

  const handleSaveNewVoter = (newVoterData: Partial<User>) => {
    userService.addUser(newVoterData)
      .then(response => {
        // Optimistically update the UI or refetch if needed
        setUsers(prev => [...prev, response]); // Add new voter to the users list
        // If voters table uses `users` directly, it will update. Otherwise, may need to refetch votes.
        // For now, let's assume refetching votes is the simplest way to reflect new voter.
        if (activeSection === 'voters') {
          setLoadingVotes(true);
          voteService.getVotes(1).then(fetchedVotes => {
            setVotes(fetchedVotes);
            setLoadingVotes(false);
          }).catch(error => {
            console.error('Error refetching votes after adding voter:', error);
            setLoadingVotes(false);
          });
        }
        setShowAddVoterModal(false);
      })
      .catch(error => {
        console.error('Error adding voter:', error);
        alert('Failed to add voter.');
      });
  };

  // Function to get the title for the header
  const getHeaderTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Dashboard';
      case 'elections': return 'Elections';
      case 'candidates': return 'Candidates';
      case 'voters': return 'Voters';
      case 'analytics': return 'Analytics';
      case 'users': return 'Users';
      default: return 'Admin Dashboard';
    }
  };

  const renderContent = () => {
    // Check if the current path is for election results
    const viewParam = searchParams.get('view');
    const electionIdParam = searchParams.get('electionId');

    if (viewParam === 'results' && electionIdParam) {
      // Make sure we are in the elections section logically if you want to highlight it
      // For now, just render the component
      return <ElectionResultsView electionId={electionIdParam} />;
    }

    switch (activeSection) {
      case 'dashboard':
        return (
           <div className="p-8">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
               {/* Completed Elections Card */}
               <Card>
                 <CardContent className="p-6">
                   <div className="flex items-center space-x-4">
                     <div className="bg-green-100 p-3 rounded-full">
                       <CheckCircle2 className="h-6 w-6 text-green-600" />
                     </div>
                     <div>
                       <p className="text-sm text-gray-500">Completed Elections</p>
                       <p className="text-xl font-bold">{completedCount}</p>
                     </div>
                   </div>
                 </CardContent>
               </Card>

               {/* Upcoming Elections Card */}
               <Card>
                 <CardContent className="p-6">
                   <div className="flex items-center space-x-4">
                     <div className="bg-orange-100 p-3 rounded-full">
                       <CalendarDays className="h-6 w-6 text-orange-600" />
                     </div>
                     <div>
                       <p className="text-sm text-gray-500">Upcoming Elections</p>
                       <p className="text-xl font-bold">{upcomingCount}</p>
                     </div>
                   </div>
                 </CardContent>
               </Card>

               {/* Active Elections Card */}
               <Card>
                 <CardContent className="p-6">
                   <div className="flex items-center space-x-4">
                     <div className="bg-blue-100 p-3 rounded-full">
                       <VoteIcon className="h-6 w-6 text-[#003B71]" />
                     </div>
                     <div>
                       <p className="text-sm text-gray-500">Active Elections</p>
                       <p className="text-xl font-bold">{activeCount}</p>
                     </div>
                   </div>
                 </CardContent>
               </Card>

               {/* Voter Participation Card */}
               <Card>
                 <CardContent className="p-6">
                   <div className="flex items-center space-x-4">
                     <div className="bg-purple-100 p-3 rounded-full">
                       <Users className="h-6 w-6 text-purple-600" />
                     </div>
                     <div>
                       <p className="text-sm text-gray-500">Voter Participation</p>
                       <p className="text-xl font-bold">{participationRate.toFixed(1)}%</p>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             </div>

             {/* Recent/Upcoming Elections Summary */}
             <div className="mt-8">
               <h3 className="text-xl font-bold text-[#003B71] mb-4">Recent / Upcoming Elections</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {dashboardElectionsSummary.map(election => (
                   <Card key={election.id}>
                     <CardContent className="p-4">
                       <div className="flex justify-between items-center">
                         <div>
                           <p className="text-sm font-semibold text-[#003B71]">{election.title}</p>
                           <p className="text-xs text-gray-600">{election.date}</p>
                         </div>
                         <Badge variant={election.status === 'active' ? 'default' : 'secondary'} className={election.status === 'active' ? 'bg-[#003B71]' : ''}>
                           {election.status}
                         </Badge>
                       </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>
             </div>
           </div>
        );
      case 'elections':
        return (
          <div className="p-8">
            <ElectionsPage />
          </div>
        );
      case 'candidates':
        return (
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Total Candidates Card */}
              <Card className="col-span-1">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Candidates</p>
                      <p className="text-xl font-bold">{candidates.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Search, Filters and Add Button for Candidates */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#003B71]">Candidates</h2>
              <div className="flex items-center gap-4">
                
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
                        <Select value={selectedElectionId} onValueChange={setSelectedElectionId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select election" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Elections</SelectItem>
                            {elections.map((electionItem) => (
                              <SelectItem key={electionItem.id} value={electionItem.id.toString()}>
                                {electionItem.title}
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
                              id="faculty-all-candidates"
                              checked={selectedFaculties.includes("all")}
                              onCheckedChange={() => toggleFaculty("all")}
                            />
                            <Label htmlFor="faculty-all-candidates" className="text-sm">All Faculties</Label>
                          </div>
                          {faculties.map((faculty) => (
                            <div key={faculty} className="flex items-center space-x-2">
                              <Checkbox
                                id={`faculty-${faculty}-candidates`}
                                checked={selectedFaculties.includes(faculty)}
                                onCheckedChange={() => toggleFaculty(faculty)}
                                disabled={selectedFaculties.includes("all")}
                              />
                              <Label htmlFor={`faculty-${faculty}-candidates`} className="text-xs">
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
                              id="year-all-candidates"
                              checked={selectedYears.includes("all")}
                              onCheckedChange={() => toggleYear("all")}
                            />
                            <Label htmlFor="year-all-candidates" className="text-sm">All Years</Label>
                          </div>
                          {studyYears.map((year) => (
                            <div key={year} className="flex items-center space-x-2">
                              <Checkbox
                                id={`year-${year}-candidates`}
                                checked={selectedYears.includes(year)}
                                onCheckedChange={() => toggleYear(year)}
                                disabled={selectedYears.includes("all")}
                              />
                              <Label htmlFor={`year-${year}-candidates`} className="text-xs">
                                {year}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button onClick={handleAddCandidate} style={{ background: '#003B71', color: 'white' }}>Add Candidate</Button>
              </div>
            </div>
            {loadingCandidates ? (
              <div>Loading candidates...</div>
            ) : (
              <CandidatesTable data={candidates} onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAddCandidate} />
            )}
          </div>
        );
      case 'voters':
        return (
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Total Votes (Voters) Card */}
              <Card className="col-span-1">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-teal-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Voters</p>
                      <p className="text-xl font-bold">{votes.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Search, Filters and Add Button for Voters */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#003B71]">Voters</h2>
              <div className="flex items-center gap-4">
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
                        <Select value={selectedElectionId} onValueChange={setSelectedElectionId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select election" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Elections</SelectItem>
                            {elections.map((electionItem) => (
                              <SelectItem key={electionItem.id} value={electionItem.id.toString()}>
                                {electionItem.title}
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
                              id="faculty-all-voters"
                              checked={selectedFaculties.includes("all")}
                              onCheckedChange={() => toggleFaculty("all")}
                            />
                            <Label htmlFor="faculty-all-voters" className="text-sm">All Faculties</Label>
                          </div>
                          {faculties.map((faculty) => (
                            <div key={faculty} className="flex items-center space-x-2">
                              <Checkbox
                                id={`faculty-${faculty}-voters`}
                                checked={selectedFaculties.includes(faculty)}
                                onCheckedChange={() => toggleFaculty(faculty)}
                                disabled={selectedFaculties.includes("all")}
                              />
                              <Label htmlFor={`faculty-${faculty}-voters`} className="text-xs">
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
                              id="year-all-voters"
                              checked={selectedYears.includes("all")}
                              onCheckedChange={() => toggleYear("all")}
                            />
                            <Label htmlFor="year-all-voters" className="text-sm">All Years</Label>
                          </div>
                          {studyYears.map((year) => (
                            <div key={year} className="flex items-center space-x-2">
                              <Checkbox
                                id={`year-${year}-voters`}
                                checked={selectedYears.includes(year)}
                                onCheckedChange={() => toggleYear(year)}
                                disabled={selectedYears.includes("all")}
                              />
                              <Label htmlFor={`year-${year}-voters`} className="text-xs">
                                {year}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button onClick={handleAddVoter} style={{ background: '#003B71', color: 'white' }}>Add Voter</Button>
              </div>
            </div>
            {loadingVotes ? (
              <div>Loading votes...</div>
            ) : (
              <VotesTable data={votes} onDelete={handleDeleteVote} onAdd={handleAddVoter} />
            )}
          </div>
        );
      case 'analytics':
        return <AnalyticsPage />;
      case 'users':
         // TODO: Import and render a component for managing users (e.g., <AdminUsersListComponent />).
         // Note: This might be similar to 'Voters', clarify requirements and consolidate if needed.
         return <div className="p-8"><h2>Manage Users Content</h2></div>;
      default:
        return <div className="p-8"><h2>Admin Dashboard</h2></div>;
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-[#003B71] text-white flex flex-col transition-all duration-300`}>
        <div className="p-4 border-b border-[#002a52] flex items-center justify-between">
          {!isSidebarCollapsed && (
             <div className="flex items-center">
               <div>
                 <p className="font-semibold">Admin</p>
                 <p className="text-sm text-gray-300">ADMIN001</p>
               </div>
             </div>
          )}
           <Button variant="ghost" size="icon" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="text-white hover:bg-[#002a52] ml-auto">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <nav className="flex-1 px-2 py-2 space-y-2 overflow-y-auto pb-0">
          <div
            onClick={() => setActiveSection('dashboard')}
            className={`flex items-center px-3 py-2 rounded-md hover:bg-[#002a52] cursor-pointer ${activeSection === 'dashboard' ? 'bg-[#002a52]' : ''}`}
          >
            <Home className="mr-2 h-4 w-4" />
            {!isSidebarCollapsed && <span className="text-xs">Dashboard</span>}
          </div>
          <div
            onClick={() => setActiveSection('elections')}
             className={`flex items-center px-3 py-2 rounded-md hover:bg-[#002a52] cursor-pointer ${activeSection === 'elections' ? 'bg-[#002a52]' : ''}`}
          >
            <VoteIcon className="mr-2 h-4 w-4" />
            {!isSidebarCollapsed && <span className="text-xs">Elections</span>}
          </div>
           <div
             onClick={() => setActiveSection('candidates')}
             className={`flex items-center px-3 py-2 rounded-md hover:bg-[#002a52] cursor-pointer ${activeSection === 'candidates' ? 'bg-[#002a52]' : ''}`}
           >
             <UserCheck className="mr-2 h-4 w-4" />
             {!isSidebarCollapsed && <span className="text-xs">Candidates</span>}
          </div>
           <div
             onClick={() => setActiveSection('voters')}
             className={`flex items-center px-3 py-2 rounded-md hover:bg-[#002a52] cursor-pointer ${activeSection === 'voters' ? 'bg-[#002a52]' : ''}`}
           >
            <Users className="mr-2 h-4 w-4" />
            {!isSidebarCollapsed && <span className="text-xs">Voters</span>}
          </div>
           <div
             onClick={() => setActiveSection('analytics')}
             className={`flex items-center px-3 py-2 rounded-md hover:bg-[#002a52] cursor-pointer ${activeSection === 'analytics' ? 'bg-[#002a52]' : ''}`}
            >
            <BarChart3 className="mr-2 h-4 w-4" />
            {!isSidebarCollapsed && <span className="text-xs">Analytics</span>}
          </div>

        </nav>

          {/* Logout Option */}
          <div
            onClick={() => {
              // TODO: Implement logout logic here
              console.log("Logout clicked");
              // Example: Redirect to login page
              // window.location.href = '/login';
            }}
            className="flex items-center px-3 py-2 rounded-md hover:bg-[#002a52] cursor-pointer mb-2 mx-2"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {!isSidebarCollapsed && <span className="text-xs">Logout</span>}
          </div>

         <Button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="mt-auto mb-4 mx-2">
          {isSidebarCollapsed ? '>' : '<'}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
         {/* Main Header for all sections */}
        

         {renderContent()}

         {/* Add Candidate Modal */}
         <AddCandidateModal
           isOpen={showAddCandidateModal}
           onClose={() => setShowAddCandidateModal(false)}
           onAdd={handleSaveNewCandidate}
           positions={elections[0]?.positions.map((p, index) => ({ id: index + 1, title: p })) || []} // Mock positions
           users={users}
         />

         {/* Add Voter Modal */}
         <AddVoterModal
           isOpen={showAddVoterModal}
           onClose={() => setShowAddVoterModal(false)}
           onAdd={handleSaveNewVoter}
         />
      </div>
    </div>
  )
}
