import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET /api/elections/[id]/candidates - Get all candidates for an election
export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    // Log request details for debugging
    console.log('[API] /api/elections/[id]/candidates GET', {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      params: context.params,
    });
    const params = await context.params;
    const electionId = params.id;
    const result = await sql`
      SELECT 
        c.id, 
        c.election_id, 
        c.full_name as name, 
        c.position_id, 
        p.title AS position, 
        c.manifesto, 
        c.student_id, 
        c.department as faculty, 
        c.gender, 
        c.image_url as image, 
        c.verified,
        '2024' as year
      FROM candidates c
      LEFT JOIN positions p ON c.position_id = p.id
      WHERE c.election_id = ${electionId}
      ORDER BY p.title, c.full_name
    `;
    
    // Transform the data to match frontend expectations
    const transformedCandidates = result.map(candidate => ({
      id: candidate.id.toString(),
      name: candidate.name,
      faculty: candidate.faculty,
      year: candidate.year,
      manifesto: candidate.manifesto || '',
      image: candidate.image || '/placeholder.svg',
      position: candidate.position,
      position_id: candidate.position_id,
      student_id: candidate.student_id,
      gender: candidate.gender,
      verified: candidate.verified
    }));
    
    return NextResponse.json(transformedCandidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}

// POST /api/elections/[id]/candidates - Add a new candidate
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userData = await request.json();
    const { full_name, position, manifesto } = userData;

    // Basic validation
    if (!full_name || !position) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if election exists and is in draft status
    const election = await sql`
      SELECT status FROM elections WHERE id = ${params.id}
    `;

    if (election.length === 0) {
      return NextResponse.json({ message: 'Election not found' }, { status: 404 });
    }

    if (election[0].status !== 'draft') {
      return NextResponse.json({ message: 'Cannot add candidates to a non-draft election' }, { status: 400 });
    }

    // Check if candidate is already added for this position
    const existingCandidate = await sql`
      SELECT id FROM candidates 
      WHERE election_id = ${params.id} AND full_name = ${full_name} AND position = ${position}
    `;

    if (existingCandidate.length > 0) {
      return NextResponse.json({ message: 'Candidate is already added for this position' }, { status: 400 });
    }

    // Add the candidate
    const result = await sql`
      INSERT INTO candidates (
        election_id,
        full_name,
        position,
        manifesto
      )
      VALUES (
        ${params.id},
        ${full_name},
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