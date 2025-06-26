import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { uploadToS3 } from "@/lib/services/s3";

export async function POST(request: Request) {
  try {
    const { studentId, imageData } = await request.json();
    console.log(`[Register Face] Received request for studentId: ${studentId}`);

    if (!studentId || !imageData) {
      console.error('[Register Face] Missing required fields.');
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Upload to S3
    console.log('[Register Face] Uploading image to S3...');
    const s3Key = await uploadToS3(imageData, studentId);
    console.log(`[Register Face] S3 upload successful. Key: ${s3Key}`);

    if (!s3Key) {
      console.error('[Register Face] S3 key is null or undefined after upload.');
      throw new Error('Failed to get S3 key after upload.');
    }

    // Store S3 key in DB
    const result = await sql`
      UPDATE users
      SET face_image_s3_key = ${s3Key}
      WHERE student_id = ${studentId}
      RETURNING id
    `;
    console.log('[Register Face] DB update result:', result);

    if (!result || result.length === 0) {
      console.error(`[Register Face] Failed to update face_image_s3_key for studentId: ${studentId}.`);
      return NextResponse.json({ message: `Failed to update face_image_s3_key for student ID ${studentId}` }, { status: 500 });
    }

    console.log(`[Register Face] Successfully registered face for studentId: ${studentId}`);
    return NextResponse.json({ 
      message: 'Face registration successful',
      s3Key
    }, { status: 200 });

  } catch (error) {
    console.error('[Register Face] A critical error occurred:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 