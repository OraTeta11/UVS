import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const studentId = formData.get('studentId') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const department = formData.get('department') as string;
    const gender = formData.get('gender') as string;
    const role = formData.get('role') as string;
    const faceImageS3Key = formData.get('faceImageS3Key') as string;

    // Basic validation
    if (!studentId || !name || !email || !department || !gender || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Split name into first and last (if possible)
    const [firstName, ...rest] = name.trim().split(' ');
    const lastName = rest.join(' ');

    // Insert user data into the database
    const result = await sql`
      INSERT INTO users (student_id, first_name, last_name, email, department, gender, role, face_image_s3_key)
      VALUES (${studentId}, ${firstName}, ${lastName}, ${email}, ${department}, ${gender}, ${role}, ${faceImageS3Key})
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