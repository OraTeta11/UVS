import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    const { studentId, name, email, department, gender, password, faceImageS3Key } = userData;

    // Basic validation
    if (!studentId || !name || !email || !department || !gender || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Split name into first and last (if possible)
    const [firstName, ...rest] = name.trim().split(' ');
    const lastName = rest.join(' ');

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Set the default role to 'voter'
    const role = 'voter';

    // Insert user data into the database
    const result = await sql`
      INSERT INTO users (student_id, first_name, last_name, email, department, gender, password_hash, role, face_image_s3_key)
      VALUES (${studentId}, ${firstName}, ${lastName}, ${email}, ${department}, ${gender}, ${passwordHash}, ${role}, ${faceImageS3Key})
      ON CONFLICT (student_id) DO NOTHING
      RETURNING id;
    `;

    if (result.count === 0 || !result[0] || !result[0].id) {
      return NextResponse.json({ message: 'User registration failed or user with this student ID already exists' }, { status: 409 });
    }

    return NextResponse.json({ message: 'User registered successfully', userId: result[0].id }, { status: 201 });

  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 