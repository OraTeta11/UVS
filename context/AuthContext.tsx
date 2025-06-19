'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  studentId: string | null;
  role: string | null;
  login: (studentId: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  studentId: null,
  role: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const login = (studentId: string, role: string) => {
    setStudentId(studentId);
    setRole(role);
  };

  const logout = () => {
    setStudentId(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ studentId, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 