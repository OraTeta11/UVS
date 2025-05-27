"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, CheckCircle2, RefreshCw } from "lucide-react"
import { LivenessDetection } from "./liveness-detection"

interface FaceRegistrationProps {
  onRegistrationComplete: () => void
  allowSkip?: boolean // New prop to control skip feature
}

export function FaceRegistration({ onRegistrationComplete, allowSkip = false }: FaceRegistrationProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [faceDetected, setFaceDetected] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [livenessVerified, setLivenessVerified] = useState(false)
  const [step, setStep] = useState<"liveness" | "capture" | "register">("liveness")

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
      setStep("capture")
    }
  }

  // Add a skip handler for the liveness step
  const handleSkipLiveness = () => {
    setLivenessVerified(true)
    setStep("capture")
  }

  // Add a skip handler for the entire registration process
  const handleSkipRegistration = () => {
    // Clean up video stream if active
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
    }

    // Mark as complete and call the callback
    setRegistrationSuccess(true)
    onRegistrationComplete()
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

        // Simulate face detection after a short delay
        setTimeout(() => {
          setFaceDetected(true)
        }, 2000)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && faceDetected) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageDataUrl = canvas.toDataURL("image/png")
        setCapturedImage(imageDataUrl)

        // Stop the camera stream
        const stream = video.srcObject as MediaStream
        const tracks = stream.getTracks()
        tracks.forEach((track) => track.stop())

        setIsCapturing(false)
        setStep("register")
      }
    }
  }

  const retakeImage = () => {
    setCapturedImage(null)
    setFaceDetected(false)
    startCamera()
  }

  const registerFace = () => {
    setProcessing(true)

    // Simulate API call to register face
    setTimeout(() => {
      setProcessing(false)
      setRegistrationSuccess(true)
      onRegistrationComplete()
    }, 2000)
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

          {/* Add a skip entire registration button */}
          {allowSkip && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleSkipRegistration}
                className="w-full text-amber-600 border-amber-300 hover:bg-amber-50"
              >
                Skip Entire Registration Process
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                For testing purposes only. This bypasses security verification.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Rest of the component remains the same */}
      {step === "capture" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#003B71]">Step 2: Capture Your Face</h3>
          <p className="text-sm text-gray-600 mb-4">
            Now, let's capture a clear image of your face for future verification. Please look directly at the camera
            and ensure your face is well-lit.
          </p>

          <div className="relative">
            {isCapturing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className={`border-2 rounded-full w-64 h-64 ${faceDetected ? "border-green-500" : "border-gray-300"}`}
                ></div>
              </div>
            )}

            {isCapturing && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {faceDetected ? "Face detected" : "Position your face in the circle"}
              </div>
            )}

            <div className="relative overflow-hidden rounded-lg aspect-video bg-gray-100 flex items-center justify-center">
              {isCapturing ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              ) : capturedImage ? (
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Captured face"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8">
                  <Camera className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">Camera is not active</p>
                </div>
              )}

              {/* Add skip button for capture step */}
              {allowSkip && isCapturing && (
                <div className="absolute bottom-4 right-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Create a placeholder image and proceed
                      setCapturedImage("/placeholder.svg?height=400&width=400")

                      // Stop the camera
                      if (videoRef.current && videoRef.current.srcObject) {
                        const stream = videoRef.current.srcObject as MediaStream
                        const tracks = stream.getTracks()
                        tracks.forEach((track) => track.stop())
                      }

                      setIsCapturing(false)
                      setStep("register")
                    }}
                    className="bg-white text-gray-700 hover:bg-gray-100"
                  >
                    Skip Capture
                  </Button>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex justify-center space-x-4">
            {!isCapturing && !capturedImage && (
              <Button onClick={startCamera} className="bg-[#003B71] hover:bg-[#002a52]">
                Start Camera
              </Button>
            )}

            {isCapturing && (
              <Button onClick={captureImage} disabled={!faceDetected} className="bg-[#003B71] hover:bg-[#002a52]">
                Capture Image
              </Button>
            )}

            {/* Add skip button when not capturing */}
            {allowSkip && !isCapturing && !capturedImage && (
              <Button
                variant="outline"
                onClick={() => {
                  setCapturedImage("/placeholder.svg?height=400&width=400")
                  setStep("register")
                }}
              >
                Skip Capture
              </Button>
            )}
          </div>
        </div>
      )}

      {step === "register" && capturedImage && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#003B71]">Step 3: Register Your Face</h3>
          <p className="text-sm text-gray-600 mb-4">
            Review your captured image. If you're satisfied with it, click "Register Face" to complete the process.
          </p>

          <div className="relative overflow-hidden rounded-lg aspect-video bg-gray-100 flex items-center justify-center">
            <img src={capturedImage || "/placeholder.svg"} alt="Captured face" className="w-full h-full object-cover" />
          </div>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={retakeImage}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retake
            </Button>

            <Button onClick={registerFace} disabled={processing} className="bg-[#003B71] hover:bg-[#002a52]">
              {processing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Register Face"
              )}
            </Button>

            {/* Add skip button for registration step */}
            {allowSkip && (
              <Button variant="outline" onClick={handleSkipRegistration}>
                Skip Registration
              </Button>
            )}
          </div>
        </div>
      )}

      {registrationSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
          <p className="text-green-700">Face registration successful!</p>
        </div>
      )}
    </div>
  )
}
