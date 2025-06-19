import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
// import { compareFaces } from '@/lib/face-recognition'; // No longer needed for server-side comparison

// Define a threshold for face matching (adjust as needed)
const DISTANCE_THRESHOLD = 0.6; 

// Helper function for Euclidean distance (can be moved to a separate utility if used elsewhere)
function euclideanDistance(descriptor1: number[] | Float32Array, descriptor2: number[] | Float32Array): number {
  if (descriptor1.length !== descriptor2.length) {
    throw new Error("Descriptors must have the same length");
  }
  let sum = 0;
  for (let i = 0; i < descriptor1.length; i++) {
    sum += Math.pow(descriptor1[i] - descriptor2[i], 2);
  }
  return Math.sqrt(sum);
}

export async function POST(request: Request) {
  try {
    const verificationData = await request.json();
    const { studentId, faceDescriptor } = verificationData;

    if (!studentId || !faceDescriptor) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch the stored face descriptor for the given student ID
    const user = await sql`
      SELECT face_descriptor FROM users WHERE student_id = ${studentId};
    `;

    if (user.length === 0 || !user[0].face_descriptor) {
      return NextResponse.json({ message: 'User not found or face not registered' }, { status: 404 });
    }

    const storedDescriptor = new Float32Array(user[0].face_descriptor);

    // 2. Compare the provided face descriptor with the stored one
    const distance = euclideanDistance(faceDescriptor, storedDescriptor);
    const isMatch = distance < DISTANCE_THRESHOLD; // Check against the threshold

    if (isMatch) {
      // In a real app, you would also issue a session token or similar here
      return NextResponse.json({ message: 'Face verification successful' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Face verification failed' }, { status: 401 });
    }

  } catch (error) {
    console.error('Error during face verification:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 