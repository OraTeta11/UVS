"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Loader2, Lock, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!password) {
      errors.password = "New password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-[#003B71]">Reset Password</CardTitle>
            <CardDescription>
              Enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success ? (
              <div className="text-center">
                <Alert className="mb-4">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Your password has been reset successfully.
                  </AlertDescription>
                </Alert>
                <Button asChild>
                  <Link href="/login">Return to Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className={formErrors.password ? 'border-red-500' : ''}
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 p-0" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                </div>

                <div className="mb-4">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className={formErrors.confirmPassword ? 'border-red-500' : ''}
                    />
                     <Button type="button" variant="ghost" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 p-0" onClick={() => setShowConfirmPassword(v => !v)} tabIndex={-1}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {formErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>}
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reset Password'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 