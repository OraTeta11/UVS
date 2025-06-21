"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FaceVerification from "@/components/face-recognition/face-verification"
import { AlertCircle, CheckCircle2, Loader2, Eye, EyeOff, User, Mail, Lock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { useAuth } from '@/context/AuthContext'
import { useRouter } from "next/navigation"

const ADMIN_ID = 'ADMIN12345';

export default function LoginPage() {
  const [step, setStep] = useState(1)
  const [studentId, setStudentId] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationComplete, setVerificationComplete] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [capturedFaceDescriptor, setCapturedFaceDescriptor] = useState<Float32Array | null>(null)
  const [storedFaceDescriptor, setStoredFaceDescriptor] = useState<Float32Array | null>(null)
  const [showFaceVerification, setShowFaceVerification] = useState(false)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth();
  const router = useRouter();

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!/^[0-9]{9}$/.test(studentId)) errors.studentId = "Student ID must be exactly 9 digits";
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = "Enter a valid email";
    if (!password) errors.password = "Password is required";
    return errors;
  };

  const handleLogin = async () => {
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      setLoading(true);
      setError('');
      // For admin account, skip face verification
      if (studentId === ADMIN_ID) {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, email, password }),
        });
        if (!response.ok) {
          throw new Error('Login failed');
        }
        const userData = await response.json();
        await login(userData);
        router.push('/admin/dashboard');
        return;
      }
      // For special admin emails, also skip face verification
      const specialAdminEmails = ['admin1@univote.com', 'admin2@univote.com', 'admin3@univote.com'];
      if (specialAdminEmails.includes(email)) {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, email, password }),
        });
        if (!response.ok) {
          throw new Error('Login failed');
        }
        const userData = await response.json();
        await login(userData);
        router.push('/admin/dashboard');
        return;
      }
      // For regular users, show face verification
      setShowFaceVerification(true);
      setLoading(false);
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      setLoading(false);
    }
  };

  const handleVerificationSuccess = async () => {
    await login({ studentId, email });
    router.push('/dashboard');
  };

  const handleVerificationFailure = () => {
    setError('Face verification failed. Please try again.');
    setShowFaceVerification(false);
  };

  const handleFaceCaptured = (descriptor: Float32Array) => {
    setCapturedFaceDescriptor(descriptor);
    // Optionally, trigger verification immediately after capture
    verifyCapturedFace(descriptor);
  };

  const verifyCapturedFace = async (descriptor: Float32Array) => {
    setVerificationComplete(true);
    setError(null);
    setIsVerifying(true);
    if (!studentId) {
      setError("Student ID is required for verification.");
      setVerificationComplete(false);
      setIsVerifying(false);
      return;
    }
    try {
      // Fetch S3 key for this user
      const userRes = await fetch(`/api/users?studentId=${studentId}`);
      const userData = await userRes.json();
      const s3Key = userData.data?.faceImageS3Key;
      if (!s3Key) throw new Error("No stored face for user");
      // Get the stored image from S3 via backend (handled in /api/verify-face)
      const response = await fetch('/api/verify-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, imageData: Array.from(descriptor) }), // Adjust as needed for your capture logic
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification failed');
      }
      const result = await response.json();
      if (result.verified) {
        await login({ studentId });
      setLoginSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      } else {
        setError("Face verification failed. Please try again.");
        setVerificationComplete(false);
      }
    } catch (error: any) {
      setError(error.message || "Face verification failed. Please try again.");
      setVerificationComplete(false);
    } finally {
      setIsVerifying(false);
    }
  };

  // Called when face verification is complete (from FaceVerification component)
  const handleFaceVerificationComplete = async () => {
    if (!capturedFaceDescriptor) {
      setError("Face data not captured. Please try again.");
      setVerificationComplete(false);
      return;
    }
    if (!studentId) {
      setError("Student ID is required for verification.");
      setVerificationComplete(false);
      return;
    }
    await verifyCapturedFace(capturedFaceDescriptor);
  };

  // Placeholder for the function called by FaceVerification on its internal failure (e.g., camera error)
  const handleFaceVerificationError = () => {
    setError("Face verification failed. Please try again.");
    setVerificationComplete(false);
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
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loginSuccess && (
              <Alert className="mb-4">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Login successful! Redirecting...</AlertDescription>
              </Alert>
            )}

            {!showFaceVerification ? (
              <form onSubmit={e => { e.preventDefault(); handleLogin(); }}>
                <div className="mb-4">
                  <Label htmlFor="studentId">Student ID</Label>
                  <div className="relative">
                  <Input
                    id="studentId"
                      type="text"
                    value={studentId}
                      onChange={e => setStudentId(e.target.value)}
                    placeholder="Enter your student ID"
                      className={formErrors.studentId ? 'border-red-500' : ''}
                  />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {formErrors.studentId && <p className="text-red-500 text-xs mt-1">{formErrors.studentId}</p>}
                </div>
                <div className="mb-4">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={formErrors.email ? 'border-red-500' : ''}
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                <div className="mb-4">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={formErrors.password ? 'border-red-500' : ''}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => setShowPassword(v => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                  <div className="flex justify-end mt-1">
                    <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">Forgot password?</Link>
                  </div>
              </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Login'}
                </Button>
              </form>
            ) : (
              <FaceVerification
                onVerificationSuccess={handleVerificationSuccess}
                onVerificationFailure={handleVerificationFailure}
                studentId={studentId}
                requireLiveness={false}
              />
            )}

            <div className="text-center text-sm">
              <Link href="/register" className="text-[#003B71] hover:underline">
                Don&apos;t have an account? Register here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
