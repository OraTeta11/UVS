"use client"

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { loadModels, startVideo, stopVideo, detectFace, compareFaces } from '@/lib/face-recognition'

interface FaceVerificationProps {
  onVerificationSuccess: () => void
  onVerificationFailure: () => void
  storedFaceDescriptor?: Float32Array // This will come from your database
}

export default function FaceVerification({
  onVerificationSuccess,
  onVerificationFailure,
  storedFaceDescriptor
}: FaceVerificationProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    loadModels()
      .then(() => setIsModelLoaded(true))
      .catch(err => setError('Failed to load face recognition models'))
  }, [])

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

  const verifyFace = async () => {
    if (!videoRef.current || !storedFaceDescriptor) return

    setIsVerifying(true)
    try {
      const detections = await detectFace(videoRef.current)
      if (detections.length === 0) {
        setError('No face detected')
        return
      }
      if (detections.length > 1) {
        setError('Multiple faces detected. Please ensure only one face is visible')
        return
      }

      const isMatch = await compareFaces(detections[0].descriptor, storedFaceDescriptor)
      if (isMatch) {
        onVerificationSuccess()
      } else {
        setError('Face verification failed. Please try again.')
        onVerificationFailure()
      }
    } catch (err) {
      setError('Failed to verify face')
      onVerificationFailure()
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="relative w-full max-w-md">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg"
          style={{ display: isCameraActive ? 'block' : 'none' }}
        />
        {!isCameraActive && (
          <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Camera inactive</p>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        {!isCameraActive ? (
          <Button
            onClick={startCamera}
            disabled={!isModelLoaded}
          >
            Start Camera
          </Button>
        ) : (
          <>
            <Button 
              onClick={verifyFace}
              disabled={isVerifying}
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
    </div>
  )
}
