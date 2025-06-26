"use client"

import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface Voter {
  id: string
  time: string
  faculty: string
}

interface RealtimeVoterListProps {
  voters: Voter[]
}

export function RealtimeVoterList({ voters }: RealtimeVoterListProps) {
  if (voters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Clock className="h-12 w-12 mb-4 opacity-30" />
        <p>Waiting for voting activity...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border">
        <div className="bg-muted px-4 py-2 font-medium">Recent Voting Activity</div>
        <div className="divide-y">
          {voters.map((voter) => (
            <div key={voter.id} className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-[#003B71] flex items-center justify-center text-white font-medium">
                  {voter.id.substring(6, 8)}
                </div>
                <div>
                  <p className="text-sm font-medium">Anonymous Voter</p>
                  <p className="text-xs text-gray-500">{voter.faculty}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {voter.time}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-500 italic text-center">
        Note: All voter data is anonymized to protect privacy
      </div>
    </div>
  )
}
