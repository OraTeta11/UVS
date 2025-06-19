import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');
    if (studentId) {
      // Fetch only the face descriptor for the given studentId
      const user = await sql`
        SELECT face_descriptor FROM users WHERE student_id = ${studentId}
      `;
      if (!user || user.length === 0 || !user[0].face_descriptor) {
        return NextResponse.json({ error: 'User not found or face not registered' }, { status: 404 });
      }
      return NextResponse.json({ faceDescriptor: user[0].face_descriptor });
    }
    console.log('Attempting to fetch users from database...');
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
    console.log('Raw users object from SQL (should be an array):', users);
    console.log('Successfully fetched users:', users.length, 'rows');
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users in API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 