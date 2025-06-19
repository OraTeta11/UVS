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
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Candidate, User } from "@/types";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Edit, ShieldCheck, Trash2 } from "lucide-react"
import Image from 'next/image';

interface CandidatesTableProps {
  data: Candidate[];
  onEdit?: (candidate: Candidate) => void;
  onDelete?: (candidate: Candidate) => void;
}

export function CandidatesTable({ data, onEdit, onDelete }: CandidatesTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const columns = React.useMemo<ColumnDef<Candidate>[]>(
    () => [
      {
        accessorKey: "imageUrl",
        header: "Image",
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Image
              src={row.original.user?.imageUrl || '/placeholder.svg?height=40&width=40'}
              alt={`${row.original.user?.firstName || ''} ${row.original.user?.lastName || ''}`}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          </div>
        ),
      },
      { accessorKey: "id", header: "ID" },
      {
        accessorKey: "user",
        header: "Name",
        cell: ({ row }) => {
          const user = row.original.user;
          return user ? `${user.firstName} ${user.lastName}` : "-";
        },
      },
      {
        accessorKey: "user.studentId",
        header: "Student ID",
        cell: ({ row }) => row.original.user?.studentId || "-",
      },
      {
        accessorKey: "user.department",
        header: "Faculty",
        cell: ({ row }) => row.original.user?.department || "-",
      },
      {
        accessorKey: "positionId",
        header: "Position",
        cell: ({ row }) => row.original.positionId,
      },
      {
        accessorKey: "verified",
        header: "Status",
        cell: ({ row }) =>
          row.original.verified ? (
            <CheckCircle2 className="text-green-600" />
          ) : (
            <XCircle className="text-red-600" />
          ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            {onEdit && (
              <Button size="icon" variant="ghost" onClick={() => onEdit(row.original)}>
                <Edit className="text-blue-600" />
              </Button>
            )}
            {onDelete && (
              <Button size="icon" variant="ghost" onClick={() => onDelete(row.original)}>
                <ShieldCheck className="text-red-600" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        
      </div>
      <div className="overflow-x-auto">
        <table
          className="min-w-full"
          style={{ borderCollapse: 'collapse', background: 'white', border: '3px solid #003B71' }}
        >
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{
                      background: '#003B71',
                      color: 'white',
                      fontWeight: 'bold',
                      border: '2px solid #003B71',
                      padding: '8px',
                      textAlign: 'left',
                      fontSize: '14px',
                    }}
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
              <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: '16px', border: '2px solid #003B71' }}>No candidates found.</td></tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      style={{
                        border: '1.5px solid #003B71',
                        padding: '8px',
                        textAlign: 'left',
                        fontSize: '14px',
                        background: 'white',
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
      <div className="flex items-center justify-between mt-2">
        <div>
          <Button size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} style={{ background: '#003B71', color: 'white' }}>
            Previous
          </Button>
          <Button size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} style={{ marginLeft: 8, background: '#003B71', color: 'white' }}>
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