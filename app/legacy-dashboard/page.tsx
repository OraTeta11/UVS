"use client"

import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Users, Vote, Settings, Calendar, BarChart2, PlusCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function DashboardPage() {
  const { studentId, role } = useAuth();

  if (!studentId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please log in to access the dashboard.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#003B71]">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {studentId}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-[#003B71] text-white rounded-full text-sm">
            {role === 'admin' ? 'Administrator' : 'Voter'}
          </span>
        </div>
      </div>

      {role === 'admin' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Registered voters</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Elections</CardTitle>
                <Vote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Ongoing elections</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Votes Cast</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Total votes recorded</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="elections" className="space-y-4">
            <TabsList>
              <TabsTrigger value="elections">Elections</TabsTrigger>
              <TabsTrigger value="voters">Voters</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="elections" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Manage Elections</h2>
                <Button className="bg-[#003B71] hover:bg-[#002a52]">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Election
                </Button>
              </div>
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-500 text-center">No elections created yet</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="voters" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Registered Voters</h2>
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  View All Voters
                </Button>
              </div>
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-500 text-center">No voters registered yet</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <h2 className="text-xl font-semibold">System Settings</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Face Recognition Threshold</h3>
                        <p className="text-sm text-gray-500">Adjust the sensitivity of face matching</p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Election Duration</h3>
                        <p className="text-sm text-gray-500">Set default duration for new elections</p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {role === 'voter' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Elections</CardTitle>
                <CardDescription>Elections you can participate in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-500 text-center">No active elections available</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Your Voting History</CardTitle>
                <CardDescription>Elections you've participated in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-500 text-center">No voting history yet</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Elections</CardTitle>
              <CardDescription>Elections scheduled in the near future</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-500 text-center">No upcoming elections</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    View Department Elections
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Election Calendar
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Vote className="mr-2 h-4 w-4" />
                    Check Voting Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
} 