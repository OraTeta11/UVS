"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BadgeCheck, UserX, Download, Plus, Search } from "lucide-react"
import { VotesTable } from '@/components/admin/VotesTable'
import { voteService } from '@/lib/services/votes'
import { Vote, User } from '@/types'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, ColumnDef } from '@tanstack/react-table'
import { toast } from "sonner"
import { AddVoterModal } from "@/components/admin/AddVoterModal"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Add a users service to fetch users from the backend
async function fetchUsers(): Promise<User[]> {
  const res = await fetch('/api/users');
  if (!res.ok) return [];
  const data = await res.json();
  return data as User[];
}

function VotersTable({ data }: { data: User[] }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = React.useMemo<ColumnDef<User>[]>(
    () => [
      { accessorKey: "firstName", header: "First Name" },
      { accessorKey: "lastName", header: "Last Name" },
      { accessorKey: "studentId", header: "Student ID" },
      { accessorKey: "department", header: "Faculty" },
      { accessorKey: "gender", header: "Gender" },
      { accessorKey: "role", header: "Role" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Verify</Button>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
              <UserX className="h-4 w-4 mr-2" />Remove
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-2">
      <input
        className="border px-2 py-1 rounded w-full mb-2"
        placeholder="Search voters..."
        value={globalFilter ?? ""}
        onChange={e => setGlobalFilter(e.target.value)}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="border px-4 py-2 cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() ? (header.column.getIsSorted() === "asc" ? " ▲" : " ▼") : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr><td colSpan={columns.length} className="text-center py-4">No voters found.</td></tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="border px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div>
          <Button size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="ml-2">
            Next
          </Button>
        </div>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
      </div>
    </div>
  );
}

export default function VotersPage() {
  const [votes, setVotes] = useState<Vote[]>([])
  const [loadingVotes, setLoadingVotes] = useState(true)
  const [showEditVoter, setShowEditVoter] = useState(false)
  const [editVoter, setEditVoter] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchVotes(); // initial fetch
    const es = new EventSource('/api/voters/stream');
    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setVotes(data);
    };
    return () => es.close();
  }, []);

  const fetchVotes = async () => {
    try {
      setLoadingVotes(true)
      const votes = await voteService.getVotes(1)
      setVotes(votes)
    } catch (error) {
      toast.error("Failed to fetch votes")
    } finally {
      setLoadingVotes(false)
    }
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.text("Voters List", 14, 16)
    autoTable(doc, {
      head: [["ID", "Student ID", "Candidate ID", "Position ID", "Status"]],
      body: votes.map(vote => [
        vote.id,
        vote.student_id,
        vote.candidate_id,
        vote.position_id,
        vote.faceVerified ? "Verified" : "Not Verified",
      ]),
      startY: 22,
      styles: { fontSize: 9 },
    })
    doc.save("voters-list.pdf")
  }

  const handleEdit = (vote) => {
    setEditVoter(vote)
    setShowEditVoter(true)
  }

  const handleDelete = async (vote) => {
    if (!window.confirm(`Are you sure you want to delete voter: ${vote.student_id || vote.voter_id}?`)) return;
    try {
      await fetch(`/api/users/${vote.voter_id || vote.student_id}`, {
        method: 'DELETE',
      })
      toast.success('Voter deleted successfully')
      fetchVotes()
    } catch (error) {
      toast.error('Failed to delete voter')
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Voters Management</h2>
        <div className="flex items-center gap-4">
          <Button onClick={handleExportPDF} variant="outline" style={{ borderColor: '#003B71', color: '#003B71' }}>
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {loadingVotes ? (
            <div>Loading votes...</div>
          ) : (
            <VotesTable 
              data={votes.filter(vote => {
                // Filter by student_id or candidate_id or position_id
                const q = searchQuery.toLowerCase();
                return (
                  (vote.student_id && vote.student_id.toLowerCase().includes(q)) ||
                  (vote.candidate_id && String(vote.candidate_id).toLowerCase().includes(q)) ||
                  (vote.position_id && String(vote.position_id).toLowerCase().includes(q))
                );
              })}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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