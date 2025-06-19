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
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="border px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
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