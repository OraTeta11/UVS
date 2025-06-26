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
import { CheckCircle2, XCircle, Edit, ShieldCheck } from "lucide-react"
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
      { accessorKey: "id", header: "ID" },
      { accessorKey: "student_id", header: "Student ID" },
      { accessorKey: "candidate_id", header: "Candidate ID" },
      { accessorKey: "position_id", header: "Position ID" },
      {
        accessorKey: "faceVerified",
        header: "Status",
        cell: ({ row }) =>
          row.original.faceVerified ? (
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
            {onDelete && (
              <Button size="icon" variant="ghost" onClick={() => onDelete(row.original)}>
                <ShieldCheck className="text-red-600" />
              </Button>
            )}
            {onEdit && (
              <Button size="icon" variant="ghost" onClick={() => onEdit(row.original)}>
                <Edit className="text-blue-600" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [onDelete, onEdit]
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
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table
          className="min-w-full"
          style={{ borderCollapse: 'collapse', background: 'white', border: '3px solid #003B71' }}
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
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: '16px', border: '2px solid #003B71' }}>No votes found.</td></tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        padding: '12px 15px',
                        textAlign: 'left',
                        borderBottom: '1px solid #e2e8f0',
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
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} style={{ background: '#003B71', color: 'white' }}>
            First
          </Button>
          <Button size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} style={{ background: '#003B71', color: 'white' }}>
            Previous
          </Button>
          <Button size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} style={{ background: '#003B71', color: 'white' }}>
            Next
          </Button>
          <Button size="sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} style={{ background: '#003B71', color: 'white' }}>
            Last
          </Button>
        </div>
        <div className="flex items-center gap-2">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
            className="p-1 border rounded"
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
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