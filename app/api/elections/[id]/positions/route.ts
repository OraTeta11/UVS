import { NextResponse } from 'next/server';
import { addPosition, positionSchema } from '@/lib/db/utils';
import { z } from 'zod';
import { sql } from '@/lib/db'; // Import the sql instance

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params; // Await params
    console.log('Attempting to fetch positions for election ID:', id);
    const electionId = parseInt(id);
    if (isNaN(electionId)) {
      return NextResponse.json(
        { error: 'Invalid election ID' },
        { status: 400 }
      );
    }

    const positions = await sql`
      SELECT id, election_id as "electionId", title, description, created_at as "createdAt", updated_at as "updatedAt"
      FROM positions
      WHERE election_id = ${electionId}
      ORDER BY created_at ASC
    `;

    return NextResponse.json(positions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch positions' },
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
    const validatedData = positionSchema.parse(data);

    const positionId = await addPosition(electionId, validatedData);

    return NextResponse.json(
      { message: 'Position added successfully', positionId },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid position data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error adding position:', error);
    return NextResponse.json(
      { error: 'Failed to add position' },
      { status: 500 }
    );
  }
} 