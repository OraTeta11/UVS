import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { Candidate } from '@/types';

function serializeRow(row: any) {
  const newRow: { [key: string]: any } = {};
  for (const key in row) {
    const value = row[key];
    if (typeof value === 'bigint') {
      newRow[key] = value.toString();
    } else if (value instanceof Date) {
      newRow[key] = value.toISOString();
    } else {
      newRow[key] = value;
    }
  }
  return newRow;
}

export async function PATCH(request: Request, context: any) {
  console.log('[PATCH] Request URL:', request.url);
  const { params } = await context;
  const studentId = params.student_id;
  console.log('[PATCH] studentId param:', studentId, 'type:', typeof studentId);
  if (!studentId) {
    return NextResponse.json({ message: 'Invalid student_id' }, { status: 400 });
  }
  try {
    const body: Partial<Candidate> = await request.json();
    
    // Use proper template literal syntax for neon
    const result = await sql`
      UPDATE candidates 
      SET 
        full_name = COALESCE(${body.full_name}, full_name),
        position_id = COALESCE(${body.position_id}, position_id),
        department = COALESCE(${body.department}, department),
        gender = COALESCE(${body.gender}, gender),
        manifesto = COALESCE(${body.manifesto}, manifesto),
        image_url = COALESCE(${body.image_url}, image_url)
      WHERE student_id = ${studentId} 
      RETURNING *
    `;
    
    const updatedRow = result[0];

    if (!updatedRow) {
      return NextResponse.json({ message: 'Candidate not found or not updated' }, { status: 404 });
    }

    return NextResponse.json(serializeRow(updatedRow));
  } catch (error: any) {
    console.error(`Error updating candidate with student_id ${studentId}:`, error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  console.log('[DELETE] Request URL:', request.url);
  const { params } = await context;
  const studentId = params.student_id;
  console.log('[DELETE] studentId param:', studentId, 'type:', typeof studentId);
  if (!studentId) {
    return NextResponse.json({ message: 'Invalid student_id' }, { status: 400 });
  }
  try {
    const result = await sql`DELETE FROM candidates WHERE student_id = ${studentId}`;
    return NextResponse.json({ message: 'Candidate deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
} 