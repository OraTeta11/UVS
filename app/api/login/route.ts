import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

const ADMIN_ID = '999999999';

const SPECIAL_ADMINS = [
  { email: 'admin1@univote.com' },
  { email: 'admin2@univote.com' },
  { email: 'admin3@univote.com' },
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const studentId = formData.get('studentId') as string;
    const email = formData.get('email') as string;

    // Basic validation
    if (!studentId || !email) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Query the database to find the user
    const result = await sql`
      SELECT id, student_id, first_name, last_name, email, department, gender, role, verified
      FROM users
      WHERE student_id = ${studentId} AND email = ${email}
    `;

    if (result.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user = result[0];

    // Skip password check for admin account
    if (studentId === ADMIN_ID) {
      return NextResponse.json({
        id: user.id,
        studentId: user.student_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        department: user.department,
        gender: user.gender,
        role: user.role,
        verified: user.verified
      }, { status: 200 });
    }

    // Special admin login logic
    const specialAdmin = SPECIAL_ADMINS.find(a => a.email === email);
    if (specialAdmin) {
      return NextResponse.json({
        id: 'special-admin',
        studentId: 'ADMIN99999',
        firstName: 'Super',
        lastName: 'Admin',
        email,
        department: 'Administration',
        gender: 'Other',
        role: 'admin',
        verified: true
      }, { status: 200 });
    }

    // Return the user data
    return NextResponse.json({
      id: user.id,
      studentId: user.student_id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      department: user.department,
      gender: user.gender,
      role: user.role,
      verified: user.verified
    }, { status: 200 });

  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 