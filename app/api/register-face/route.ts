import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { uploadToS3 } from "@/lib/services/s3";

export async function POST(request: Request) {
  try {
    const { studentId, imageData } = await request.json();

    if (!studentId || !imageData) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Upload to S3
    const s3Key = await uploadToS3(imageData, studentId);

    // Store S3 key in DB
    await sql`
      UPDATE users
      SET face_image_s3_key = ${s3Key}
      WHERE student_id = ${studentId}
    `;

    return NextResponse.json({ 
      message: 'Face registration successful',
      s3Key
    }, { status: 200 });

  } catch (error) {
    console.error('Error during face registration:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 