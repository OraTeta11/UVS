import { api } from './api';

export interface LoginCredentials {
  studentId: string;
  password: string;
}

export interface RegisterData {
  studentId: string;
  name: string;
  email: string;
  password: string;
  faculty: string;
  year: string;
}

export interface FaceVerificationData {
  faceDescriptor: Float32Array;
  studentId: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    studentId: string;
    name: string;
    email: string;
    faculty: string;
    year: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data) {
      // Store token in localStorage or secure cookie
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    if (response.data) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  verifyFace: async (faceData: FaceVerificationData): Promise<boolean> => {
    const response = await api.post<{ verified: boolean }>('/auth/verify-face', faceData);
    return response.data?.verified || false;
  },

  logout: () => {
    localStorage.removeItem('token');
    // Additional cleanup if needed
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
}; 