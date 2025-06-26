"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FaceVerification from "@/components/face-recognition/face-verification"
import { AlertCircle, CheckCircle2, Loader2, User, Mail } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { useAuth } from '@/context/AuthContext'
import { useRouter } from "next/navigation"

const ADMIN_ID = '999999999';

export default function LoginPage() {
  const [studentId, setStudentId] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [showFaceVerification, setShowFaceVerification] = useState(false)

  const { login } = useAuth();
  const router = useRouter();

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!/^[0-9]{9}$/.test(studentId)) errors.studentId = "Student ID must be exactly 9 digits";
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = "Enter a valid email";
    return errors;
  };

  const handleLogin = async () => {
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      setError('');
      
      // For admin accounts, skip face verification
      if (studentId === ADMIN_ID || ['admin1@univote.com', 'admin2@univote.com', 'admin3@univote.com'].includes(email)) {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, email }),
        });
        if (!response.ok) {
          throw new Error('Login failed');
        }
        const userData = await response.json();
        await login(userData);
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

  const handleVerificationSuccess = async (credentials: { studentId: string; email: string }) => {
    try {
      await login(credentials);
      setLoginSuccess(true);
    } catch (error) {
      console.error('Login error after verification:', error);
      setError(error instanceof Error ? error.message : 'Failed to login after verification');
    }
  };

  const handleVerificationFailure = (error: string) => {
    setError(error || 'Face verification failed. Please try again.');
    setShowFaceVerification(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Card className="p-6">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl text-[#003B71]">Login</CardTitle>
            <CardDescription className="text-lg">Access your University of Rwanda voting account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loginSuccess && (
              <Alert className="mb-6">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Login successful! Redirecting...</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Credentials Form */}
              <div className="space-y-6 p-6 bg-gray-50 rounded-lg flex flex-col justify-start">
                <form onSubmit={e => { e.preventDefault(); handleLogin(); }} className="space-y-4">
                  <h3 className="text-xl font-semibold mb-2 text-[#003B71]">Enter Your Credentials</h3>
                  <div className="space-y-2">
                    <Label htmlFor="studentId" className="text-sm font-medium">Student ID</Label>
                  <div className="relative">
                  <Input
                    id="studentId"
                      type="text"
                    value={studentId}
                      onChange={e => setStudentId(e.target.value)}
                    placeholder="Enter your student ID"
                        className={`${formErrors.studentId ? 'border-red-500' : ''} pl-3 pr-10`}
                  />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {formErrors.studentId && <p className="text-red-500 text-xs mt-1">{formErrors.studentId}</p>}
                </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email"
                        className={`${formErrors.email ? 'border-red-500' : ''} pl-3 pr-10`}
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                  <Button type="submit" className="w-full bg-[#003B71] hover:bg-[#002b54] mt-2" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Login'}
                </Button>
              </form>
              </div>

              {/* Face Verification */}
              <div className="space-y-4 p-6 bg-gray-50 rounded-lg flex flex-col justify-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#003B71]">Face Verification</h3>
              <FaceVerification
                onVerificationSuccess={handleVerificationSuccess}
                onVerificationFailure={handleVerificationFailure}
                studentId={studentId}
                    email={email}
                requireLiveness={false}
                    autoStart={showFaceVerification}
              />
                </div>
              </div>
            </div>

            <div className="text-center text-sm mt-8 pt-4 border-t border-gray-200">
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
