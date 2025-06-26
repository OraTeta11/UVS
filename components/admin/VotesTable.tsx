"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Vote, User, Candidate, Position } from "@/types";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Edit, ShieldCheck, User as UserIcon } from "lucide-react"
import Image from 'next/image';

interface VotesTableProps {
  data: Vote[];
  onViewVoter?: (voter: User | undefined) => void;
  onDelete?: (vote: Vote) => void;
  onEdit?: (vote: Vote) => void;
}

export function VotesTable({ data, onViewVoter, onDelete, onEdit }: VotesTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);

  const columns = React.useMemo<ColumnDef<Vote>[]>(
    () => [
      { 
        accessorKey: "id", 
        header: "Vote ID",
        size: 80
      },
      { 
        accessorKey: "student_id", 
        header: "Student ID",
        size: 120
      },
      { 
        accessorKey: "first_name", 
        header: "First Name",
        size: 120
      },
      { 
        accessorKey: "last_name", 
        header: "Last Name",
        size: 120
      },
      { 
        accessorKey: "department", 
        header: "Department",
        size: 100
      },
      { 
        accessorKey: "candidate_name", 
        header: "Voted For",
        size: 150
      },
      { 
        accessorKey: "position_title", 
        header: "Position",
        size: 150
      },
      {
        accessorKey: "face_verified",
        header: "Face Verified",
        size: 100,
        cell: ({ row }) =>
          row.original.face_verified ? (
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-green-600 text-sm">Yes</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-red-600 text-sm">No</span>
            </div>
          ),
      },
      {
        accessorKey: "created_at",
        header: "Vote Date",
        size: 120,
        cell: ({ row }) => {
          const date = new Date(row.original.created_at);
          return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
      },
      {
        id: "actions",
        header: "Actions",
        size: 120,
        cell: ({ row }) => (
          <div className="flex gap-2">
            {onViewVoter && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  console.log('View voter clicked:', row.original);
                  onViewVoter(row.original);
                }}
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <UserIcon className="h-4 w-4 mr-1" />
                View
              </Button>
            )}
            {onDelete && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  console.log('Delete vote clicked:', row.original);
                  onDelete(row.original);
                }}
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                <ShieldCheck className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
            {onEdit && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  console.log('Edit vote clicked:', row.original);
                  onEdit(row.original);
                }}
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        ),
      },
    ],
    [onDelete, onEdit, onViewVoter]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          className="border px-3 py-2 rounded-lg w-64"
          placeholder="Search voters by name, student ID, or candidate..."
          value={globalFilter ?? ""}
          onChange={e => setGlobalFilter(e.target.value)}
        />
        <span className="text-sm text-gray-600">
          {table.getFilteredRowModel().rows.length} of {data.length} votes
        </span>
      </div>
      
      <div className="overflow-x-auto border rounded-lg">
        <table
          className="min-w-full"
          style={{ borderCollapse: 'collapse', background: 'white' }}
        >
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} style={{ background: '#f8f9fa' }}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      background: '#003B71',
                      color: 'white',
                      fontWeight: 'bold',
                      padding: '12px 15px',
                      textAlign: 'left',
                      borderBottom: '2px solid #002a52',
                      fontSize: '14px',
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === "asc" ? " ▲" : " ▼"
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length} 
                  style={{ 
                    textAlign: 'center', 
                    padding: '32px', 
                    border: '1px solid #e2e8f0',
                    color: '#6b7280'
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <UserIcon className="h-8 w-8 text-gray-400" />
                    <p className="text-lg font-medium">No votes found</p>
                    <p className="text-sm">No votes have been cast yet for this election.</p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        padding: '12px 15px',
                        textAlign: 'left',
                        borderBottom: '1px solid #e2e8f0',
                        fontSize: '14px',
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            onClick={() => table.setPageIndex(0)} 
            disabled={!table.getCanPreviousPage()} 
            style={{ background: '#003B71', color: 'white' }}
          >
            First
          </Button>
          <Button 
            size="sm" 
            onClick={() => table.previousPage()} 
            disabled={!table.getCanPreviousPage()} 
            style={{ background: '#003B71', color: 'white' }}
          >
            Previous
          </Button>
          <Button 
            size="sm" 
            onClick={() => table.nextPage()} 
            disabled={!table.getCanNextPage()} 
            style={{ background: '#003B71', color: 'white' }}
          >
            Next
          </Button>
          <Button 
            size="sm" 
            onClick={() => table.setPageIndex(table.getPageCount() - 1)} 
            disabled={!table.getCanNextPage()} 
            style={{ background: '#003B71', color: 'white' }}
          >
            Last
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
            className="p-2 border rounded-lg text-sm"
          >
            {[5, 10, 20, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 