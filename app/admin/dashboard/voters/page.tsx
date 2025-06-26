"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BadgeCheck, UserX, Download, Plus, Search, Users, VoteIcon, Calendar } from "lucide-react"
import { VotesTable } from '@/components/admin/VotesTable'
import { voteService } from '@/lib/services/votes'
import { Vote, User } from '@/types'
import { toast } from "sonner"
import { AddVoterModal } from "@/components/admin/AddVoterModal"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function VotersPage() {
  const [votes, setVotes] = useState<Vote[]>([])
  const [loadingVotes, setLoadingVotes] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEditVoter, setShowEditVoter] = useState(false)
  const [editVoter, setEditVoter] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchVotes(); // initial fetch
    // Note: The stream endpoint doesn't exist yet, so we'll remove it for now
    // const es = new EventSource('/api/voters/stream');
    // es.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   setVotes(data);
    // };
    // return () => es.close();
  }, []);

  const fetchVotes = async () => {
    try {
      setLoadingVotes(true)
      setError(null)
      const votes = await voteService.getVotes(1) // Currently hardcoded to election 1
      console.log('Fetched votes:', votes)
      setVotes(votes)
    } catch (error) {
      console.error('Error fetching votes:', error)
      setError('Failed to fetch votes')
      toast.error("Failed to fetch votes")
    } finally {
      setLoadingVotes(false)
    }
  }

  const handleExportPDF = () => {
    if (votes.length === 0) {
      toast.error("No votes to export")
      return
    }

    const doc = new jsPDF()
    doc.text("Voters List", 14, 16)
    autoTable(doc, {
      head: [["Vote ID", "Student ID", "Voter Name", "Department", "Voted For", "Position", "Face Verified", "Date"]],
      body: votes.map(vote => [
        vote.id,
        vote.student_id || 'N/A',
        `${vote.first_name || ''} ${vote.last_name || ''}`.trim() || 'N/A',
        vote.department || 'N/A',
        vote.candidate_name || 'N/A',
        vote.position_title || 'N/A',
        vote.face_verified ? "Yes" : "No",
        new Date(vote.created_at).toLocaleDateString(),
      ]),
      startY: 22,
      styles: { fontSize: 9 },
    })
    doc.save("voters-list.pdf")
    toast.success("PDF exported successfully")
  }

  const handleViewVoter = (vote) => {
    console.log('handleViewVoter called with:', vote);
    // For now, just show an alert with voter details
    alert(`Voter Details:\nName: ${vote.first_name} ${vote.last_name}\nStudent ID: ${vote.student_id}\nDepartment: ${vote.department}\nVoted for: ${vote.candidate_name} (${vote.position_title})`)
  }

  const handleEdit = (vote) => {
    console.log('handleEdit called with:', vote);
    setEditVoter(vote)
    setShowEditVoter(true)
  }

  const handleDelete = async (vote) => {
    console.log('handleDelete called with:', vote);
    if (!window.confirm(`Are you sure you want to delete this vote?`)) return;
    try {
      await fetch(`/api/elections/1/votes?voteId=${vote.id}`, {
        method: 'DELETE',
      })
      toast.success('Vote deleted successfully')
      fetchVotes()
    } catch (error) {
      toast.error('Failed to delete vote')
    }
  }

  // Calculate statistics
  const totalVotes = votes.length
  const verifiedVotes = votes.filter(vote => vote.face_verified).length
  const uniqueVoters = new Set(votes.map(vote => vote.student_id)).size

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#003B71]">Voters Management</h2>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleExportPDF} 
            variant="outline" 
            style={{ borderColor: '#003B71', color: '#003B71' }}
            disabled={votes.length === 0}
          >
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <VoteIcon className="h-6 w-6 text-[#003B71]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Votes</p>
                <p className="text-2xl font-bold">{totalVotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <BadgeCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Face Verified</p>
                <p className="text-2xl font-bold">{verifiedVotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Unique Voters</p>
                <p className="text-2xl font-bold">{uniqueVoters}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          {loadingVotes ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003B71] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading votes...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-600 mb-2">Failed to load votes</p>
                <p className="text-sm text-gray-500 mb-4">{error}</p>
                <Button onClick={fetchVotes} style={{ background: '#003B71', color: 'white' }}>
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <>
              {console.log('Rendering VotesTable with props:', { 
                dataLength: votes.length, 
                hasViewHandler: !!handleViewVoter, 
                hasEditHandler: !!handleEdit, 
                hasDeleteHandler: !!handleDelete 
              })}
              <VotesTable 
                data={votes}
                onViewVoter={handleViewVoter}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </>
          )}
        </CardContent>
      </Card>

      {editVoter && (
        <AddVoterModal
          isOpen={showEditVoter}
          onClose={() => { setShowEditVoter(false); setEditVoter(null); }}
          onAdd={async (data) => {
            try {
              await fetch(`/api/users/${editVoter.voter_id || editVoter.student_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              })
              toast.success('Voter updated successfully')
              fetchVotes()
            } catch (error) {
              toast.error('Failed to update voter')
            }
          }}
          initialValues={editVoter}
        />
      )}
    </div>
  )
} 