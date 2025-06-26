'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService, LoginCredentials, RegisterData, AuthResponse } from '../lib/services/auth';
import { usePathname, useRouter } from "next/navigation"

interface User {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  gender: string;
  role: string;
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials | User) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials | User) => {
    setLoading(true);
    setError(null);
    try {
      let userObj: User;
      if (!('firstName' in credentials)) {
        // If credentials don't have firstName, it's a login attempt
        const response = await authService.login(credentials as LoginCredentials);
        userObj = response.user;
      } else {
        // Full user object provided (e.g., from admin login)
        userObj = credentials as User;
      }
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));

      console.log('Login successful, redirecting user with role:', userObj.role);
      
      // Redirect based on role and verification status
      const adminRoles = ['Class Representative', 'Guild Member', 'Dean'];
      if (userObj.role === 'system_admin') {
        router.push('/admin/dashboard');
      } else if (adminRoles.includes(userObj.role)) {
        if (!userObj.verified) {
          router.push('/admin/request');
        } else {
          router.push('/admin/dashboard');
        }
      } else if (userObj.role === 'Student') {
        router.push('/dashboard');
      } else {
        console.log('No role match found, using fallback route');
        router.push('/login');
      }

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect based on role and verification status
      const adminRoles = ['Class Representative', 'Guild Member', 'Dean'];
      if (adminRoles.includes(response.user.role)) {
        router.push('/admin/request');
      } else if (response.user.role === 'system_admin') {
        router.push('/admin/dashboard');
      } else if (response.user.role === 'Student') {
        router.push('/login');
      } else {
        // fallback
      }

    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      error,
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 