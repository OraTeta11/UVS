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
    const data = await request.json();
    // Add user logic (simplified, add validation as needed)
    const result = await sql`
      C:\Users\Ora\Documen…didates\page.tsx:35 
 GET http://localhost:3000/api/elections/1/candidates 500 (Internal Server Error)

:3000/api/candidates/stream:1 
 GET http://localhost:3000/api/candidates/stream net::ERR_ABORTED 404 (Not Found)
:3000/api/voters/stream:1 
 GET http://localhost:3000/api/voters/stream net::ERR_ABORTED 404 (Not Found)
C:\Users\Ora\Documen…\services\api.ts:34 
 GET http://localhost:3000/api/elections/1/votes 500 (Internal Server Error)
C:\Users\Ora\Documen…\services\api.ts:22 API Error Response: 500 
{error: 'Failed to fetch votes'}
C:\Users\Ora\Documen…\services\api.ts:34 
 GET http://localhost:3000/api/elections/1/votes 500 (Internal Server Error)
C:\Users\Ora\Documen…\services\api.ts:22 API Error Response: 500 
{error: 'Failed to fetch votes'}
﻿
INSERT INTO users (student_id, first_name, last_name, email, department, gender, role, created_at, updated_at, image_url)
      VALUES (${data.studentId}, ${data.firstName}, ${data.lastName}, ${data.email}, ${data.department}, ${data.gender}, ${data.role}, NOW(), NOW(), ${data.imageUrl})
      RETURNING *
    `;
    await notifyVoterClients();
    return NextResponse.json({ data: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
  }
} 