import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { notifyClients as notifyVoterClients } from '@/app/api/voters/stream';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');
    if (studentId) {
      // Fetch only the S3 key for the given studentId
      const user = await sql`
        SELECT face_image_s3_key FROM users WHERE student_id = ${studentId}
      `;
      if (!user || user.length === 0 || !user[0].face_image_s3_key) {
        return NextResponse.json({ error: 'User not found or face not registered' }, { status: 404 });
      }
      return NextResponse.json({ data: { faceImageS3Key: user[0].face_image_s3_key } });
    }
    const users = await sql`
      SELECT 
        id,
        student_id as "studentId",
        first_name as "firstName",
        last_name as "lastName",
        email,
        department,
        gender,
        role,
        created_at as "createdAt",
        updated_at as "updatedAt",
        image_url as "imageUrl"
      FROM users
    `;
    return NextResponse.json({ data: users });
  } catch (error) {
    console.error('Error fetching users in API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const studentId = formData.get('studentId') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const department = formData.get('department') as string;
    const gender = formData.get('gender') as string;
    const role = formData.get('role') as string;
    const imageUrl = formData.get('imageUrl') as string;

    if (!studentId || !firstName || !lastName || !email || !department || !gender || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO users (student_id, first_name, last_name, email, department, gender, role, created_at, updated_at, image_url)
      VALUES (${studentId}, ${firstName}, ${lastName}, ${email}, ${department}, ${gender}, ${role}, NOW(), NOW(), ${imageUrl})
      RETURNING *
    `;
    await notifyVoterClients();
    return NextResponse.json({ data: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
  }
} 