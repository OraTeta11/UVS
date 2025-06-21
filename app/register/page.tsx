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
    name: "",
    email: "",
    department: "",
    gender: "",
    password: "",
    confirmPassword: "",
  })
  const [faceRegistered, setFaceRegistered] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [registrationError, setRegistrationError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!/^[0-9]{9}$/.test(formData.studentId)) errors.studentId = "Student ID must be exactly 9 digits";
    if (!formData.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) errors.email = "Enter a valid email";
    if (!formData.department.trim()) errors.department = "Department is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.password) errors.password = "Password is required";
    if (formData.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = () => {
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) setStep(step + 1);
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const handleFaceRegistrationSuccess = () => {
    setFaceRegistered(true)
    setRegistrationError(null)
  }

  const handleFaceRegistrationFailure = () => {
    setFaceRegistered(false)
    setRegistrationError("Face registration failed. Please try again.")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegistrationError(null)
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (!faceRegistered) {
      setRegistrationError("Face registration is required to complete registration")
      return
    }
    try {
      const registrationData = {
        ...formData,
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
                <Button className="bg-[#003B71] hover:bg-[#002a52]" onClick={() => (window.location.href = "/login")}>Proceed to Login</Button>
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
                  <form className="space-y-4" onSubmit={handleNextStep}>
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
                        {formErrors.studentId && <p className="text-red-500 text-xs">{formErrors.studentId}</p>}
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
                        {formErrors.email && <p className="text-red-500 text-xs">{formErrors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                        />
                        {formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          placeholder="Enter your department"
                          required
                        />
                        {formErrors.department && <p className="text-red-500 text-xs">{formErrors.department}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) => handleSelectChange('gender', value)}
                          required
                        >
                          <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.gender && <p className="text-red-500 text-xs">{formErrors.gender}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter your password"
                          required
                        />
                        {formErrors.password && <p className="text-red-500 text-xs">{formErrors.password}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your password"
                          required
                        />
                        {formErrors.confirmPassword && <p className="text-red-500 text-xs">{formErrors.confirmPassword}</p>}
                      </div>
                    </div>
                    <Button type="submit" className="bg-[#003B71] hover:bg-[#002a52] w-full">Next Step</Button>
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
                      onRegistrationSuccess={handleFaceRegistrationSuccess}
                      onRegistrationFailure={handleFaceRegistrationFailure}
                      studentId={formData.studentId}
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
                            {formData.name}
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
