"use client"

import { useEffect, useRef, useState, useReducer } from 'react'
import { Button } from '@/components/ui/button'
import { startVideo, stopVideo, captureImage } from '@/lib/face-recognition'
import { LivenessDetection } from './liveness-detection'
import { CheckCircle, XCircle, Camera } from 'lucide-react'

interface FaceRegistrationProps {
  onRegistrationSuccess: (s3Key: string) => void
  onRegistrationFailure: (error: string) => void
  studentId: string
  requireLiveness?: boolean
}

type State = {
  status: 'idle' | 'cameraActive' | 'registering' | 'success' | 'error'
  error: string | null
}

type Action = 
  | { type: 'START_CAMERA' }
  | { type: 'CAMERA_FAILED'; payload: string }
  | { type: 'STOP_CAMERA' }
  | { type: 'REGISTER' }
  | { type: 'REGISTRATION_SUCCESS' }
  | { type: 'REGISTRATION_FAILED'; payload: string }
  | { type: 'RESET' }

const initialState: State = {
  status: 'idle',
  error: null,
}

function registrationReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START_CAMERA':
      return { ...state, status: 'cameraActive', error: null }
    case 'CAMERA_FAILED':
      return { ...state, status: 'error', error: action.payload }
    case 'STOP_CAMERA':
      return { ...state, status: 'idle' }
    case 'REGISTER':
      return { ...state, status: 'registering', error: null }
    case 'REGISTRATION_SUCCESS':
      return { ...state, status: 'success' }
    case 'REGISTRATION_FAILED':
      return { ...state, status: 'error', error: action.payload }
    case 'RESET':
      return { ...initialState }
    default:
      return state
  }
}

export default function FaceRegistration({
  onRegistrationSuccess,
  onRegistrationFailure,
  studentId,
  requireLiveness = false,
}: FaceRegistrationProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [state, dispatch] = useReducer(registrationReducer, initialState)
  const [livenessVerified, setLivenessVerified] = useState(!requireLiveness)

  const startCamera = async () => {
    if (videoRef.current) {
      try {
        await startVideo(videoRef.current)
        dispatch({ type: 'START_CAMERA' })
      } catch (err) {
        dispatch({ type: 'CAMERA_FAILED', payload: 'Failed to access camera.' })
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current) {
      stopVideo(videoRef.current)
      dispatch({ type: 'STOP_CAMERA' })
    }
  }

  const handleRegister = async () => {
    if (!videoRef.current) return
    
    dispatch({ type: 'REGISTER' }) // Optimistic UI update

    try {
      const imageData = await captureImage(videoRef.current)
      if (!imageData) {
        throw new Error('Failed to capture image.')
      }
      
      const response = await fetch('/api/register-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, imageData }),
      })

      const data = await response.json()
      
      if (response.ok) {
        dispatch({ type: 'REGISTRATION_SUCCESS' })
        onRegistrationSuccess(data.s3Key) // Pass the key back
      } else {
        throw new Error(data.message || 'Registration failed on the server.')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.'
      dispatch({ type: 'REGISTRATION_FAILED', payload: errorMessage })
      onRegistrationFailure(errorMessage)
    }
  }

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        stopVideo(videoRef.current)
      }
    }
  }, [])

  const isCameraActive = state.status === 'cameraActive' || state.status === 'registering';

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg shadow-md bg-white">
      <div className="relative w-full max-w-md">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg border-2 border-gray-200"
          style={{ display: isCameraActive || state.status === 'success' ? 'block' : 'none' }}
        />
        {!isCameraActive && state.status !== 'success' && (
          <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            <Camera className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      {requireLiveness && isCameraActive && !livenessVerified && (
        <LivenessDetection onLivenessVerified={setLivenessVerified} />
      )}

      <div className="flex flex-col items-center space-y-2 w-full">
        {state.status === 'idle' && (
          <Button onClick={startCamera} className="w-full">
            Start Camera
          </Button>
        )}

        {isCameraActive && (
          <div className="flex space-x-2 w-full">
            <Button 
              onClick={handleRegister}
              disabled={state.status === 'registering' || (requireLiveness && !livenessVerified)}
              className="flex-1"
            >
              {state.status === 'registering' ? 'Registering...' : 'Register Face'}
            </Button>
            <Button variant="outline" onClick={stopCamera}>
              Stop
            </Button>
          </div>
        )}

        {state.status === 'success' && (
          <div className="text-center text-green-600 space-y-2">
            <CheckCircle className="w-12 h-12 mx-auto" />
            <p>Registration Successful!</p>
            <Button variant="outline" onClick={() => dispatch({ type: 'RESET' })}>Register Again</Button>
          </div>
        )}
        
        {state.error && (
          <div className="text-center text-red-500 space-y-2">
            <XCircle className="w-12 h-12 mx-auto" />
            <p>{state.error}</p>
            <Button variant="outline" onClick={() => dispatch({ type: 'RESET' })}>Try Again</Button>
          </div>
        )}
      </div>
    </div>
  )
}
