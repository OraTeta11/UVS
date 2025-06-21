import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ message: 'Token and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
        return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Find the token in the database
    const { rows: tokens } = await sql`
      SELECT user_id, expires_at FROM password_reset_tokens WHERE token = ${token}
    `;

    if (tokens.length === 0) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }

    const resetRequest = tokens[0];
    const hasExpired = new Date() > new Date(resetRequest.expires_at);

    if (hasExpired) {
      // Clean up expired token
      await sql`DELETE FROM password_reset_tokens WHERE token = ${token}`;
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }
    
    // Hash the new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update the user's password
    await sql`
      UPDATE users
      SET password_hash = ${passwordHash}
      WHERE id = ${resetRequest.user_id}
    `;

    // Delete the used token
    await sql`DELETE FROM password_reset_tokens WHERE token = ${token}`;

    return NextResponse.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
} 