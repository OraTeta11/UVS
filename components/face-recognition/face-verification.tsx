"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { startVideo, stopVideo, captureImage } from '@/lib/face-recognition'
import { LivenessDetection } from './liveness-detection'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Loader2 } from "lucide-react"

interface FaceVerificationProps {
  onVerificationSuccess: (credentials: { studentId: string; email: string }) => void;
  onVerificationFailure: (error: string) => void;
  studentId: string;
  email: string;
  requireLiveness?: boolean;
  autoStart?: boolean;
}

export default function FaceVerification({
  onVerificationSuccess,
  onVerificationFailure,
  studentId,
  email,
  requireLiveness = false,
  autoStart = false,
}: FaceVerificationProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [livenessVerified, setLivenessVerified] = useState(!requireLiveness)
  const [cameraWarmupTimer, setCameraWarmupTimer] = useState<number | null>(3)

  const startCamera = async () => {
    if (videoRef.current) {
      try {
        await startVideo(videoRef.current)
        setIsCameraActive(true)
        setError(null)
        // Start countdown timer when camera starts
        setCameraWarmupTimer(3)
      } catch (err) {
        setError('Failed to access camera')
        onVerificationFailure('Failed to access camera')
      }
    }
  }

  const stopCamera = useCallback(() => {
    if (videoRef.current) {
      stopVideo(videoRef.current)
      setIsCameraActive(false)
      setCameraWarmupTimer(null)
    }
  }, [])

  const verifyFaceCapture = async () => {
    if (!videoRef.current || isVerifying) return;
    
    setIsVerifying(true)
    setError(null)
    
    try {
      const imageData = await captureImage(videoRef.current)
      const response = await fetch('/api/verify-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, imageData }),
      })

      const data = await response.json()
      
      if (data.verified) {
        stopCamera()
        onVerificationSuccess({ studentId, email })
      } else {
        setError('Face verification failed. Please try again.')
        onVerificationFailure('Face verification failed. Please try again.')
        // Restart the camera for another attempt
        startCamera()
      }
    } catch (err) {
      setError('Failed to verify face')
      onVerificationFailure('Failed to verify face')
      console.error('Error in verifyFaceCapture:', err)
      // Restart the camera for another attempt
      startCamera()
    } finally {
      setIsVerifying(false)
    }
  }

  // Start camera automatically if autoStart is true
  useEffect(() => {
    if (autoStart && !isCameraActive) {
      startCamera()
    }
  }, [autoStart])

  // Handle countdown timer and auto verification
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (isCameraActive && cameraWarmupTimer !== null) {
      if (cameraWarmupTimer > 0) {
        timerId = setTimeout(() => {
          setCameraWarmupTimer(prev => prev !== null ? prev - 1 : null)
        }, 1000)
      } else if (cameraWarmupTimer === 0) {
        // When timer reaches 0, attempt verification
        verifyFaceCapture()
      }
    }

    return () => {
      if (timerId) clearTimeout(timerId)
    }
  }, [isCameraActive, cameraWarmupTimer])

  // Clean up camera on unmount
  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="relative w-full flex justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-64 h-48 rounded-lg object-cover"
          style={{ display: isCameraActive ? 'block' : 'none' }}
        />
        {isCameraActive && (
          <div className="absolute inset-0 rounded-lg pointer-events-none">
            {cameraWarmupTimer !== null && cameraWarmupTimer > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <span className="text-white text-4xl font-bold">{cameraWarmupTimer}</span>
              </div>
            )}
          </div>
        )}
        {!isCameraActive && (
          <div className="w-64 h-48 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Camera inactive</p>
          </div>
        )}
      </div>

      {/* Liveness detection step */}
      {requireLiveness && isCameraActive && !livenessVerified && (
        <LivenessDetection onLivenessVerified={setLivenessVerified} />
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isVerifying && (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Verifying...</span>
        </div>
      )}
    </div>
  )
}
