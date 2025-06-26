"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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
import { CheckCircle2, XCircle, Edit, ShieldCheck, Trash2, Plus } from "lucide-react"
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddCandidateModal } from "@/components/admin/AddCandidateModal";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

async function getPositions() {
  const res = await fetch('/api/positions');
  if (!res.ok) {
    const error = await res.json();
    console.error("Failed to fetch positions:", error);
    throw new Error(error.message || 'Failed to fetch positions');
  }
  return res.json();
}

async function getCandidates() {
  const res = await fetch('/api/candidates');
  if (!res.ok) {
    const error = await res.json();
    console.error("Failed to fetch candidates:", error);
    throw new Error(error.message || 'Failed to fetch candidates');
  }
  return res.json();
}

export function CandidatesTable() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Partial<Candidate> | undefined>(undefined);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const fetchAndSetData = async () => {
    try {
      const [candidatesData, positionsData] = await Promise.all([
        getCandidates(),
        getPositions()
      ]);
      setCandidates(candidatesData);
      setPositions(positionsData);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error(error.message || "Failed to load data. Please try again.");
    }
  };

  useEffect(() => {
    fetchAndSetData();
  }, []);

  const handleAddOrUpdateCandidate = async (candidateData: Partial<Candidate>) => {
    try {
      let response;
      if (editingCandidate?.student_id) {
        // Update existing candidate by student_id
        response = await fetch(`/api/candidates/by-student/${editingCandidate.student_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(candidateData),
        });
      } else {
        // Add new candidate
        response = await fetch('/api/candidates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(candidateData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save candidate');
      }

      toast.success(`Candidate ${editingCandidate?.student_id ? 'updated' : 'added'} successfully!`);
      fetchAndSetData(); // Refresh data
      setIsModalOpen(false);
      setEditingCandidate(undefined);
    } catch (error: any) {
      console.error("Error saving candidate:", error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCandidate(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = async (studentId: string) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    try {
      const response = await fetch(`/api/candidates/by-student/${studentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete candidate');
      }
      toast.success("Candidate deleted successfully!");
      fetchAndSetData();
    } catch (error: any) {
      console.error("Error deleting candidate:", error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  const columns = React.useMemo<ColumnDef<Candidate>[]>(
    () => [
      {
        header: "ID",
        id: "rowNumber",
        cell: ({ row }) => pageIndex * pageSize + row.index + 1,
      },
      {
        accessorKey: "image_url",
        header: "Image",
        cell: ({ row }) => {
          const imageUrl = row.original.image_url;
          return imageUrl ? (
            <img
              src={imageUrl}
              alt="Candidate"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : null;
        },
      },
      { accessorKey: "student_id", header: "Student ID" },
      {
        accessorKey: "full_name",
        header: "Name",
      },
      {
        accessorKey: "department",
        header: "Department",
      },
      {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }) => {
          const gender = row.original.gender;
          if (gender === 'Male') return 'M';
          if (gender === 'Female') return 'F';
          return '-';
        },
      },
      {
        accessorKey: "position",
        header: "Position",
        cell: ({ row }) => row.original.position || row.original.position_id || "-",
      },
      {
        accessorKey: "manifesto",
        header: "Manifesto",
      },
      {
        accessorKey: "verified",
        header: "Verified",
        cell: ({ row }) => row.original.verified ? <CheckCircle2 className="text-green-500" title="Verified" /> : null,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button onClick={() => handleEdit(row.original)} title="Edit" className="icon-btn">
              <Edit />
            </button>
            <button onClick={() => handleDelete(row.original.student_id)} title="Delete" className="icon-btn">
              <Trash2 className="text-red-500" />
            </button>
          </div>
        ),
      },
    ],
    [handleEdit, handleDelete]
  );

  const table = useReactTable({
    data: candidates,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
        pagination: {
            pageSize: 10,
        },
    },
    globalFilterFn: (row, columnId, filterValue) => {
      // Filter by name or department
      const name = row.original.full_name?.toLowerCase() || "";
      const dept = row.original.department?.toLowerCase() || "";
      return name.includes(filterValue.toLowerCase()) || dept.includes(filterValue.toLowerCase());
    },
  });

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;

  // PDF Export
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Candidates List', 14, 16);
    autoTable(doc, {
      head: [[
        '#', 'Student ID', 'Full Name', 'Position', 'Department', 'Gender', 'Manifesto', 'Verified'
      ]],
      body: candidates.map((c, i) => [
        i + 1,
        c.student_id,
        c.full_name,
        c.position || c.position_id,
        c.department,
        c.gender,
        c.manifesto,
        c.verified ? 'Yes' : 'No',
      ]),
      startY: 22,
      styles: { fontSize: 9 },
    });
    doc.save('candidates-list.pdf');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Candidates</h2>
        <div className="flex gap-2">
          <Button onClick={handleAddNew} className="flex items-center gap-2 bg-[#003B71] text-white">
            <Plus className="h-4 w-4" />
            Add Candidate
          </Button>
          <Button onClick={handleExportPDF} variant="outline" style={{ borderColor: '#003B71', color: '#003B71' }}>Export List</Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Photo</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates && candidates.length > 0 ? (
              candidates.map((candidate, index) => (
                <TableRow key={candidate.student_id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <img src={candidate.image_url || '/placeholder-user.jpg'} alt={candidate.full_name} className="w-10 h-10 rounded-full object-cover" />
                  </TableCell>
                  <TableCell>{candidate.student_id}</TableCell>
                  <TableCell>{candidate.full_name}</TableCell>
                  <TableCell>{candidate.position}</TableCell>
                  <TableCell>{candidate.department}</TableCell>
                  <TableCell>{candidate.gender}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(candidate)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(candidate.student_id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">No candidates found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AddCandidateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCandidate(undefined);
        }}
        onAdd={handleAddOrUpdateCandidate}
        positions={positions}
        initialValues={editingCandidate}
      />
    </div>
  );
}

/* Add this CSS to your global stylesheet or in a <style jsx global> block */
/*
.noborder-table th,
.noborder-table td {
  border: none !important;
}
.icon-btn {
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
}
.icon-btn:hover {
  background: #f3f4f6;
}
*/ 