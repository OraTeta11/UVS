import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const electionId = parseInt(id);
    if (isNaN(electionId)) {
      return NextResponse.json({ error: 'Invalid election ID' }, { status: 400 });
    }
    const votes = await sql`
      SELECT v.*, u.first_name, u.last_name, u.student_id, u.department, c.full_name as candidate_name, p.title as position_title
      FROM votes v
      JOIN users u ON v.voter_id = u.id
      JOIN candidates c ON v.candidate_id = c.id
      JOIN positions p ON v.position_id = p.id
      WHERE v.election_id = ${electionId}
    `;
    console.log('Raw votes object from SQL (should be an array):', votes);
    return NextResponse.json(votes);
  } catch (error) {
    console.error('Error fetching votes in API route:', error);
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const voteId = searchParams.get('voteId');
    if (!voteId) {
      return NextResponse.json({ error: 'Missing voteId' }, { status: 400 });
    }
    await sql`DELETE FROM votes WHERE id = ${voteId}`;
    return NextResponse.json({ message: 'Vote deleted successfully' });
  } catch (error) {
    console.error('Error deleting vote:', error);
    return NextResponse.json({ error: 'Failed to delete vote' }, { status: 500 });
  }
} 