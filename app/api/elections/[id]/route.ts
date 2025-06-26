import { NextResponse } from 'next/server';
import { getElectionWithDetails, hasUserVoted, submitVote } from '@/lib/db/utils';
import { z } from 'zod';
import { sql } from '@/lib/db';

const voteSchema = z.object({
  candidateId: z.number(),
  faceVerified: z.boolean().default(false),
});

// GET /api/elections/[id] - Get election details
export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    const params = await context.params;
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

    // Get the actual user ID from the request headers
    const userId = request.headers.get('x-user-id');
    let hasVoted = false;
    if (userId) {
      hasVoted = await hasUserVoted(electionId, userId);
    }

    return NextResponse.json({
      ...election,
      hasVoted,
    });
  } catch (error) {
    console.error('Error fetching election:', error);
    return NextResponse.json(
      { error: 'Failed to fetch election', details: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, context: { params: { id: string } }) {
  try {
    const params = await context.params;
    const electionId = parseInt(params.id);
    if (isNaN(electionId)) {
      return NextResponse.json(
        { error: 'Invalid election ID' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const candidateId = formData.get('candidateId') as string;
    const faceVerified = formData.get('faceVerified') as string;
    
    console.log('Vote submission payload:', { candidateId, faceVerified });
    console.log('User ID header:', request.headers.get('x-user-id'));
    
    const validatedData = {
      candidateId: parseInt(candidateId),
      faceVerified: faceVerified === 'true'
    };

    // Get the user ID from the request headers (for now)
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const voteId = await submitVote(
      electionId,
      undefined,
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
export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    const params = await context.params;
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const status = formData.get('status') as string;
    const department = formData.get('department') as string;
    const isDepartmentSpecific = formData.get('isDepartmentSpecific') as string;

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

    if (!result || result.length === 0) {
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
export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const params = await context.params;
    const result = await sql`
      DELETE FROM elections
      WHERE id = ${params.id}
      RETURNING id;
    `;

    if (!result || result.length === 0) {
      return NextResponse.json({ message: 'Election not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Election deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting election:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 