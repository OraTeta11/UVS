"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Challenge = {
  type: "blink" | "turn-left" | "turn-right" | "smile" | "nod"
  instruction: string
  completed: boolean
}

interface LivenessDetectionProps {
  onLivenessVerified: (verified: boolean) => void
  challengeCount?: number
  allowSkip?: boolean // New prop to control skip feature
  onSkip?: () => void // New prop for skip callback
}

export function LivenessDetection({
  onLivenessVerified,
  challengeCount = 3,
  allowSkip = false, // Default to false for security
  onSkip = () => {}, // Empty function as default
}: LivenessDetectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [verificationComplete, setVerificationComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [faceDetected, setFaceDetected] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)

  // Face detection intervals
  const faceCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const challengeTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Generate random challenges
  useEffect(() => {
    const allChallenges: Challenge[] = [
      { type: "blink", instruction: "Blink your eyes slowly", completed: false },
      { type: "turn-left", instruction: "Turn your head slightly to the left", completed: false },
      { type: "turn-right", instruction: "Turn your head slightly to the right", completed: false },
      { type: "smile", instruction: "Smile naturally", completed: false },
      { type: "nod", instruction: "Nod your head up and down", completed: false },
    ]

    // Shuffle and pick random challenges
    const shuffled = [...allChallenges].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, challengeCount)
    setChallenges(selected)
  }, [challengeCount])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        const tracks = stream.getTracks()
        tracks.forEach((track) => track.stop())
      }

      if (faceCheckIntervalRef.current) {
        clearInterval(faceCheckIntervalRef.current)
      }

      if (challengeTimerRef.current) {
        clearTimeout(challengeTimerRef.current)
      }
    }
  }, [])

  // Update progress when challenges are completed
  useEffect(() => {
    const completedCount = challenges.filter((c) => c.completed).length
    const newProgress = (completedCount / challenges.length) * 100
    setProgress(newProgress)

    if (completedCount === challenges.length && challenges.length > 0) {
      handleVerificationComplete(true)
    }
  }, [challenges])

  const startCamera = async () => {
    console.log('Liveness: startCamera called');
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCapturing(true)
        // Start checking for face
        startFaceDetection()
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Could not access camera. Please ensure camera permissions are granted. " + (err instanceof Error ? err.message : ''))
    }
  }

  const startFaceDetection = () => {
    // In a real implementation, you would use face-api.js or another library
    // to detect faces and facial landmarks. For this demo, we'll simulate detection.

    // Simulate initial face detection after a delay
    setTimeout(() => {
      setFaceDetected(true)
      startChallenges()
    }, 1500)

    // Set up periodic face checking
    faceCheckIntervalRef.current = setInterval(() => {
      // In a real implementation, this would check if a face is still in frame
      // and has the expected characteristics (not a flat image)
      const faceStillDetected = Math.random() > 0.1 // 90% chance face is still detected
      setFaceDetected(faceStillDetected)

      if (!faceStillDetected) {
        // If face is lost during the challenge, we could pause or reset
        console.log("Face temporarily lost from frame")
      }
    }, 1000)
  }

  const startChallenges = () => {
    console.log('Liveness: startChallenges called');
    setCurrentChallengeIndex(0)
    startCurrentChallenge()
  }

  const startCurrentChallenge = () => {
    console.log('Liveness: startCurrentChallenge', currentChallengeIndex);
    setCountdown(5)
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownTimer)
          simulateChallengeCompletion()
          return null
        }
        return prev - 1
      })
    }, 1000)
  }

  const simulateChallengeCompletion = () => {
    // In a real implementation, this would use computer vision to detect
    // if the user completed the challenge (blinked, turned head, etc.)
    console.log('Liveness: simulateChallengeCompletion', currentChallengeIndex);
    // 80% chance of success for demo purposes
    const success = Math.random() > 0.2
    if (success) {
      // Mark current challenge as completed
      setChallenges((prev) =>
        prev.map((challenge, idx) => (idx === currentChallengeIndex ? { ...challenge, completed: true } : challenge)),
      )
      // Move to next challenge or complete verification
      if (currentChallengeIndex < challenges.length - 1) {
        setCurrentChallengeIndex((prev) => prev + 1)
        // Short delay before starting next challenge
        setTimeout(() => {
          startCurrentChallenge()
        }, 1000)
      }
    } else {
      // Challenge failed, retry
      setError('Challenge failed, please try again.');
      startCurrentChallenge()
    }
  }

  const handleVerificationComplete = (success: boolean) => {
    console.log('Liveness: handleVerificationComplete', success);
    setProcessing(true)
    // Clean up intervals
    if (faceCheckIntervalRef.current) {
      clearInterval(faceCheckIntervalRef.current)
    }
    // Stop the camera
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
    }
    // Simulate processing delay
    setTimeout(() => {
      setProcessing(false)
      setVerificationComplete(true)
      onLivenessVerified(success)
    }, 1500)
  }

  const resetDetection = () => {
    setIsCapturing(false)
    setVerificationComplete(false)
    setProgress(0)
    setCurrentChallengeIndex(0)
    setChallenges((prev) => prev.map((c) => ({ ...c, completed: false })))

    // Restart the process
    startCamera()
  }

  // Add a skip handler function
  const handleSkip = () => {
    // Clean up intervals
    if (faceCheckIntervalRef.current) {
      clearInterval(faceCheckIntervalRef.current)
    }

    if (challengeTimerRef.current) {
      clearTimeout(challengeTimerRef.current)
    }

    // Stop the camera
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
    }

    // Call the skip callback
    onSkip()
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative overflow-hidden rounded-lg aspect-video bg-gray-100">
        {isCapturing ? (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

            {/* Face detection guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`border-2 rounded-full w-64 h-64 transition-colors ${
                  faceDetected ? "border-green-500" : "border-gray-300"
                }`}
              ></div>
            </div>

            {/* Status indicator */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {!faceDetected ? (
                "Position your face in the circle"
              ) : challenges[currentChallengeIndex] ? (
                <div className="flex items-center">
                  <span>{challenges[currentChallengeIndex].instruction}</span>
                  {countdown !== null && (
                    <span className="ml-2 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {countdown}
                    </span>
                  )}
                </div>
              ) : (
                "Processing..."
              )}
            </div>
          </>
        ) : verificationComplete ? (
          <div className="flex flex-col items-center justify-center p-8">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
            <p className="text-green-700 font-medium">Liveness verification successful</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8">
            <Button onClick={startCamera} className="bg-[#003B71] hover:bg-[#002a52]">
              Start Liveness Detection
            </Button>

            {/* Add skip button */}
            {allowSkip && (
              <Button
                variant="outline"
                onClick={handleSkip}
                className="mt-4 text-amber-600 border-amber-300 hover:bg-amber-50"
              >
                Skip Liveness Detection
              </Button>
            )}
          </div>
        )}

        {processing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-[#003B71] animate-spin mb-2" />
              <p className="text-sm font-medium">Verifying liveness...</p>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {isCapturing && challenges.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Liveness verification progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Challenges:</h4>
            <ul className="space-y-1">
              {challenges.map((challenge, idx) => (
                <li key={idx} className="flex items-center text-sm">
                  {challenge.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <div
                      className={`h-4 w-4 rounded-full mr-2 ${
                        idx === currentChallengeIndex ? "bg-[#003B71]" : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                  <span className={challenge.completed ? "line-through text-gray-500" : ""}>
                    {challenge.instruction}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Add skip button during challenges */}
          {allowSkip && (
            <Button
              variant="outline"
              onClick={handleSkip}
              className="mt-4 text-amber-600 border-amber-300 hover:bg-amber-50"
            >
              Skip Challenges
            </Button>
          )}
        </div>
      )}

      {verificationComplete && (
        <Button variant="outline" onClick={resetDetection}>
          Restart Verification
        </Button>
      )}
    </div>
  )
}
