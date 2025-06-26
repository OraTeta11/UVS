import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId, title, school, department, reason } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 401 });
    }

    if (!title || !department) {
      return NextResponse.json({ message: 'Title and department are required' }, { status: 400 });
    }

    await sql`
      INSERT INTO admin_requests (user_id, title, school, department, reason)
      VALUES (${userId}, ${title}, ${school}, ${department}, ${reason})
    `;

    return NextResponse.json({ message: 'Admin request submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error submitting admin request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const requests = await sql`
      SELECT 
        ar.id, 
        ar.user_id, 
        u.first_name, 
        u.last_name, 
        u.email, 
        ar.title, 
        ar.school, 
        ar.department, 
        ar.reason, 
        ar.status,
        ar.created_at
      FROM admin_requests ar
      JOIN users u ON ar.user_id = u.id
      ORDER BY ar.created_at ASC
    `;

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching admin requests:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { requestId, status, userId } = await request.json();

    if (!requestId || !status || (status === 'approved' && !userId)) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    // 1. Update the admin_requests table
    await sql`
      UPDATE admin_requests
      SET status = ${status}
      WHERE id = ${requestId}
    `;

    // 2. If approved, update the user's role and verification status
    if (status === 'approved') {
      await sql`
        UPDATE users
        SET 
          verified = TRUE,
          role = 'admin'
        WHERE id = ${userId}
      `;
    }

    return NextResponse.json({ message: `Request ${status}` });
  } catch (error) {
    console.error('Error updating admin request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}