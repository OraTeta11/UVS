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
  Calendar,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"
import { format, subMonths } from "date-fns"
import { useRouter } from "next/navigation"
import { EditElectionModal } from '@/components/admin/EditElectionModal'
import { AddElectionModal } from '@/components/admin/AddElectionModal'
import { electionService } from '@/lib/services/elections'
import { toast } from 'sonner'
import { Election } from '@/lib/services/elections'

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
  onDelete: (electionId: number) => void;
  onEdit: (election: any) => void;
}

function ElectionCard({ election, onDelete, onEdit }: ElectionCardProps) {
  const router = useRouter();

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
    <>
      <Card className="border-none shadow-none">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg text-[#003B71]">{election.title}</CardTitle>
            <Badge className={getStatusColor(election.status)}>{getStatusText(election.status)}</Badge>
          </div>
          <CardDescription className="text-sm">{election.description}</CardDescription>
        </CardHeader>
        <CardContent>
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
            <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => router.push(`/admin/dashboard?view=results&electionId=${election.id}`)}>
              <Eye className="mr-1 h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => onEdit(election)}>
              <Edit className="mr-1 h-3 w-3" />
            </Button>
            <Button variant="destructive" size="sm" className="flex-1 text-xs" onClick={() => onDelete(election.id)}>
              <Trash2 className="mr-1 h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default function ElectionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const electionsPerPage = 3;
  const [date, setDate] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 12),
    to: new Date(),
  });

  // State for Edit Election Modal
  const [showEditElectionModal, setShowEditElectionModal] = useState(false);
  const [electionToEdit, setElectionToEdit] = useState<Election | null>(null);

  // State for Add Election Modal
  const [showAddElectionModal, setShowAddElectionModal] = useState(false);

  // Convert 'elections' from a const array to a state variable
  const [elections, setElections] = useState<Election[]>([
    {
      id: 1,
      title: "Student Guild Elections 2025",
      description: "Vote for your student representatives for the 2025-2026 academic year",
      startDate: "2025-05-10",
      endDate: "2025-05-15",
      status: "active",
      totalVotes: 520,
      eligibleVoters: 1200,
      positions: ["President", "Vice President", "Secretary", "Treasurer"],
    },
    {
      id: 2,
      title: "Faculty of Science Representative",
      description: "Select your faculty representative for the academic council",
      startDate: "2025-05-08",
      endDate: "2025-05-12",
      status: "active",
      totalVotes: 310,
      eligibleVoters: 450,
      positions: ["Faculty Representative"],
    },
    {
      id: 3,
      title: "Department Head Selection",
      description: "Vote for the new department head of Computer Science",
      startDate: "2025-05-20",
      endDate: "2025-05-25",
      status: "upcoming",
      totalVotes: 0,
      eligibleVoters: 120,
      positions: ["Department Head"],
    },
    {
      id: 4,
      title: "Student Council Elections 2024",
      description: "Vote for your student representatives for the 2024-2025 academic year",
      startDate: "2024-05-10",
      endDate: "2024-05-15",
      status: "completed",
      totalVotes: 980,
      eligibleVoters: 1150,
      positions: ["President", "Vice President", "Secretary", "Treasurer"],
    },
    {
      id: 5,
      title: "Alumni Association Board Election",
      description: "Elect new members to the Alumni Association Board",
      startDate: "2025-06-01",
      endDate: "2025-06-07",
      status: "upcoming",
      totalVotes: 0,
      eligibleVoters: 700,
      positions: ["Board Member"],
    },
    {
      id: 6,
      title: "Sports Club Committee Election",
      description: "Vote for the new sports club committee members",
      startDate: "2025-04-25",
      endDate: "2025-04-30",
      status: "active",
      totalVotes: 150,
      eligibleVoters: 200,
      positions: ["President", "Secretary"],
    }
  ]);
  const [loadingElections, setLoadingElections] = useState(false);

  // Handle Add Election
  const handleAddElection = () => {
    setShowAddElectionModal(true);
  };

  // Handle Save New Election
  const handleSaveNewElection = async (newElection: Partial<Election>) => {
    try {
      const createdElection = await electionService.createElection(newElection);
      setElections(prevElections => [...prevElections, createdElection]);
      toast.success("Election created successfully!");
      setShowAddElectionModal(false);
    } catch (error) {
      console.error("Error creating election:", error);
      toast.error("Failed to create election.");
    }
  };

  // Handle Edit Election
  const handleEditElection = (election: Election) => {
    setElectionToEdit(election);
    setShowEditElectionModal(true);
  };

  // Handle Save Edited Election
  const handleSaveEditedElection = async (updatedElection: Partial<Election>) => {
    if (!updatedElection.id) return;
    try {
      await electionService.updateElection(updatedElection.id as string, updatedElection);
      // Optimistically update the list or refetch
      setElections(prevElections => 
        prevElections.map(e => 
          e.id === updatedElection.id ? { ...e, ...updatedElection as Election } : e
        )
      );
      toast.success("Election updated successfully!");
      setShowEditElectionModal(false);
      setElectionToEdit(null);
    } catch (error) {
      console.error("Error updating election:", error);
      toast.error("Failed to update election.");
    }
  };

  // Handle Delete Election
  const handleDeleteElection = async (electionId: number) => {
    if (window.confirm("Are you sure you want to delete this election?")) {
      try {
        await electionService.deleteElection(electionId.toString()); // Convert to string for service
        setElections(prevElections => prevElections.filter(e => e.id !== electionId));
        toast.success("Election deleted successfully!");
      } catch (error) {
        console.error("Error deleting election:", error);
        toast.error("Failed to delete election.");
      }
    }
  };

  const filteredElections = elections.filter(
    (election) => {
      const matchesSearch = election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          election.description.toLowerCase().includes(searchQuery.toLowerCase());

      const electionStartDate = new Date(election.startDate);
      const electionEndDate = new Date(election.endDate);

      const matchesDate = !date?.from || !date?.to ||
                        (electionStartDate >= date.from && electionEndDate <= date.to);
      
      return matchesSearch && matchesDate;
    }
  );

  // Pagination logic
  const indexOfLastElection = currentPage * electionsPerPage;
  const indexOfFirstElection = indexOfLastElection - electionsPerPage;
  const currentElections = filteredElections.slice(indexOfFirstElection, indexOfLastElection);
  const totalPages = Math.ceil(filteredElections.length / electionsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Elections Card */}
        <Card className="col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <VoteIcon className="h-6 w-6 text-[#003B71]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Elections</p>
                <p className="text-xl font-bold">{elections.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between items-center mb-6 mt-8">
        <div className="flex gap-4">
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
          <DatePickerWithRange date={date} setDate={setDate} />
          <Button 
            style={{ background: '#003B71', color: 'white' }}
            onClick={handleAddElection}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Election
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-fit grid-cols-3 gap-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {loadingElections ? (
          <p className="text-center col-span-full">Loading elections...</p>
        ) : (
          <>
            <TabsContent value="all">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentElections.length === 0 ? (
                  <p className="text-center col-span-full">No elections found.</p>
                ) : (
                  currentElections.map((election) => (
                    <ElectionCard 
                      key={election.id} 
                      election={election} 
                      onDelete={handleDeleteElection}
                      onEdit={handleEditElection}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="active">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentElections
                  .filter((election) => election.status === "active")
                  .map((election) => (
                    <ElectionCard 
                      key={election.id} 
                      election={election} 
                      onDelete={handleDeleteElection}
                      onEdit={handleEditElection}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="upcoming">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentElections
                  .filter((election) => election.status === "upcoming")
                  .map((election) => (
                    <ElectionCard 
                      key={election.id} 
                      election={election} 
                      onDelete={handleDeleteElection}
                      onEdit={handleEditElection}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentElections
                  .filter((election) => election.status === "completed")
                  .map((election) => (
                    <ElectionCard 
                      key={election.id} 
                      election={election} 
                      onDelete={handleDeleteElection}
                      onEdit={handleEditElection}
                    />
                  ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ background: '#003B71', color: 'white' }}
          >
            Previous
          </Button>
          <Button
            size="sm"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ background: '#003B71', color: 'white' }}
          >
            Next
          </Button>
        </div>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Edit Election Modal */}
      <EditElectionModal
        isOpen={showEditElectionModal}
        onClose={() => setShowEditElectionModal(false)}
        onSave={handleSaveEditedElection}
        election={electionToEdit}
      />

      {/* Add Election Modal */}
      <AddElectionModal
        isOpen={showAddElectionModal}
        onClose={() => setShowAddElectionModal(false)}
        onAdd={handleSaveNewElection}
      />
    </div>
  );
} 