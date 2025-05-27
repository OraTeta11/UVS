"use client"

import type React from "react"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Plus, Trash2, Upload, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ManageCandidatesPage({ params }: { params: { id: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("president")
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    faculty: "",
    year: "",
    manifesto: "",
    image: "/placeholder.svg?height=100&width=100",
  })

  // Mock election data
  const election = {
    id: params.id,
    title: "Student Guild Elections 2025",
    positions: ["President", "Vice President", "Secretary", "Treasurer"],
  }

  // Mock candidates data
  const [candidates, setCandidates] = useState({
    president: [
      {
        id: "c1",
        name: "Alice Uwimana",
        faculty: "Science and Technology",
        year: "Year 3",
        manifesto: "I will work to improve student facilities and create more opportunities for academic growth.",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "c2",
        name: "Bob Mugisha",
        faculty: "Business and Economics",
        year: "Year 4",
        manifesto: "My focus will be on enhancing student welfare and creating a more inclusive campus environment.",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    "vice president": [
      {
        id: "c3",
        name: "Claire Niyonzima",
        faculty: "Medicine and Health Sciences",
        year: "Year 3",
        manifesto: "I plan to advocate for better healthcare services and mental health support for all students.",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    secretary: [],
    treasurer: [],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCandidate((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewCandidate((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCandidate = () => {
    setIsSubmitting(true)

    // Validate form
    if (!newCandidate.name || !newCandidate.faculty || !newCandidate.year) {
      alert("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      const position = activeTab.toLowerCase()
      const newCandidateWithId = {
        ...newCandidate,
        id: `c${Math.random().toString(36).substr(2, 9)}`,
      }

      setCandidates((prev) => ({
        ...prev,
        [position]: [...prev[position as keyof typeof prev], newCandidateWithId],
      }))

      // Reset form
      setNewCandidate({
        name: "",
        faculty: "",
        year: "",
        manifesto: "",
        image: "/placeholder.svg?height=100&width=100",
      })

      setIsSubmitting(false)
    }, 1000)
  }

  const handleRemoveCandidate = (position: string, candidateId: string) => {
    setCandidates((prev) => ({
      ...prev,
      [position]: prev[position as keyof typeof prev].filter((c) => c.id !== candidateId),
    }))
  }

  const getPositionKey = (position: string) => {
    return position.toLowerCase().replace(/\s+/g, " ")
  }

  return (
    <>
      <AdminHeader title="Manage Candidates" description={`Add and manage candidates for ${election.title}`} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/dashboard" className="inline-flex items-center text-[#003B71] hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#003B71]">Candidates by Position</CardTitle>
                <CardDescription>Manage candidates for each position in this election</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="president" onValueChange={setActiveTab}>
                  <TabsList className="mb-4 flex flex-wrap">
                    {election.positions.map((position) => (
                      <TabsTrigger key={position} value={getPositionKey(position)}>
                        {position}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {election.positions.map((position) => {
                    const positionKey = getPositionKey(position)
                    const positionCandidates = candidates[positionKey as keyof typeof candidates] || []

                    return (
                      <TabsContent key={position} value={positionKey} className="space-y-4">
                        {positionCandidates.length === 0 ? (
                          <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <User className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                            <h3 className="text-lg font-medium text-gray-600">No candidates yet</h3>
                            <p className="text-sm text-gray-500 mb-4">Add candidates for this position</p>
                          </div>
                        ) : (
                          positionCandidates.map((candidate) => (
                            <div
                              key={candidate.id}
                              className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200"
                            >
                              <div className="flex-shrink-0">
                                <Image
                                  src={candidate.image || "/placeholder.svg"}
                                  alt={candidate.name}
                                  width={80}
                                  height={80}
                                  className="rounded-full"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <div>
                                    <h3 className="text-lg font-medium">{candidate.name}</h3>
                                    <div className="text-sm text-gray-500 mt-1 mb-2">
                                      {candidate.faculty} | {candidate.year}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveCandidate(positionKey, candidate.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="text-sm text-gray-600">{candidate.manifesto}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </TabsContent>
                    )
                  })}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl text-[#003B71]">Add New Candidate</CardTitle>
                <CardDescription>
                  Add a candidate for the {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newCandidate.name}
                    onChange={handleInputChange}
                    placeholder="Enter candidate's full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="faculty">Faculty</Label>
                  <Select value={newCandidate.faculty} onValueChange={(value) => handleSelectChange("faculty", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Science and Technology">Science and Technology</SelectItem>
                      <SelectItem value="Business and Economics">Business and Economics</SelectItem>
                      <SelectItem value="Medicine and Health Sciences">Medicine and Health Sciences</SelectItem>
                      <SelectItem value="Arts and Social Sciences">Arts and Social Sciences</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Law">Law</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year of Study</Label>
                  <Select value={newCandidate.year} onValueChange={(value) => handleSelectChange("year", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Year 1">Year 1</SelectItem>
                      <SelectItem value="Year 2">Year 2</SelectItem>
                      <SelectItem value="Year 3">Year 3</SelectItem>
                      <SelectItem value="Year 4">Year 4</SelectItem>
                      <SelectItem value="Year 5">Year 5</SelectItem>
                      <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manifesto">Manifesto</Label>
                  <Textarea
                    id="manifesto"
                    name="manifesto"
                    value={newCandidate.manifesto}
                    onChange={handleInputChange}
                    placeholder="Enter candidate's manifesto or campaign statement"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Candidate Photo</Label>
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Upload a photo of the candidate</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP (max. 2MB)</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Select File
                      </Button>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Ensure you have the candidate's permission to add their information and photo to the election.
                  </AlertDescription>
                </Alert>

                <Button
                  className="w-full bg-[#003B71] hover:bg-[#002a52]"
                  onClick={handleAddCandidate}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Candidate
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
