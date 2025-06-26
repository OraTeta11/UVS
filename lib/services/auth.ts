import { api } from './api';

export interface LoginCredentials {
  studentId: string;
  email: string;
  faceDescriptor?: Float32Array;
}

export interface RegisterData {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  gender: string;
}

export interface AuthResponse {
  user: {
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    gender: string;
    role: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      // Store user data
      localStorage.setItem('user', JSON.stringify(data));
      return { user: data };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      // Store user data
      localStorage.setItem('user', JSON.stringify(data));
      return { user: data };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  verifyFace: async (faceData: { faceDescriptor: Float32Array; studentId: string }): Promise<boolean> => {
    try {
      const response = await fetch('/api/verify-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faceData),
      });

      if (!response.ok) {
        throw new Error('Face verification failed');
      }

      const data = await response.json();
      return data.verified || false;
    } catch (error) {
      console.error('Face verification error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('user');
  },
}; 