import { NextResponse } from 'next/server';
import { getElectionWithDetails, hasUserVoted, submitVote } from '@/lib/db/utils';
import { z } from 'zod';
import { sql } from '@/lib/db';

const voteSchema = z.object({
  positionId: z.number(),
  candidateId: z.number(),
  faceVerified: z.boolean().default(false),
});

// GET /api/elections/[id] - Get election details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const electionId = parseInt(params.id);
    if (isNaN(electionId)) {
      return NextResponse.json(
        { error: 'Invalid election ID' },
        { status: 400 }
      );
    }

    const election = await getElectionWithDetails(electionId);
    if (!election) {
      return NextResponse.json(
        { error: 'Election not found' },
        { status: 404 }
      );
    }

    // TODO: Get the actual user ID from the session
    const userId = '00000000-0000-0000-0000-000000000000'; // Temporary UUID
    const hasVoted = await hasUserVoted(electionId, userId);

    return NextResponse.json({
      ...election,
      hasVoted,
    });
  } catch (error) {
    console.error('Error fetching election:', error);
    return NextResponse.json(
      { error: 'Failed to fetch election' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const electionId = parseInt(params.id);
    if (isNaN(electionId)) {
      return NextResponse.json(
        { error: 'Invalid election ID' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const validatedData = voteSchema.parse(data);

    // TODO: Get the actual user ID from the session
    const userId = '00000000-0000-0000-0000-000000000000'; // Temporary UUID

    const voteId = await submitVote(
      electionId,
      validatedData.positionId,
      validatedData.candidateId,
      userId,
      validatedData.faceVerified
    );

    return NextResponse.json(
      { message: 'Vote submitted successfully', voteId },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid vote data', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'You have already voted for this position') {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    console.error('Error submitting vote:', error);
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    );
  }
}

// PUT /api/elections/[id] - Update election
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userData = await request.json();
    const { title, description, startDate, endDate, status, department, isDepartmentSpecific } = userData;

    // Basic validation
    if (!title || !startDate || !endDate) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return NextResponse.json({ message: 'End date must be after start date' }, { status: 400 });
    }

    // Update the election
    const result = await sql`
      UPDATE elections
      SET 
        title = ${title},
        description = ${description},
        start_date = ${startDate},
        end_date = ${endDate},
        status = ${status},
        department = ${department},
        is_department_specific = ${isDepartmentSpecific},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING id;
    `;

    if (result.count === 0) {
      return NextResponse.json({ message: 'Election not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Election updated successfully',
      electionId: result[0].id 
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating election:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/elections/[id] - Delete election
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await sql`
      DELETE FROM elections
      WHERE id = ${params.id}
      RETURNING id;
    `;

    if (result.count === 0) {
      return NextResponse.json({ message: 'Election not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Election deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting election:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 