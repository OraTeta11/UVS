export interface User {
  id: string; // UUID
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: 'IS' | 'IT' | 'CS' | 'CSE';
  gender?: string;
  faceDescriptor?: number[];
  role: 'admin' | 'voter';
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
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
  electionId: number;
  positionId: number;
  userId: string; // UUID reference to User
  manifesto?: string;
  imageUrl?: string;
  voteCount: number;
  verified?: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
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