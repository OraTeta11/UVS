"use client"

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { startVideo, stopVideo, captureImage } from '@/lib/face-recognition'
import { LivenessDetection } from './liveness-detection'

interface FaceVerificationProps {
  onVerificationSuccess: () => void
  onVerificationFailure: () => void
  studentId: string
  requireLiveness?: boolean
}

export default function FaceVerification({
  onVerificationSuccess,
  onVerificationFailure,
  studentId,
  requireLiveness = false,
}: FaceVerificationProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [livenessVerified, setLivenessVerified] = useState(!requireLiveness)
  const [similarity, setSimilarity] = useState<number | null>(null)

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

  const verifyFaceCapture = async () => {
    console.log('verifyFaceCapture called');
    if (!videoRef.current) {
      console.log('verifyFaceCapture: videoRef.current is null');
      return;
    }
    setIsVerifying(true)
    setSimilarity(null)
    try {
      // Capture image from video
      const imageData = await captureImage(videoRef.current)
      console.log('Captured imageData:', imageData ? imageData.slice(0, 30) + '...' : imageData);
      // Call backend verification API
      const response = await fetch('/api/verify-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, imageData }),
      })
      console.log('verify-face API response status:', response.status);
      const data = await response.json()
      console.log('verify-face response:', data)
      let sim = null
      if (data.verified) {
        // Optionally, you can set a dummy similarity score if needed
        sim = 100
        setSimilarity(sim)
        onVerificationSuccess()
        setError(null)
      } else {
        setError('Face verification failed. Please try again.')
        onVerificationFailure()
      }
    } catch (err) {
      setError('Failed to verify face')
      onVerificationFailure()
      console.error('Error in verifyFaceCapture:', err);
    } finally {
      setIsVerifying(false)
      stopCamera()
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
      {/* Liveness detection step */}
      {requireLiveness && isCameraActive && !livenessVerified && (
        <LivenessDetection onLivenessVerified={setLivenessVerified} />
      )}
      <div className="flex space-x-4">
        {!isCameraActive ? (
          <Button
            onClick={startCamera}
          >
            Start Camera
          </Button>
        ) : (
          <>
            <Button
              onClick={() => {
                console.log('Verify Face button clicked');
                verifyFaceCapture();
              }}
              disabled={isVerifying || (requireLiveness && !livenessVerified)}
            >
              {isVerifying ? 'Verifying...' : 'Verify Face'}
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
      {typeof similarity === 'number' && (
        <p className="text-blue-600 text-sm">Similarity score: {similarity.toFixed(2)}%</p>
      )}
    </div>
  )
}
