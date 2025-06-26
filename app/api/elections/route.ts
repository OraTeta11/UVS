import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { hasUserVoted } from '@/lib/db/utils';

export async function GET(request: Request) {
  noStore();
  try {
    // Get user ID from headers
    const userId = request.headers.get('x-user-id');
    
    const allElections = await sql`
      SELECT 
        id,
        title,
        description,
        start_date,
        end_date,
        status,
        require_face_verification,
        allow_abstentions,
        created_by,
        created_at,
        updated_at
      FROM elections ORDER BY start_date DESC
    `;

    const electionsWithDetails = await Promise.all(
      allElections.map(async (election) => {
        // Get positions for the election
        const electionPositions = await sql`
          SELECT id, title, description, max_votes as "maxVotes"
          FROM positions 
          WHERE election_id = ${election.id}
        `;

        // Get total votes for the election
        const voteCountResult = await sql`
          SELECT COUNT(DISTINCT voter_id) as count
          FROM votes
          WHERE election_id = ${election.id}
        `;
        const totalVotes = Number(voteCountResult[0]?.count || 0);

        // Get total eligible voters (approximated by total users)
        const eligibleVotersResult = await sql`SELECT COUNT(id) as count FROM users`;
        const eligibleVoters = Number(eligibleVotersResult[0]?.count || 0);

        // Check if user has voted in this election
        let hasVoted = false;
        if (userId) {
          hasVoted = await hasUserVoted(election.id, userId);
        }

        return {
          id: election.id,
          title: election.title,
          description: election.description,
          startDate: election.start_date,
          endDate: election.end_date,
          status: election.status,
          requireFaceVerification: election.require_face_verification,
          allowAbstentions: election.allow_abstentions,
          createdBy: election.created_by,
          createdAt: election.created_at,
          updatedAt: election.updated_at,
          positions: electionPositions,
          totalVotes,
          eligibleVoters,
          hasVoted,
        };
      })
    );

    return NextResponse.json(electionsWithDetails);
  } catch (error) {
    console.error('Error fetching elections with details:', error);
    return NextResponse.json({ message: 'Failed to fetch elections' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const createdBy = formData.get('createdBy') as string;

    if (!title || !startDate || !endDate || !createdBy) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO elections (title, description, start_date, end_date, created_by, status)
      VALUES (${title}, ${description}, ${new Date(startDate)}, ${new Date(endDate)}, ${createdBy}, 'upcoming')
      RETURNING *
    `;
    
    const newElection = result[0];

    return NextResponse.json({
      id: newElection.id,
      title: newElection.title,
      description: newElection.description,
      startDate: newElection.start_date,
      endDate: newElection.end_date,
      status: newElection.status,
      requireFaceVerification: newElection.require_face_verification,
      allowAbstentions: newElection.allow_abstentions,
      createdBy: newElection.created_by,
      createdAt: newElection.created_at,
      updatedAt: newElection.updated_at,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating election:', error);
    return NextResponse.json({ message: 'Failed to create election' }, { status: 500 });
  }
} 