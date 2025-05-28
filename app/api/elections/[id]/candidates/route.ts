import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET /api/elections/[id]/candidates - Get all candidates for an election
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await sql`
      SELECT 
        c.*,
        u.first_name,
        u.last_name,
        u.department,
        COUNT(v.id) as vote_count
      FROM candidates c
      JOIN users u ON c.student_id = u.student_id
      LEFT JOIN votes v ON c.id = v.candidate_id
      WHERE c.election_id = ${params.id}
      GROUP BY c.id, u.first_name, u.last_name, u.department
      ORDER BY c.position, vote_count DESC;
    `;

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/elections/[id]/candidates - Add a new candidate
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userData = await request.json();
    const { studentId, position, manifesto } = userData;

    // Basic validation
    if (!studentId || !position) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if election exists and is in draft status
    const election = await sql`
      SELECT status FROM elections WHERE id = ${params.id}
    `;

    if (election.count === 0) {
      return NextResponse.json({ message: 'Election not found' }, { status: 404 });
    }

    if (election[0].status !== 'draft') {
      return NextResponse.json({ message: 'Cannot add candidates to a non-draft election' }, { status: 400 });
    }

    // Check if student exists
    const student = await sql`
      SELECT id FROM users WHERE student_id = ${studentId}
    `;

    if (student.count === 0) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    // Check if student is already a candidate
    const existingCandidate = await sql`
      SELECT id FROM candidates 
      WHERE election_id = ${params.id} AND student_id = ${studentId}
    `;

    if (existingCandidate.count > 0) {
      return NextResponse.json({ message: 'Student is already a candidate' }, { status: 400 });
    }

    // Add the candidate
    const result = await sql`
      INSERT INTO candidates (
        election_id,
        student_id,
        position,
        manifesto
      )
      VALUES (
        ${params.id},
        ${studentId},
        ${position},
        ${manifesto}
      )
      RETURNING id;
    `;

    return NextResponse.json({ 
      message: 'Candidate added successfully',
      candidateId: result[0].id 
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding candidate:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 