"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, CheckCircle2, Loader2 } from "lucide-react"
import { LivenessDetection } from "./liveness-detection"

interface FaceVerificationProps {
  onVerificationComplete: () => void
  allowSkip?: boolean // New prop to control skip feature
}

export function FaceVerification({ onVerificationComplete, allowSkip = false }: FaceVerificationProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verificationSuccess, setVerificationSuccess] = useState(false)
  const [livenessVerified, setLivenessVerified] = useState(false)
  const [step, setStep] = useState<"liveness" | "verification">("liveness")

  useEffect(() => {
    return () => {
      // Clean up video stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        const tracks = stream.getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  const handleLivenessVerified = (verified: boolean) => {
    setLivenessVerified(verified)
    if (verified) {
      setStep("verification")
      startCamera()
    }
  }

  // Add a skip handler for the liveness step
  const handleSkipLiveness = () => {
    setLivenessVerified(true)
    setStep("verification")
    startCamera()
  }

  // Add a skip handler for the entire verification process
  const handleSkipVerification = () => {
    // Clean up video stream if active
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
    }

    // Mark as complete and call the callback
    setVerificationSuccess(true)
    setIsCapturing(false)
    onVerificationComplete()
  }

  const startCamera = async () => {
    try {
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
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  const verifyFace = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Get the image data to send to the verification API
        const imageDataUrl = canvas.toDataURL("image/png")

        // Start verification process
        setVerifying(true)

        // Simulate API call for face verification
        setTimeout(() => {
          setVerifying(false)
          setVerificationSuccess(true)

          // Stop the camera stream
          const stream = video.srcObject as MediaStream
          const tracks = stream.getTracks()
          tracks.forEach((track) => track.stop())

          setIsCapturing(false)

          // Notify parent component
          onVerificationComplete()
        }, 2500)
      }
    }
  }

  return (
    <div className="space-y-4">
      {step === "liveness" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#003B71]">Step 1: Liveness Verification</h3>
          <p className="text-sm text-gray-600 mb-4">
            First, we need to verify that you're a real person and not a photo or video. Please follow the instructions
            to complete the liveness check.
          </p>
          <LivenessDetection
            onLivenessVerified={handleLivenessVerified}
            allowSkip={allowSkip}
            onSkip={handleSkipLiveness}
          />

          {/* Add a skip entire verification button */}
          {allowSkip && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleSkipVerification}
                className="w-full text-amber-600 border-amber-300 hover:bg-amber-50"
              >
                Skip Entire Verification Process
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                For testing purposes only. This bypasses security verification.
              </p>
            </div>
          )}
        </div>
      )}

      {step === "verification" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#003B71]">Step 2: Face Verification</h3>
          <p className="text-sm text-gray-600 mb-4">
            Now, let's verify your identity. Please look directly at the camera for face recognition.
          </p>

          <div className="relative overflow-hidden rounded-lg aspect-video bg-gray-100 flex items-center justify-center">
            {isCapturing ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : verificationSuccess ? (
              <div className="flex flex-col items-center justify-center p-8">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                <p className="text-green-700 font-medium">Verification successful</p>
              </div>
            ) : (
              <div className="text-center p-8">
                <Camera className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500">Camera is not active</p>
              </div>
            )}

            {isCapturing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-[#003B71] rounded-full w-64 h-64"></div>
              </div>
            )}

            {verifying && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg flex flex-col items-center">
                  <Loader2 className="h-8 w-8 text-[#003B71] animate-spin mb-2" />
                  <p className="text-sm font-medium">Verifying your identity...</p>
                </div>
              </div>
            )}

            {/* Add skip button for verification step */}
            {allowSkip && isCapturing && !verifying && (
              <div className="absolute bottom-4 right-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSkipVerification}
                  className="bg-white text-gray-700 hover:bg-gray-100"
                >
                  Skip Verification
                </Button>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {isCapturing && !verifying && (
            <Button onClick={verifyFace} className="w-full bg-[#003B71] hover:bg-[#002a52]">
              Verify Identity
            </Button>
          )}

          {/* Add skip button when not capturing */}
          {allowSkip && !isCapturing && !verificationSuccess && (
            <Button variant="outline" onClick={handleSkipVerification} className="w-full">
              Skip Verification
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
