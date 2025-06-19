import { NextResponse } from 'next/server';
import { addCandidate, candidateSchema } from '@/lib/db/utils';
import { z } from 'zod';
import { sql } from '@vercel/postgres';

export async function POST(
  request: Request,
  { params }: { params: { id: string; positionId: string } }
) {
  try {
    const electionId = parseInt(params.id);
    const positionId = parseInt(params.positionId);

    if (isNaN(electionId) || isNaN(positionId)) {
      return NextResponse.json(
        { error: 'Invalid election or position ID' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const validatedData = candidateSchema.parse(data);

    const candidateId = await addCandidate(
      electionId,
      positionId,
      validatedData
    );

    return NextResponse.json(
      { message: 'Candidate added successfully', candidateId },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid candidate data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error adding candidate:', error);
    return NextResponse.json(
      { error: 'Failed to add candidate' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string; positionId: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get('candidateId');
    if (!candidateId) {
      return NextResponse.json({ error: 'Missing candidateId' }, { status: 400 });
    }
    const data = await request.json();
    const validatedData = candidateSchema.partial().parse(data);
    const updates = [];
    if (validatedData.verified !== undefined) updates.push(sql`verified = ${validatedData.verified}`);
    if (validatedData.manifesto !== undefined) updates.push(sql`manifesto = ${validatedData.manifesto}`);
    if (validatedData.imageUrl !== undefined) updates.push(sql`image_url = ${validatedData.imageUrl}`);
    if (updates.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }
    await sql.unsafe(`UPDATE candidates SET ${updates.map(u => u.text).join(', ')} WHERE id = $1`, [candidateId]);
    return NextResponse.json({ message: 'Candidate updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid candidate data', details: error.errors }, { status: 400 });
    }
    console.error('Error updating candidate:', error);
    return NextResponse.json({ error: 'Failed to update candidate' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string; positionId: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get('candidateId');
    if (!candidateId) {
      return NextResponse.json({ error: 'Missing candidateId' }, { status: 400 });
    }
    await sql`DELETE FROM candidates WHERE id = ${candidateId}`;
    return NextResponse.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json({ error: 'Failed to delete candidate' }, { status: 500 });
  }
} 