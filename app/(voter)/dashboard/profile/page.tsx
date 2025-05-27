"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, CheckCircle2, Clock, Edit, Eye, User, VoteIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    studentId: "2022/CST/001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@ur.ac.rw",
    faculty: "Science and Technology",
    department: "Computer Science",
    year: "Year 3",
    phone: "+250 78 123 4567",
    bio: "Computer Science student at the University of Rwanda with interests in software development and artificial intelligence.",
    notifications: {
      email: true,
      sms: false,
      app: true,
    },
  })

  // Mock voting history data
  const votingHistory = [
    {
      id: 1,
      title: "Student Guild Elections 2024",
      date: "May 12, 2024",
      positions: ["President", "Vice President", "Secretary", "Treasurer"],
    },
    {
      id: 2,
      title: "Faculty of Science Representative",
      date: "March 5, 2024",
      positions: ["Faculty Representative"],
    },
    {
      id: 3,
      title: "Department Head Selection",
      date: "February 10, 2024",
      positions: ["Department Head"],
    },
  ]

  // Mock upcoming elections
  const upcomingElections = [
    {
      id: 4,
      title: "Student Guild Elections 2025",
      startDate: "May 10, 2025",
      endDate: "May 15, 2025",
      status: "upcoming",
      positions: ["President", "Vice President", "Secretary", "Treasurer"],
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (type: string, checked: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: checked,
      },
    }))
  }

  const handleSaveProfile = () => {
    // In a real app, you would send this data to your backend
    console.log("Updated profile data:", profileData)
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#003B71]">My Profile</h1>
          <p className="text-gray-600">Manage your account and view your voting history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl text-[#003B71]">Personal Information</CardTitle>
                  <CardDescription>Your account details and preferences</CardDescription>
                </div>
                {!isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" value={profileData.lastName} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" value={profileData.email} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" value={profileData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="faculty">Faculty</Label>
                      <Input id="faculty" name="faculty" value={profileData.faculty} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        value={profileData.department}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" name="bio" value={profileData.bio} onChange={handleInputChange} rows={3} />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="emailNotifications">Email Notifications</Label>
                          <p className="text-sm text-gray-500">Receive election updates via email</p>
                        </div>
                        <Switch
                          id="emailNotifications"
                          checked={profileData.notifications.email}
                          onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="smsNotifications">SMS Notifications</Label>
                          <p className="text-sm text-gray-500">Receive election updates via SMS</p>
                        </div>
                        <Switch
                          id="smsNotifications"
                          checked={profileData.notifications.sms}
                          onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="appNotifications">In-App Notifications</Label>
                          <p className="text-sm text-gray-500">Receive notifications within the app</p>
                        </div>
                        <Switch
                          id="appNotifications"
                          checked={profileData.notifications.app}
                          onCheckedChange={(checked) => handleNotificationChange("app", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-[#003B71] hover:bg-[#002a52]" onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                      <div className="relative">
                        <Image
                          src="/placeholder.svg?height=120&width=120"
                          alt="Profile"
                          width={120}
                          height={120}
                          className="rounded-full"
                        />
                        <Badge className="absolute bottom-0 right-0 bg-[#003B71]">
                          <User className="h-4 w-4" />
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {profileData.firstName} {profileData.lastName}
                      </h2>
                      <p className="text-gray-600">
                        {profileData.faculty} - {profileData.department}
                      </p>
                      <p className="text-gray-600">{profileData.year}</p>
                      <p className="text-sm text-gray-500 mt-2">Student ID: {profileData.studentId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
                      <p>{profileData.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
                      <p>{profileData.phone}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                    <p>{profileData.bio}</p>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Notification Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full ${profileData.notifications.email ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                        <span>Email Notifications</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full ${profileData.notifications.sms ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                        <span>SMS Notifications</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full ${profileData.notifications.app ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                        <span>In-App Notifications</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl text-[#003B71]">Voting History</CardTitle>
              <CardDescription>Elections you have participated in</CardDescription>
            </CardHeader>
            <CardContent>
              {votingHistory.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <VoteIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium text-gray-600">No voting history</h3>
                  <p className="text-sm text-gray-500">You haven't participated in any elections yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {votingHistory.map((election) => (
                    <div key={election.id} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <CheckCircle2 className="h-6 w-6 text-[#003B71]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{election.title}</h3>
                          <span className="text-sm text-gray-500">{election.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Positions: {election.positions.join(", ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-[#003B71]">Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <VoteIcon className="h-6 w-6 text-[#003B71]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Elections Participated</p>
                    <p className="text-2xl font-bold">{votingHistory.length}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <CalendarDays className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Upcoming Elections</p>
                    <p className="text-2xl font-bold">{upcomingElections.length}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-2">Account Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/change-password">Change Password</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#003B71]">Upcoming Elections</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingElections.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No upcoming elections</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingElections.map((election) => (
                    <div key={election.id} className="p-4 rounded-lg border border-gray-200">
                      <h3 className="font-medium">{election.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>
                          {election.startDate} - {election.endDate}
                        </span>
                      </div>
                      <div className="mt-4">
                        <Button className="w-full bg-[#003B71] hover:bg-[#002a52]" asChild>
                          <Link href={`/elections/${election.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
