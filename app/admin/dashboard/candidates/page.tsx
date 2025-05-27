"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle, BadgeCheck, Edit, Trash2 } from "lucide-react"

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const candidates = [
    { id: 1, name: "John Doe", position: "President", faculty: "Science & Tech", gender: "Male", status: "Active" },
    { id: 2, name: "Jane Smith", position: "Vice President", faculty: "Arts", gender: "Female", status: "Active" }
  ]

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Candidates Management</h2>
        <div className="flex gap-4">
          <Input 
            placeholder="Search candidates..." 
            className="w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Candidate
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Position</th>
                <th className="py-2 px-3">Faculty</th>
                <th className="py-2 px-3">Gender</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{candidate.name}</td>
                  <td className="py-2 px-3">{candidate.position}</td>
                  <td className="py-2 px-3">{candidate.faculty}</td>
                  <td className="py-2 px-3">{candidate.gender}</td>
                  <td className="py-2 px-3">
                    <BadgeCheck className="text-green-500 h-5 w-5" />
                  </td>
                  <td className="py-2 px-3 flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-500">
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
