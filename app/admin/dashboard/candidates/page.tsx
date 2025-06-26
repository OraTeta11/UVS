"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle, BadgeCheck, Edit, Trash2, Plus, Download } from "lucide-react"
import { CandidatesTable } from "@/components/admin/CandidatesTable"
import { toast } from "sonner"
import { Candidate } from "@/types"

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Candidates Management</h2>
        <div className="flex items-center gap-4">
          <Input 
            placeholder="Search candidates..." 
            className="w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <CandidatesTable />
        </CardContent>
      </Card>
    </div>
  )
}
