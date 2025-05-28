"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FaceVerification from "@/components/face-recognition/face-verification"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { useAuth } from '@/context/AuthContext'
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [step, setStep] = useState(1)
  const [studentId, setStudentId] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationComplete, setVerificationComplete] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [capturedFaceDescriptor, setCapturedFaceDescriptor] = useState<Float32Array | null>(null)

  const { login } = useAuth();
  const router = useRouter();

  const handleNextStep = async () => {
    setIsVerifying(true)
    setLoginError(null)

    try {
      // In a real app, you might still verify student ID here if needed
      // but face verification will be the primary method.

      // Once student ID is entered, proceed to step 2 for face verification
      setIsVerifying(false)
      setStep(2)
    } catch (error) {
      setLoginError("Failed to verify student ID. Please try again.")
      setIsVerifying(false)
    }
  }

  const handleFaceCaptured = (descriptor: Float32Array) => {
    setCapturedFaceDescriptor(descriptor);
    // Optionally, trigger verification immediately after capture
    verifyCapturedFace(descriptor);
  };

  const verifyCapturedFace = async (descriptor: Float32Array) => {
    setVerificationComplete(true); // Indicate verification process is starting
    setLoginError(null);
    setIsVerifying(true);

    if (!studentId) {
      setLoginError("Student ID is required for verification.");
      setVerificationComplete(false);
      setIsVerifying(false);
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
          faceDescriptor: Array.from(descriptor), // Send the captured descriptor
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification failed');
      }

      const result = await response.json();
      console.log('Verification successful:', result);

      // Use the updated login function to include the role
      login(result.studentId, result.role);

      setLoginSuccess(true);
      // Redirect to dashboard after successful login
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (error: any) {
      setLoginError(error.message || "Face verification failed. Please try again.");
      setVerificationComplete(false);
    } finally {
      setIsVerifying(false);
    }
  };

  // Placeholder for the function called by FaceVerification on its internal failure (e.g., camera error)
  const handleFaceVerificationComponentError = (error: string) => {
    setLoginError(error)
    setVerificationComplete(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-[#003B71]">Login</CardTitle>
            <CardDescription>Access your University of Rwanda voting account</CardDescription>
          </CardHeader>
          <CardContent>
            {loginError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter your student ID"
                    required
                  />
                </div>

                <Button
                  className="w-full bg-[#003B71] hover:bg-[#002a52]"
                  onClick={handleNextStep}
                  disabled={!studentId || isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600 pt-4 border-t">
                  <p>Don't have an account?</p>
                  <Button variant="link" className="text-[#003B71] hover:text-[#002a52] p-0 h-auto" asChild>
                    <Link href="/register">Register now to vote</Link>
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
                    We'll first verify you're a real person with liveness detection, then match your face with your
                    registered profile. Please look directly at the camera and follow the instructions.
                  </AlertDescription>
                </Alert>

                <FaceVerification
                  onVerificationComplete={handleFaceVerificationComplete}
                  onVerificationFailure={handleFaceVerificationError}
                  onFaceCaptured={handleFaceCaptured}
                  allowSkip={false} // Disable skip in production
                />

                {verificationComplete && !loginSuccess && (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Logging you in...</span>
                  </div>
                )}

                {loginSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-green-700">Login successful! Redirecting to dashboard...</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
