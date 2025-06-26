import { toast } from "sonner";

// Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
}

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? `${window.location.origin}/api` 
    : 'http://localhost:3000/api');

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    console.error('API Error Response:', response.status, error);
    throw new Error(error.message || 'An error occurred');
  }
  const data = await response.json();
  return data;
}

// Base API client
export const api = {
  get: async <T>(endpoint: string, customHeaders?: Record<string, string>): Promise<T> => {
    try {
      console.log('Fetching from:', `${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(customHeaders || {}),
        },
        credentials: 'include',
      });
      return handleResponse<T>(response);
    } catch (error) {
      console.error('API GET Error:', error);
      toast.error('Failed to fetch data');
      throw error;
    }
  },

  post: async <T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(headers || {}),
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse<T>(response);
    } catch (error) {
      console.error('API POST Error:', error);
      toast.error('Failed to submit data');
      throw error;
    }
  },

  put: async <T>(endpoint: string, data: any): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse<T>(response);
    } catch (error) {
      console.error('API PUT Error:', error);
      toast.error('Failed to update data');
      throw error;
    }
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      return handleResponse<T>(response);
    } catch (error) {
      console.error('API DELETE Error:', error);
      toast.error('Failed to delete data');
      throw error;
    }
  },
}; 