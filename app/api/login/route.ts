import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { compareFaces } from '@/lib/face-recognition'; // Assuming this import is correct

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    const { studentId, faceDescriptor } = userData;

    // Basic validation
    if (!studentId || !faceDescriptor) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Query the database to find the user
    const result = await sql`
      SELECT id, student_id, first_name, last_name, email, department, gender, face_descriptor, role
      FROM users
      WHERE student_id = ${studentId}
    `;

    if (result.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user = result[0];

    // Compare the face descriptor
    const isMatch = await compareFaces(new Float32Array(faceDescriptor), new Float32Array(user.face_descriptor));

    if (!isMatch) {
      return NextResponse.json({ message: 'Face verification failed' }, { status: 401 });
    }

    // Return the user data
    return NextResponse.json({
      id: user.id,
      studentId: user.student_id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      department: user.department,
      gender: user.gender,
      role: user.role,
    }, { status: 200 });

  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 