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
  LayoutDashboard,
  CircleUser,
  Home,
  Settings,
  ClipboardList,
  User2,
  Users2,
  Menu,
  LogOut,
} from "lucide-react"
import AnalyticsPage from "./analytics/page"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import ElectionsPage from "./elections/page"

export default function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

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

  const renderContent = () => {
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
        return <ElectionsPage />;
      case 'candidates':
        return (
          <div className="p-8">
            <h2 className="text-xl font-bold mb-4">Candidates Management</h2>
            <div className="flex items-center mb-4">
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <Button className="ml-auto bg-[#003B71] hover:bg-[#003B71]/90">
                <Plus className="mr-2 h-4 w-4" /> Add Candidate
              </Button>
            </div>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Position</th>
                  <th className="py-2 px-4 border-b text-left">Faculty</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[ // Mock data for candidates
                  { id: 1, name: 'John Doe', position: 'President', faculty: 'Science & Tech', status: 'verified' },
                ].map(candidate => (
                  <tr key={candidate.id}>
                    <td className="py-2 px-4 border-b">{candidate.name}</td>
                    <td className="py-2 px-4 border-b">{candidate.position}</td>
                    <td className="py-2 px-4 border-b">{candidate.faculty}</td>
                    <td className="py-2 px-4 border-b">
                      {candidate.status === 'verified' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'voters':
        return (
          <div className="p-8">
            <h2 className="text-xl font-bold mb-4">Voters Management</h2>
            <div className="flex items-center mb-4">
              <Input
                placeholder="Search voters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <Button className="ml-auto">Export List</Button>
            </div>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Student ID</th>
                  <th className="py-2 px-4 border-b text-left">Faculty</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[ // Mock data for voters
                  { id: 1, name: 'Jane Smith', studentId: 'UR2023045', faculty: 'Business', status: 'verified' },
                ].map(voter => (
                  <tr key={voter.id}>
                    <td className="py-2 px-4 border-b">{voter.name}</td>
                    <td className="py-2 px-4 border-b">{voter.studentId}</td>
                    <td className="py-2 px-4 border-b">{voter.faculty}</td>
                    <td className="py-2 px-4 border-b">
                      {voter.status === 'verified' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <Button variant="outline" size="sm" className="mr-2">Verify</Button>
                      <User2 className="h-5 w-5 text-red-500 cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
             <Users2 className="mr-2 h-4 w-4" />
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
         {renderContent()}
      </div>
    </div>
  )
}
