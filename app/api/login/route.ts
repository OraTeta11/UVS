import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';

const ADMIN_ID = 'ADMIN12345';

const SPECIAL_ADMINS = [
  { email: 'admin1@univote.com', password: 'AdminOne!2024' },
  { email: 'admin2@univote.com', password: 'AdminTwo!2024' },
  { email: 'admin3@univote.com', password: 'AdminThree!2024' },
];

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    const { studentId, email, password } = userData;

    // Basic validation
    if (!studentId || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Query the database to find the user
    const result = await sql`
      SELECT id, student_id, first_name, last_name, email, department, gender, password_hash, role
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
        role: 'admin',
      }, { status: 200 });
    }

    // Special admin login logic
    const specialAdmin = SPECIAL_ADMINS.find(a => a.email === email && a.password === password);
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
      }, { status: 200 });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
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
    }, { status: 200 });

  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 