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
import { Election } from "@/types";
import { Button } from "@/components/ui/button";

interface ElectionsTableProps {
  data: Election[];
  onEdit?: (election: Election) => void;
  onDelete?: (election: Election) => void;
}

export function ElectionsTable({ data, onEdit, onDelete }: ElectionsTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);

  const columns = React.useMemo<ColumnDef<Election>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "title", header: "Title" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "startDate", header: "Start Date" },
      { accessorKey: "endDate", header: "End Date" },
      { accessorKey: "requireFaceVerification", header: "Face Verification" },
      { accessorKey: "allowAbstentions", header: "Abstentions" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            {onEdit && <Button size="sm" onClick={() => onEdit(row.original)}>Edit</Button>}
            {onDelete && <Button size="sm" variant="destructive" onClick={() => onDelete(row.original)}>Delete</Button>}
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
        pageSize: 5,
      },
    },
  });

  return (
    <div className="space-y-2">
      <input
        className="border px-2 py-1 rounded w-full mb-2"
        placeholder="Search elections..."
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
                    style={{
                      background: '#003B71',
                      color: 'white',
                      fontWeight: 'bold',
                      padding: '12px 15px',
                      textAlign: 'left',
                      borderBottom: '2px solid #002a52',
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
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
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
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            First
          </Button>
          <Button size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
          <Button size="sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
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