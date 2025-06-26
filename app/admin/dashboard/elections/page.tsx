"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Election } from "@/types"
import { AddElectionModal } from "@/components/admin/AddElectionModal"
import { EditElectionModal } from "@/components/admin/EditElectionModal"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Edit, Trash2, Clock, Users, VoteIcon, Eye } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/useAuth"
import { ElectionCard } from "@/components/ui/ElectionCard"

export default function ElectionsPage() {
  const [elections, setElections] = useState<Election[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedElection, setSelectedElection] = useState<Election | null>(null)
  const router = useRouter()
  const { user } = useAuth();

  const fetchElections = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/elections', { cache: 'no-store' })
      if (!response.ok) throw new Error('Failed to fetch elections')
      const data = await response.json()
      setElections(data)
    } catch (error) {
      toast.error("Failed to fetch elections")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchElections()
  }, [])

  const handleEdit = (election: Election) => {
    setSelectedElection(election)
    setShowEditModal(true)
  }

  const handleDelete = async (electionId: number) => {
    if (!window.confirm("Are you sure you want to delete this election?")) return
    try {
      const response = await fetch(`/api/elections/${electionId}`, { method: 'DELETE' })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete election')
      }
      toast.success('Election deleted successfully')
      fetchElections()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleSave = async (updatedElection?: Partial<Election>) => {
    if (updatedElection && selectedElection) {
      try {
        const response = await fetch(`/api/elections/${selectedElection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedElection),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to update election')
        }
        toast.success('Election updated successfully')
      } catch (error: any) {
        toast.error(error.message)
        return
      }
    }
    fetchElections()
    setShowAddModal(false)
    setShowEditModal(false)
    setSelectedElection(null)
  }

  const handleAddElection = async (data: any) => {
    try {
      // 1. Create the election
      const response = await fetch('/api/elections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          createdBy: user?.id, // Use the admin's UUID
        }),
      });
      if (!response.ok) throw new Error('Failed to create election');
      const newElection = await response.json();

      // 2. Add positions if any
      if (data.positions && Array.isArray(data.positions) && data.positions.length > 0) {
        for (const title of data.positions) {
          if (title && title.trim()) {
            await fetch('/api/positions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                electionId: newElection.id,
                title: title.trim(),
                description: '',
                maxVotes: 1,
              }),
            });
          }
        }
      }

      toast.success('Election and positions created successfully');
      fetchElections();
    } catch (error) {
      toast.error('Failed to create election');
    }
    setShowAddModal(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Elections Management</h2>
        <Button onClick={() => setShowAddModal(true)} className="bg-[#003B71] text-white">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Election
        </Button>
      </div>

      {loading ? (
        <p>Loading elections...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.map((election) => {
            const votePercentage = ((election as any).totalVotes / (election as any).eligibleVoters) * 100 || 0
            return (
              <ElectionCard
                key={election.id}
                id={election.id}
                title={election.title}
                description={election.description}
                startDate={election.startDate}
                endDate={election.endDate}
                positions={election.positions?.map((p: any) => typeof p === 'string' ? p : p.title) || []}
                status={election.status}
                hasVoted={false}
                actionButton={
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => router.push(`/admin/dashboard/elections/${election.id}/results`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleEdit(election)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(election.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                }
              >
                <div className="flex items-center text-sm text-gray-500">
                  <VoteIcon className="mr-2 h-4 w-4" />
                  <span>Votes: {(election as any).totalVotes || 0} of {(election as any).eligibleVoters || 0}</span>
                </div>
                <div className="space-y-1 pt-2">
                  <Progress value={votePercentage} className="h-2" />
                  <p className="text-sm text-gray-600 text-right">{votePercentage.toFixed(1)}% Participation</p>
                </div>
              </ElectionCard>
            )
          })}
        </div>
      )}

      <AddElectionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddElection}
      />
      
      {selectedElection && (
        <EditElectionModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
          election={selectedElection}
        />
      )}
    </div>
  )
} 