import { useState, useEffect } from 'react';
import { authService, LoginCredentials, RegisterData, AuthResponse } from '../services/auth';
import { toast } from 'sonner';

export const useAuth = () => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = authService.getToken();
    if (token) {
      // You might want to validate the token here
      // For now, we'll just set loading to false
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      setUser(response.user);
      toast.success('Login successful');
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      toast.error('Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      setUser(response.user);
      toast.success('Registration successful');
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      toast.error('Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      authService.logout();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      toast.error('Logout failed');
    }
  };

  const verifyFace = async (faceData: { faceDescriptor: Float32Array; studentId: string }) => {
    try {
      setLoading(true);
      setError(null);
      const verified = await authService.verifyFace(faceData);
      if (verified) {
        toast.success('Face verification successful');
      } else {
        toast.error('Face verification failed');
      }
      return verified;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Face verification failed');
      toast.error('Face verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    verifyFace,
    isAuthenticated: !!user,
  };
}; 