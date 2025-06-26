"use client"

import { useEffect } from "react"
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
import { useAuth } from "@/lib/hooks/useAuth"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    gender: "",
    phone: "",
    bio: "",
  })
  const [votingHistory, setVotingHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) return

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // If we have user data, set it to profile data
    if (user) {
      setProfileData(prevData => ({
        ...prevData,
        studentId: user.studentId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        department: user.department,
        gender: user.gender,
      }))
    }
  }, [user, isAuthenticated, authLoading, router])

  useEffect(() => {
    if (!user?.studentId) return
    async function fetchVotingHistory() {
      setLoadingHistory(true)
      try {
        const res = await fetch(`/api/votes/by-student/${user.studentId}`)
        if (res.ok) {
          const data = await res.json()
          setVotingHistory(data)
        } else {
          setVotingHistory([])
        }
      } catch {
        setVotingHistory([])
      } finally {
        setLoadingHistory(false)
      }
    }
    fetchVotingHistory()
  }, [user?.studentId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true)
      console.log('DEBUG user:', user);
      console.log('DEBUG profileData:', profileData);
      if (!user?.studentId && !profileData.studentId) {
        toast({
          title: "Error",
          description: `Student ID is missing. user: ${JSON.stringify(user)}, profileData: ${JSON.stringify(profileData)}`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: user.studentId || profileData.studentId,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          department: profileData.department,
          gender: profileData.gender,
          phone: profileData.phone,
          bio: profileData.bio,
          role: user.role,
        }),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      const updatedData = await response.json()
      setProfileData(prev => ({
        ...prev,
        ...updatedData,
      }))
      setIsEditing(false)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading spinner while auth is loading
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003B71]"></div>
      </div>
    )
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
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={profileData.lastName} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        value={profileData.email} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={profileData.phone} 
                        onChange={handleInputChange} 
                      />
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
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Input 
                        id="gender" 
                        name="gender" 
                        value={profileData.gender} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      name="bio" 
                      value={profileData.bio} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">First Name</Label>
                      <p className="text-gray-900">{profileData.firstName}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Last Name</Label>
                      <p className="text-gray-900">{profileData.lastName}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Email</Label>
                      <p className="text-gray-900">{profileData.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Phone Number</Label>
                      <p className="text-gray-900">{profileData.phone || "Not set"}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Department</Label>
                      <p className="text-gray-900">{profileData.department}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Gender</Label>
                      <p className="text-gray-900">{profileData.gender}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-500">Bio</Label>
                    <p className="text-gray-900">{profileData.bio || "No bio added yet"}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#003B71]">Voting History</CardTitle>
              <CardDescription>Your recent voting activity</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <div>Loading voting history...</div>
              ) : votingHistory.length === 0 ? (
                <div className="text-gray-500">No voting history found.</div>
              ) : (
                <div className="space-y-4">
                  {votingHistory.map((vote, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">{vote.election_title || vote.electionName || 'Election'}</p>
                        <p className="text-sm text-gray-500">
                          Position: {vote.position_title || vote.positionName || 'Position'}<br />
                          Candidate: {vote.candidate_name || vote.candidateName || 'Candidate'}<br />
                          Voted on {vote.voted_at ? new Date(vote.voted_at).toLocaleDateString() : (vote.createdAt ? new Date(vote.createdAt).toLocaleDateString() : '')}
                        </p>
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
