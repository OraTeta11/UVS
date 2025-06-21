"use client"

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { startVideo, stopVideo, captureImage } from '@/lib/face-recognition'
import { LivenessDetection } from './liveness-detection'

interface FaceRegistrationProps {
  onRegistrationSuccess: () => void
  onRegistrationFailure: () => void
  studentId: string
  requireLiveness?: boolean
}

export default function FaceRegistration({
  onRegistrationSuccess,
  onRegistrationFailure,
  studentId,
  requireLiveness = false,
}: FaceRegistrationProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [livenessVerified, setLivenessVerified] = useState(!requireLiveness)

  const startCamera = async () => {
    if (videoRef.current) {
      try {
        await startVideo(videoRef.current)
        setIsCameraActive(true)
        setError(null)
      } catch (err) {
        setError('Failed to access camera')
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current) {
      stopVideo(videoRef.current)
      setIsCameraActive(false)
    }
  }

  const registerFaceCapture = async () => {
    if (!videoRef.current) return
    setIsRegistering(true)
    try {
      // Capture image from video
      const imageData = await captureImage(videoRef.current)
      console.log('Captured imageData:', imageData)
      
      // Send to backend for registration
      const response = await fetch('/api/register-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, imageData }),
      })

      const data = await response.json()
      
      if (response.ok) {
        onRegistrationSuccess()
        setError(null)
      } else {
        throw new Error(data.message || 'Registration failed')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError(err instanceof Error ? err.message : 'Failed to register face')
      onRegistrationFailure()
    } finally {
      setIsRegistering(false)
    }
  }

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        stopVideo(videoRef.current)
      }
    }
  }, [])

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="relative w-full max-w-md">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg border border-gray-300 shadow"
          style={{ display: isCameraActive ? 'block' : 'none' }}
        />
        {isCameraActive && (
          <div className="absolute inset-0 border-2 border-gray-300 rounded-lg pointer-events-none" />
        )}
        {!isCameraActive && (
          <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Camera inactive</p>
          </div>
        )}
      </div>

      {requireLiveness && isCameraActive && !livenessVerified && (
        <LivenessDetection onLivenessVerified={setLivenessVerified} />
      )}

      <div className="flex space-x-4">
        {!isCameraActive ? (
          <Button onClick={startCamera}>
            Start Camera
          </Button>
        ) : (
          <>
            <Button 
              onClick={registerFaceCapture}
              disabled={isRegistering || (requireLiveness && !livenessVerified)}
            >
              {isRegistering ? 'Registering...' : 'Register Face'}
            </Button>
            <Button variant="outline" onClick={stopCamera}>
              Stop Camera
            </Button>
          </>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  )
}
