import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { compareFaces } from '@/lib/face-recognition'; // Assuming compareFaces can run server-side, or we'll move its logic here

// Note: Running face-api.js comparison on the server-side requires a Node.js compatible build
// and potentially additional dependencies like canvas. Depending on your setup and the size
// of your user base, you might consider performing the comparison on the client-side instead
// after fetching the stored descriptor, or using a dedicated server-side face recognition library.
// For this example, we'll assume compareFaces can be adapted or replaced with server-compatible logic.

export async function POST(request: Request) {
  try {
    const verificationData = await request.json();
    const { studentId, faceDescriptor } = verificationData;

    if (!studentId || !faceDescriptor) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch the stored face descriptor for the given student ID
    const user = await sql`
      SELECT face_descriptor FROM users WHERE student_id = ${studentId};
    `;

    if (user.count === 0 || !user[0].face_descriptor) {
      return NextResponse.json({ message: 'User not found or face not registered' }, { status: 404 });
    }

    const storedDescriptor = new Float32Array(user[0].face_descriptor);

    // 2. Compare the provided face descriptor with the stored one
    // This part depends on whether face-api.js or similar comparison logic can run server-side
    // If not, you would send the storedDescriptor back to the client for comparison.
    let isMatch = false;
    try {
       // Attempt to use the compareFaces function (requires server-side face-api setup)
       isMatch = await compareFaces(new Float32Array(faceDescriptor), storedDescriptor);
    } catch (e) {
      console.warn("Server-side face comparison failed, ensure face-api is configured for Node.js or implement alternative comparison.", e)
      // Fallback or error if server-side comparison isn't set up
      return NextResponse.json({ message: 'Server-side verification not fully configured' }, { status: 500 });
    }


    if (isMatch) {
      // In a real app, you would also issue a session token or similar here
      return NextResponse.json({ message: 'Face verification successful' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Face verification failed' }, { status: 401 });
    }

  } catch (error) {
    console.error('Error during face verification:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 