"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock,
  Search,
  Users,
  VoteIcon,
  AlertCircle,
} from "lucide-react"
import { useAuth } from '@/lib/hooks/useAuth'
import { useElections } from '@/lib/hooks/useElections'
import { useNotifications } from '@/context/NotificationContext'
import { useRouter } from "next/navigation"
import { ElectionCard } from "@/components/ui/ElectionCard"

export default function MyElectionsPage() {
  const { user } = useAuth();
  const { elections, loading, error } = useElections(user?.id || '');
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const { addNotification, notifications } = useNotifications();
  const [notifiedElections, setNotifiedElections] = useState<{ deadline: Set<string>, results: Set<string> }>({ deadline: new Set(), results: new Set() });
  const router = useRouter();

  const filteredElections = {
    active: elections.filter(
      (election) =>
        election.status === 'active' &&
        (election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          election.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    upcoming: elections.filter(
      (election) =>
        election.status === 'upcoming' &&
        (election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          election.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    past: elections.filter(
      (election) =>
        election.status === 'completed' &&
        (election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          election.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  }

  // Real notification logic for deadlines and results
  useEffect(() => {
    if (!elections || elections.length === 0) return;
    const now = new Date();
    const newDeadlineNotified = new Set(notifiedElections.deadline);
    const newResultsNotified = new Set(notifiedElections.results);

    elections.forEach(election => {
      // Notify about deadlines (active, not voted, ends within 24h)
      if (
        election.status === 'active' &&
        !election.hasVoted &&
        election.endDate &&
        !newDeadlineNotified.has(election.id)
      ) {
        const end = new Date(election.endDate);
        const msLeft = end.getTime() - now.getTime();
        if (msLeft > 0 && msLeft <= 24 * 60 * 60 * 1000) {
          addNotification({
            message: `Voting deadline for "${election.title}" is in less than 24 hours!`,
            type: 'Deadline',
          });
          newDeadlineNotified.add(election.id);
        }
      }
      // Notify about results (completed, has results, user voted, not notified yet)
      if (
        election.status === 'completed' &&
        election.results &&
        election.hasVoted &&
        !newResultsNotified.has(election.id)
      ) {
        addNotification({
          message: `Results are available for "${election.title}". Winner: ${election.results.winner} (${election.results.position})`,
          type: 'Results',
        });
        newResultsNotified.add(election.id);
      }
    });
    // Update notified elections to avoid duplicate notifications in this session
    if (
      newDeadlineNotified.size !== notifiedElections.deadline.size ||
      newResultsNotified.size !== notifiedElections.results.size
    ) {
      setNotifiedElections({ deadline: newDeadlineNotified, results: newResultsNotified });
    }
  }, [elections]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#003B71]">My Elections</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search my elections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <VoteIcon className="h-6 w-6 text-[#003B71]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Elections</p>
                <p className="text-2xl font-bold">{filteredElections.active.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <CalendarDays className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Upcoming Elections</p>
                <p className="text-2xl font-bold">{filteredElections.upcoming.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Elections</p>
                <p className="text-2xl font-bold">{filteredElections.past.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Elections</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Elections</TabsTrigger>
          <TabsTrigger value="past">Past Elections</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredElections.active.map((election) => {
              const now = new Date();
              const end = new Date(election.endDate);
              const daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
              const showDaysLeft = (election.status === 'active' || election.status === 'upcoming') && daysLeft > 0;
              return (
                <ElectionCard
                  key={election.id}
                  id={election.id}
                  title={election.title}
                  description={election.description}
                  startDate={election.startDate}
                  endDate={election.endDate}
                  positions={election.positions}
                  status={election.status}
                  hasVoted={election.hasVoted}
                  daysLeft={daysLeft}
                  showDaysLeft={showDaysLeft}
                  actionButton={
                    !election.hasVoted && election.status === 'active' ? (
                      <Button className="w-full bg-[#003B71] text-white hover:bg-[#002a52]" onClick={() => router.push(`/vote/${election.id}`)}>
                        Vote Now
                      </Button>
                    ) : null
                  }
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredElections.upcoming.map((election) => {
              const now = new Date();
              const end = new Date(election.endDate);
              const daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
              const showDaysLeft = (election.status === 'active' || election.status === 'upcoming') && daysLeft > 0;
              return (
                <ElectionCard
                  key={election.id}
                  id={election.id}
                  title={election.title}
                  description={election.description}
                  startDate={election.startDate}
                  endDate={election.endDate}
                  positions={election.positions}
                  status={election.status}
                  hasVoted={election.hasVoted}
                  daysLeft={daysLeft}
                  showDaysLeft={showDaysLeft}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredElections.past.map((election) => {
              return (
                <ElectionCard
                  key={election.id}
                  id={election.id}
                  title={election.title}
                  description={election.description}
                  startDate={election.startDate}
                  endDate={election.endDate}
                  positions={election.positions}
                  status={election.status}
                  hasVoted={election.hasVoted}
                />
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 