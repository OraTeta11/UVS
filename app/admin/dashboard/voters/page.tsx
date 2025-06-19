"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BadgeCheck, UserX, Download } from "lucide-react"
import { VotesTable } from '@/components/admin/VotesTable'
import { voteService } from '@/lib/services/votes'
import { Vote, User } from '@/types'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, ColumnDef } from '@tanstack/react-table'

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

  useEffect(() => {
    // Fetch all votes (update as needed for your API)
    voteService.getVotes(1).then(votes => {
      setVotes(votes)
      setLoadingVotes(false)
    })
  }, [])

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Votes Management</h2>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export List
          </Button>
        </div>
      <Card>
        <CardContent className="p-6">
          {loadingVotes ? (
            <div>Loading votes...</div>
                      ) : (
            <VotesTable data={votes} />
          )}
        </CardContent>
      </Card>
    </div>
  )
} 