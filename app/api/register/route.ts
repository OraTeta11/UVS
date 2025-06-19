import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    const { studentId, firstName, lastName, email, department, gender, faceDescriptor } = userData;

    // Basic validation (you'll want more robust validation)
    if (!studentId || !firstName || !lastName || !email || !faceDescriptor) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Set the default role to 'voter'
    const role = 'voter';

    // Convert faceDescriptor back to a PostgreSQL array format if needed
    // In this case, since we are inserting an array of REAL, the array from frontend should work directly

    // Insert user data into the database
    const result = await sql`
      INSERT INTO users (student_id, first_name, last_name, email, department, gender, face_descriptor, role)
      VALUES (${studentId}, ${firstName}, ${lastName}, ${email}, ${department}, ${gender}, ${faceDescriptor}, ${role})
      ON CONFLICT (student_id) DO NOTHING
      RETURNING id;
    `;

    if (result.count === 0) {
      return NextResponse.json({ message: 'User with this student ID already exists' }, { status: 409 });
    }

    return NextResponse.json({ message: 'User registered successfully', userId: result[0].id }, { status: 201 });

  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 