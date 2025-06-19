"use client"

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { loadModels, startVideo, stopVideo, detectFace } from '@/lib/face-recognition'

export default function FaceRegistration({ onRegistrationComplete }: { onRegistrationComplete: (descriptor: Float32Array) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [faceDescriptor, setFaceDescriptor] = useState<Float32Array | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  const captureFace = async () => {
    if (!videoRef.current) return

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

      setFaceDescriptor(detections[0].descriptor)
      if (onRegistrationComplete && detections[0].descriptor) {
        onRegistrationComplete(detections[0].descriptor);
      }
      setError(null)
    } catch (err) {
      setError('Failed to capture face')
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
            <Button onClick={captureFace}>
              Capture Face
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

      {faceDescriptor && (
        <p className="text-green-500 text-sm">Face captured successfully!</p>
      )}
    </div>
  )
}
