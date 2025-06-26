"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Loader2, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from '@/context/AuthContext'
import { useParams } from 'next/navigation'
import { useElection } from '@/lib/hooks/useElections'

export default function VotePage() {
  const params = useParams()
  const { user } = useAuth()
  const { election, candidates, loading, error, submitVote } = useElection(params.id as string)
  const [step, setStep] = useState(1)
  const [selectedCandidate, setSelectedCandidate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [voteSubmitted, setVoteSubmitted] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const handleNextStep = () => {
    if (!selectedCandidate) {
      setSubmissionError("Please select a candidate before proceeding.")
      return
    }
    setSubmissionError(null)
    setStep(2) // Move to confirmation step
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const handleSubmitVote = async () => {
    if (!user || !selectedCandidate || !election) {
      setSubmissionError("Something went wrong. Please try again.")
      return
    }
    setIsSubmitting(true)
    setSubmissionError(null)
    try {
      const selectedCandidateData = candidates.find(c => c.id === selectedCandidate)
      if (!selectedCandidateData) {
        throw new Error("Selected candidate not found")
      }
      if (!selectedCandidateData.position_id || isNaN(Number(selectedCandidateData.position_id))) {
        setSubmissionError("Candidate is missing a valid position ID. Please contact support.")
        setIsSubmitting(false)
        return
      }
      await submitVote(selectedCandidate, selectedCandidateData.position_id.toString())
      setVoteSubmitted(true)
    } catch (error) {
      console.error('Vote submission error:', error)
      setSubmissionError("Failed to submit your vote. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCandidateDetails = candidates.find(c => c.id === selectedCandidate)

  if (loading) {
    return <div className="p-8">Loading election data...</div>
  }
  if (error || !election) {
    return <div className="p-8 text-red-600">Failed to load election data.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard/my-elections" className="inline-flex items-center text-[#003B71] hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Elections
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
            {submissionError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{submissionError}</AlertDescription>
              </Alert>
            )}

            {voteSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-medium text-[#003B71] mb-2">Vote Submitted Successfully!</h3>
                <p className="text-gray-600 mb-6">Thank you for participating.</p>
                <Button asChild className="bg-[#003B71] hover:bg-[#002a52]">
                  <Link href="/dashboard/my-elections">Return to My Elections</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 1 ? "bg-[#003B71] text-white" : "bg-gray-200"}`}>1</div>
                      <span className="ml-2 font-medium">Select Candidate</span>
                    </div>
                    <div className={`flex-1 h-1 mx-4 ${step > 1 ? "bg-[#003B71]" : "bg-gray-200"}`}></div>
                    <div className="flex items-center">
                      <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 2 ? "bg-[#003B71] text-white" : "bg-gray-200"}`}>2</div>
                      <span className="ml-2 font-medium">Confirm Vote</span>
                    </div>
                  </div>
                </div>

                {step === 1 && (
                  <div>
                    <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
                      {candidates.map((candidate) => (
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
                              alt={candidate.name ? `${candidate.name}'s photo` : "Candidate photo"}
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
                    <div className="mt-8 flex justify-end">
                      <Button onClick={handleNextStep} disabled={!selectedCandidate}>
                        Next: Confirm Vote
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && selectedCandidateDetails && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-[#003B71]">Confirm Your Vote</h3>
                    <Card className="bg-gray-50 p-6">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={selectedCandidateDetails.image}
                          alt={selectedCandidateDetails.name ? `${selectedCandidateDetails.name}'s photo` : "Candidate photo"}
                          width={80}
                          height={80}
                          className="rounded-full"
                        />
                        <div>
                          <p className="text-gray-600">You have selected:</p>
                          <p className="text-lg font-bold">{selectedCandidateDetails.name}</p>
                          <p className="text-sm text-gray-500">for the position of {election.position}</p>
                        </div>
                      </div>
                    </Card>
                    <Alert className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Final Step</AlertTitle>
                      <AlertDescription>
                        Clicking "Submit Vote" is final. You cannot change your vote after submitting.
                      </AlertDescription>
                    </Alert>
                    <div className="mt-8 flex justify-between">
                      <Button variant="outline" onClick={handlePrevStep}>
                        Back
                      </Button>
                      <Button onClick={handleSubmitVote} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Submit Vote
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
