"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FaceRegistration from "@/components/face-recognition/face-registration"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    gender: "",
  })
  const [faceRegistered, setFaceRegistered] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [faceDescriptor, setFaceDescriptor] = useState<Float32Array | null>(null)
  const [registrationError, setRegistrationError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = () => {
    setStep(step + 1)
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const handleFaceRegistrationComplete = (descriptor: Float32Array) => {
    setFaceDescriptor(descriptor)
    setFaceRegistered(true)
    setRegistrationError(null)
  }

  const handleFaceRegistrationError = (error: string) => {
    setRegistrationError(error)
    setFaceRegistered(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegistrationError(null)

    if (!faceDescriptor) {
      setRegistrationError("Face registration is required to complete registration")
      return
    }

    try {
      // Here you would send the data to your backend
      const registrationData = {
        ...formData,
        faceDescriptor: Array.from(faceDescriptor), // Convert Float32Array to regular array for JSON
      }
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();
      console.log('Registration successful:', result);

      setRegistrationComplete(true)
    } catch (error: any) {
      setRegistrationError(error.message || "Failed to complete registration. Please try again.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-[#003B71]">Register for Voting</CardTitle>
            <CardDescription>
              Complete the registration process to participate in University of Rwanda elections
            </CardDescription>
          </CardHeader>
          <CardContent>
            {registrationError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{registrationError}</AlertDescription>
              </Alert>
            )}
            {registrationComplete ? (
              <div className="text-center py-8">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-medium text-[#003B71] mb-2">Registration Complete!</h3>
                <p className="text-gray-600 mb-6">
                  Your account has been successfully created. You can now log in to access the voting system.
                </p>
                <Button className="bg-[#003B71] hover:bg-[#002a52]" onClick={() => (window.location.href = "/login")}>
                  Proceed to Login
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div
                        className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 1 ? "bg-[#003B71] text-white" : "bg-gray-200 text-gray-600"}`}
                      >
                        1
                      </div>
                      <span className="ml-2 text-sm font-medium">Personal Information</span>
                    </div>
                    <div className="flex-1 h-1 mx-4 bg-gray-200">
                      <div className={`h-1 bg-[#003B71]`} style={{ width: step >= 2 ? "100%" : "0%" }}></div>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 2 ? "bg-[#003B71] text-white" : "bg-gray-200 text-gray-600"}`}
                      >
                        2
                      </div>
                      <span className="ml-2 text-sm font-medium">Face Registration</span>
                    </div>
                    <div className="flex-1 h-1 mx-4 bg-gray-200">
                      <div className={`h-1 bg-[#003B71]`} style={{ width: step >= 3 ? "100%" : "0%" }}></div>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 3 ? "bg-[#003B71] text-white" : "bg-gray-200 text-gray-600"}`}
                      >
                        3
                      </div>
                      <span className="ml-2 text-sm font-medium">Confirmation</span>
                    </div>
                  </div>
                </div>

                {step === 1 && (
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input
                          id="studentId"
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleInputChange}
                          placeholder="Enter your student ID"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@ur.ac.rw"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select value={formData.department} onValueChange={(value) => handleSelectChange('department', value)}>
                          <SelectTrigger id="department">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IS">IS</SelectItem>
                            <SelectItem value="IT">IT</SelectItem>
                            <SelectItem value="CS">CS</SelectItem>
                            <SelectItem value="CSE">CSE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={formData.gender} onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}>
                          <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button
                        className="bg-[#003B71] hover:bg-[#002a52]"
                        onClick={handleNextStep}
                        disabled={!formData.studentId || !formData.firstName || !formData.lastName || !formData.email || !formData.department}
                      >
                        Next Step
                      </Button>
                    </div>
                  </form>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>
                        Your face will be used for identity verification during login and voting. We'll first verify
                        you're a real person with liveness detection, then capture your face for future verification.
                        Please ensure you are in a well-lit area and look directly at the camera.
                      </AlertDescription>
                    </Alert>

                    <FaceRegistration
                      onRegistrationComplete={handleFaceRegistrationComplete}
                      onRegistrationError={handleFaceRegistrationError}
                      allowSkip={false} // Disable skip in production
                    />

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={handlePrevStep}>
                        Back
                      </Button>
                      <Button
                        className="bg-[#003B71] hover:bg-[#002a52]"
                        onClick={handleNextStep}
                        disabled={!faceRegistered}
                      >
                        Next Step
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-[#003B71] mb-4">Review Your Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Student ID</p>
                          <p className="font-medium">{formData.studentId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{formData.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">
                            {formData.firstName} {formData.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="font-medium">{formData.gender}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Faculty/Department</p>
                          <p className="font-medium">{formData.department}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500">Face Registration</p>
                          <p className="font-medium text-green-600">Completed</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={handlePrevStep}>
                        Back
                      </Button>
                      <Button className="bg-[#003B71] hover:bg-[#002a52]" onClick={handleSubmit}>
                        Complete Registration
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
