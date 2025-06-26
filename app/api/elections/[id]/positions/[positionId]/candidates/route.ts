import { NextResponse } from 'next/server';
import { addCandidate, candidateSchema } from '@/lib/db/utils';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { notifyClients as notifyCandidateClients } from '@/app/api/candidates/stream';

export async function POST(
  request: Request,
  { params }: { params: { id: string; positionId: string } }
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
    const validatedData = candidateSchema.parse(data);
    const candidateId = await addCandidate(
      electionId,
      validatedData
    );
    await notifyCandidateClients();
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

    // Build update query and values array
    const fields = [];
    const values = [];
    let paramIndex = 1;
    if (validatedData.full_name !== undefined) { fields.push(`full_name = $${paramIndex++}`); values.push(validatedData.full_name); }
    if (validatedData.student_id !== undefined) { fields.push(`student_id = $${paramIndex++}`); values.push(validatedData.student_id); }
    if (validatedData.department !== undefined) { fields.push(`department = $${paramIndex++}`); values.push(validatedData.department); }
    if (validatedData.gender !== undefined) { fields.push(`gender = $${paramIndex++}`); values.push(validatedData.gender); }
    if (validatedData.image_url !== undefined) { fields.push(`image_url = $${paramIndex++}`); values.push(validatedData.image_url); }
    if (validatedData.position_id !== undefined) { fields.push(`position_id = $${paramIndex++}`); values.push(validatedData.position_id); }
    if (validatedData.manifesto !== undefined) { fields.push(`manifesto = $${paramIndex++}`); values.push(validatedData.manifesto); }
    if (validatedData.verified !== undefined) { fields.push(`verified = $${paramIndex++}`); values.push(validatedData.verified); }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Add candidateId as the last parameter
    values.push(candidateId);
    const query = `UPDATE candidates SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await sql.query(query, values);
    const updatedRow = result[0] || (result.rows && result.rows[0]);
    if (!updatedRow) {
      return NextResponse.json({ error: 'Candidate not found or not updated' }, { status: 404 });
    }
    await notifyCandidateClients();
    return NextResponse.json({ message: 'Candidate updated successfully', candidate: updatedRow });
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
    await sql.query('DELETE FROM candidates WHERE id = $1', [candidateId]);
    await notifyCandidateClients();
    return NextResponse.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json({ error: 'Failed to delete candidate' }, { status: 500 });
  }
} 