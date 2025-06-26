import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { notifyClients as notifyVoterClients } from '@/app/api/voters/stream';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');
    
    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const user = await sql`
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
        notification_preferences as "notificationPreferences",
        image_url as "imageUrl",
        face_image_s3_key as "faceImageS3Key"
      FROM users 
      WHERE student_id = ${studentId}
    `;

    if (!user || user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { studentId, ...updateData } = data;

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const updatedUser = await sql`
      UPDATE users
      SET
        first_name = ${updateData.firstName},
        last_name = ${updateData.lastName},
        email = ${updateData.email},
        department = ${updateData.department},
        gender = ${updateData.gender},
        role = ${updateData.role},
        notification_preferences = ${JSON.stringify(updateData.notifications)},
        image_url = ${updateData.imageUrl},
        face_image_s3_key = ${updateData.faceImageS3Key},
        updated_at = NOW()
      WHERE student_id = ${studentId}
      RETURNING *
    `;

    if (!updatedUser || updatedUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await notifyVoterClients();

    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
} 