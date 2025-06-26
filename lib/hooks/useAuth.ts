import { useState, useEffect } from 'react';
import { authService, LoginCredentials, RegisterData, AuthResponse } from '../services/auth';
import { toast } from 'sonner';

export const useAuth = () => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Load user data from local storage
        let userData = authService.getCurrentUser();
        if (userData) {
          // If firstName or lastName is missing, fetch from profile API
          if (!userData.firstName || !userData.lastName) {
            const res = await fetch(`/api/users/profile?studentId=${userData.studentId}`);
            if (res.ok) {
              const profile = await res.json();
              userData = { ...userData, ...profile };
              localStorage.setItem('user', JSON.stringify(userData));
            }
          }
          setUser(userData);
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
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
    studentId: user?.studentId || null,
  };
}; 