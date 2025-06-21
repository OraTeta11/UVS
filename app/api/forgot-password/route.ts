import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import crypto from 'crypto';

// In a real app, you would use a robust email service like SendGrid, Resend, etc.
async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${token}`;
  
  console.log('--- PASSWORD RESET EMAIL ---');
  console.log(`To: ${email}`);
  console.log('Subject: Reset Your Password');
  console.log('Body: Click the link below to reset your password.');
  console.log(`Link: ${resetLink}`);
  console.log('--- END OF EMAIL ---');

  // For demonstration. In a real app, this would be an actual email sending implementation.
  // e.g., using nodemailer or a transactional email API.
  return Promise.resolve();
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const { rows: users } = await sql`SELECT id FROM users WHERE email = ${email}`;

    // Always return a success-like response to prevent email enumeration attacks.
    // Only proceed if a user with that email was actually found.
    if (users.length > 0) {
      const user = users[0];
      
      // Generate a secure, URL-safe token
      const token = crypto.randomBytes(32).toString('hex');
      const oneHour = 3600 * 1000; // 1 hour in milliseconds
      const expiresAt = new Date(Date.now() + oneHour);

      // Store the token in the database
      await sql`
        INSERT INTO password_reset_tokens (user_id, token, expires_at)
        VALUES (${user.id}, ${token}, ${expiresAt.toISOString()})
      `;

      // Send the email
      await sendPasswordResetEmail(email, token);
    }

    return NextResponse.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    // Generic error to avoid leaking implementation details
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
} 