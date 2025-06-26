"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AdminHeader } from "@/components/admin/admin-header"
import { ArrowLeft, CalendarIcon, Clock, Loader2, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CreateElectionPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [positions, setPositions] = useState<string[]>(["President"])
  const [newPosition, setNewPosition] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eligibilityRules: "",
    allowAbstentions: true,
    requireFaceVerification: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const addPosition = () => {
    if (newPosition.trim() && !positions.includes(newPosition.trim())) {
      setPositions([...positions, newPosition.trim()])
      setNewPosition("")
    }
  }

  const removePosition = (index: number) => {
    setPositions(positions.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.title || !startDate || !endDate || positions.length === 0) {
      alert("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    try {
      // In a real app, you would send this data to your backend
      console.log("Election data:", {
        ...formData,
        positions,
        startDate,
        endDate,
      })

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to elections list
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Error creating election:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <AdminHeader title="Create New Election" description="Set up a new election for the University of Rwanda" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/dashboard" className="inline-flex items-center text-[#003B71] hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-[#003B71]">Election Details</CardTitle>
                <CardDescription>Provide the basic information about this election</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Election Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Student Guild Elections 2025"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide a brief description of this election"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eligibilityRules">Eligibility Rules</Label>
                  <Textarea
                    id="eligibilityRules"
                    name="eligibilityRules"
                    value={formData.eligibilityRules}
                    onChange={handleInputChange}
                    placeholder="Specify who is eligible to vote in this election"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-[#003B71]">Positions</CardTitle>
                <CardDescription>Add the positions that candidates can run for in this election</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="newPosition">Add Position</Label>
                    <Input
                      id="newPosition"
                      value={newPosition}
                      onChange={(e) => setNewPosition(e.target.value)}
                      placeholder="e.g. Vice President"
                    />
                  </div>
                  <Button type="button" onClick={addPosition} className="bg-[#003B71] hover:bg-[#002a52]">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Current Positions</Label>
                  {positions.length === 0 ? (
                    <p className="text-sm text-gray-500">No positions added yet</p>
                  ) : (
                    <div className="space-y-2">
                      {positions.map((position, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <span>{position}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePosition(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-[#003B71]">Security Settings</CardTitle>
                <CardDescription>Configure security and verification options for this election</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireFaceVerification">Require Face Verification</Label>
                    <p className="text-sm text-gray-500">
                      Voters must verify their identity using facial recognition before voting
                    </p>
                  </div>
                  <Switch
                    id="requireFaceVerification"
                    checked={formData.requireFaceVerification}
                    onCheckedChange={(checked) => handleSwitchChange("requireFaceVerification", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowAbstentions">Allow Abstentions</Label>
                    <p className="text-sm text-gray-500">Allow voters to abstain from voting for specific positions</p>
                  </div>
                  <Switch
                    id="allowAbstentions"
                    checked={formData.allowAbstentions}
                    onCheckedChange={(checked) => handleSwitchChange("allowAbstentions", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Alert className="mb-8">
              <Clock className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                After creating this election, you'll need to add candidates for each position. The election will not be
                visible to voters until you publish it.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/admin/dashboard">Cancel</Link>
              </Button>
              <Button type="submit" className="bg-[#003B71] hover:bg-[#002a52]" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Election"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
