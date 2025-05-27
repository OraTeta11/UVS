"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BadgeCheck, UserX, Download } from "lucide-react"

export default function VotersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const voters = [
    { 
      id: 1, 
      name: 'Alice Brown', 
      studentId: 'S001', 
      faculty: 'Science', 
      status: 'Eligible',
      gender: 'Female'
    },
    { 
      id: 2, 
      name: 'Charlie Davis', 
      studentId: 'S002', 
      faculty: 'Arts', 
      status: 'Eligible',
      gender: 'Male'
    },
    { 
      id: 3, 
      name: 'Diana Evans', 
      studentId: 'S003', 
      faculty: 'Engineering', 
      status: 'Not Eligible',
      gender: 'Female'
    },
  ]

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Voters Management</h2>
        <div className="flex gap-4">
          <Input 
            placeholder="Search voters..." 
            className="w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export List
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Student ID</th>
                  <th className="text-left py-3 px-4 font-medium">Faculty</th>
                  <th className="text-left py-3 px-4 font-medium">Gender</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {voters.map((voter) => (
                  <tr key={voter.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{voter.name}</td>
                    <td className="py-3 px-4">{voter.studentId}</td>
                    <td className="py-3 px-4">{voter.faculty}</td>
                    <td className="py-3 px-4">{voter.gender}</td>
                    <td className="py-3 px-4">
                      {voter.status === 'Eligible' ? (
                        <div className="flex items-center gap-2">
                          <BadgeCheck className="h-4 w-4 text-green-500" />
                          <span>Eligible</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Not Eligible</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Verify
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                          <UserX className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 