export interface User {
  id: string; // UUID
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: 'IS' | 'IT' | 'CS' | 'CSE';
  gender?: string;
  faceDescriptor?: number[];
  role: 'Student' | 'Class Representative' | 'Guild Member' | 'Dean' | 'system_admin';
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  verified: boolean;
}

export interface Election {
  id: number; // SERIAL
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  requireFaceVerification: boolean;
  allowAbstentions: boolean;
  createdBy: string; // UUID reference to User
  createdAt: Date;
  updatedAt: Date;
  positions: Position[];
}

export interface Position {
  id: number; // SERIAL
  electionId: number;
  title: string;
  description: string;
  maxVotes: number;
  createdAt: Date;
  updatedAt: Date;
  candidates: Candidate[];
}

export interface Candidate {
  id: number; // SERIAL
  election_id: number;
  position_id: number;
  student_id: string;
  full_name: string;
  department: string;
  gender: string;
  manifesto?: string;
  image_url?: string;
  vote_count: number;
  verified?: boolean;
  created_at: Date;
  updated_at: Date;
  position?: string;
}

export interface Vote {
  id: number; // SERIAL
  electionId: number;
  positionId: number;
  candidateId: number;
  voterId: string; // UUID reference to User
  faceVerified: boolean;
  createdAt: Date;
  position?: Position;
  candidate?: Candidate;
  user?: User;
}

export interface ElectionWithDetails extends Election {
  hasVoted: boolean;
  totalVotes?: number;
  eligibleVoters?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
} 