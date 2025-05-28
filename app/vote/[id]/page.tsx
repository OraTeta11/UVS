"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import FaceVerification from "@/components/face-recognition/face-verification"
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Loader2, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from '@/context/AuthContext'

export default function VotePage({ params }: { params: { id: string } }) {
  const [step, setStep] = useState(1)
  const [selectedCandidate, setSelectedCandidate] = useState("")
  const [verificationComplete, setVerificationComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [voteSubmitted, setVoteSubmitted] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [capturedFaceDescriptor, setCapturedFaceDescriptor] = useState<Float32Array | null>(null)

  const { studentId: authenticatedStudentId } = useAuth();

  useEffect(() => {
    // In a real app, you would likely fetch the user's student ID or identifier here
    // For now, we'll assume the user is authenticated and their ID is available.

  }, []) // Empty dependency array to run only once on mount

  // Mock election data
  const election = {
    id: params.id,
    title: "Student Guild Elections 2025",
    position: "President",
    description: "Vote for your student representative for the 2025-2026 academic year",
    startDate: "May 10, 2025",
    endDate: "May 15, 2025",
    candidates: [
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
      {
        id: "c3",
        name: "Claire Niyonzima",
        faculty: "Medicine and Health Sciences",
        year: "Year 3",
        manifesto: "I plan to advocate for better healthcare services and mental health support for all students.",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  }

  const handleNextStep = () => {
    if (!selectedCandidate) {
      return
    }
    setStep(2)
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const handleFaceVerificationComplete = async () => {
    // This function will be called by FaceVerification component on internal success (e.g., camera started)
    // We will handle the actual verification in handleFaceCaptured
    setVerificationComplete(true); // This might indicate camera is ready or similar now
    setVerificationError(null);
  }

  const handleFaceVerificationError = () => {
    setVerificationError(null)
    setVerificationComplete(false)
  }

  const handleFaceCaptured = async (descriptor: Float32Array) => {
    setCapturedFaceDescriptor(descriptor);
    setVerificationComplete(true); // Indicate verification process starting
    setVerificationError(null);
    setIsSubmitting(true); // Indicate that the verification/submission process is ongoing

    // Get the actual student ID from the AuthContext
    const studentId = authenticatedStudentId; // Get studentId directly from useAuth

    if (!studentId) {
      // Handle case where user is not logged in or studentId is missing in context
      setVerificationError("User not authenticated. Please log in before voting.");
      setIsSubmitting(false);
      // Optionally redirect to login page
      // router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/verify-face', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: studentId,
          faceDescriptor: Array.from(descriptor),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification failed');
      }

      const result = await response.json();
      console.log('Verification successful:', result);

      // If verification is successful, proceed to the next step (confirm vote)
      setStep(3);

    } catch (error: any) {
      setVerificationError(error.message || "Face verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitVote = () => {
    setIsSubmitting(true)

    // Simulate API call to submit vote
    setTimeout(() => {
      setIsSubmitting(false)
      setVoteSubmitted(true)
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-[#003B71] hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl text-[#003B71]">{election.title}</CardTitle>
                <CardDescription className="mt-1">Position: {election.position}</CardDescription>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="mr-2 h-4 w-4" />
                <span>Ends: {election.endDate}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {verificationError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{verificationError}</AlertDescription>
              </Alert>
            )}

            {voteSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-medium text-[#003B71] mb-2">Vote Submitted Successfully!</h3>
                <p className="text-gray-600 mb-6">Thank you for participating in the University of Rwanda elections.</p>
                <Button className="bg-[#003B71] hover:bg-[#002a52]">
                  <Link href="/dashboard">Return to Dashboard</Link>
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
                      <span className="ml-2 text-sm font-medium">Select Candidate</span>
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
                      <span className="ml-2 text-sm font-medium">Verify Identity</span>
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
                      <span className="ml-2 text-sm font-medium">Confirm Vote</span>
                    </div>
                  </div>
                </div>

                {step === 1 && (
                  <div className="space-y-6">
                    <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
                      {election.candidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className={`flex items-start space-x-4 p-4 rounded-lg border ${
                            selectedCandidate === candidate.id ? "border-[#003B71] bg-blue-50" : "border-gray-200"
                          }`}
                        >
                          <RadioGroupItem value={candidate.id} id={candidate.id} className="mt-1" />
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
                            <Label htmlFor={candidate.id} className="text-lg font-medium cursor-pointer">
                              {candidate.name}
                            </Label>
                            <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">
                              <User className="mr-1 h-3 w-3" />
                              {candidate.faculty} | {candidate.year}
                            </div>
                            <p className="text-sm text-gray-600">{candidate.manifesto}</p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>

                    <div className="flex justify-end mt-6">
                      <Button
                        className="bg-[#003B71] hover:bg-[#002a52]"
                        onClick={handleNextStep}
                        disabled={!selectedCandidate}
                      >
                        Next Step
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Face Verification Required</AlertTitle>
                      <AlertDescription>
                        To ensure the security of your vote, we need to verify your identity using facial recognition.
                        Please look directly at the camera and follow the instructions.
                      </AlertDescription>
                    </Alert>

                    <FaceVerification
                      onVerificationSuccess={handleFaceVerificationComplete}
                      onVerificationFailure={handleFaceVerificationError}
                      onFaceCaptured={handleFaceCaptured}
                      // storedFaceDescriptor is handled by the backend verify-face endpoint
                      allowSkip={false} // Disable skip in production
                    />

                    {verificationComplete && isSubmitting && (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        <span>Submitting your vote...</span>
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-medium text-[#003B71] mb-4">Confirm Your Vote</h3>

                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Election</p>
                        <p className="font-medium">{election.title}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Position</p>
                        <p className="font-medium">{election.position}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Selected Candidate</p>
                        <p className="font-medium">
                          {election.candidates.find((c) => c.id === selectedCandidate)?.name}
                        </p>
                      </div>

                      <Alert className="mt-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                          Your vote is anonymous and confidential. Once submitted, you cannot change your vote.
                        </AlertDescription>
                      </Alert>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={handlePrevStep}>
                        Back
                      </Button>
                      <Button
                        className="bg-[#003B71] hover:bg-[#002a52]"
                        onClick={handleSubmitVote}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Vote"
                        )}
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
