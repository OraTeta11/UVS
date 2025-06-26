import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request, context) {
  try {
    const params = await context.params;
    const { studentId } = params;
    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }
    const votes = await sql`
      SELECT 
        v.*, 
        e.title AS election_title, 
        p.title AS position_title, 
        c.student_id AS candidate_student_id
      FROM votes v
      JOIN users u ON v.voter_id = u.id
      JOIN elections e ON v.election_id = e.id
      JOIN positions p ON v.position_id = p.id
      JOIN candidates c ON v.candidate_id = c.id
      WHERE u.student_id = ${studentId}
      ORDER BY v.created_at DESC
    `;
    return NextResponse.json(votes);
  } catch (error) {
    console.error('Error fetching votes by student:', error);
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
  }
} 