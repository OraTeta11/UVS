import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { Candidate } from '@/types';

// Helper to serialize non-JSON-friendly types from the database
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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const candidateId = parseInt(params.id, 10);

  if (isNaN(candidateId)) {
    return NextResponse.json({ message: 'Invalid candidate ID' }, { status: 400 });
  }

  try {
    const body: Partial<Candidate> = await request.json();
    
    // Debug: check if candidate exists before update
    const checkResult = await sql`SELECT * FROM candidates WHERE id = ${candidateId}`;
    console.log('[PATCH] Checking candidate existence for id:', candidateId, 'Result:', checkResult);
    if (!Array.isArray(checkResult) || checkResult.length === 0) {
      return NextResponse.json({ message: 'Candidate not found before update' }, { status: 404 });
    }

    // Manually build the update query to avoid SQL issues
    const updates: string[] = [];
    const values: any[] = [];
    let queryIndex = 1;

    if (body.full_name) {
      updates.push(`full_name = $${queryIndex++}`);
      values.push(body.full_name);
    }
    if (body.position_id) {
      updates.push(`position_id = $${queryIndex++}`);
      values.push(body.position_id);
    }
    if (body.department) {
      updates.push(`department = $${queryIndex++}`);
      values.push(body.department);
    }
    if (body.gender) {
      updates.push(`gender = $${queryIndex++}`);
      values.push(body.gender);
    }
    if (body.manifesto) {
      updates.push(`manifesto = $${queryIndex++}`);
      values.push(body.manifesto);
    }
    if (body.image_url !== undefined) {
      updates.push(`image_url = $${queryIndex++}`);
      values.push(body.image_url);
    }

    if (updates.length === 0) {
      return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    values.push(candidateId);
    
    const query = `UPDATE candidates SET ${updates.join(', ')} WHERE id = $${queryIndex} RETURNING *`;
    
    const result = await sql.unsafe(query, values);
    const updatedRow = Array.isArray(result) ? result[0] : result?.rows?.[0];

    if (!updatedRow) {
      return NextResponse.json({ message: 'Candidate not found or not updated' }, { status: 404 });
    }

    return NextResponse.json(serializeRow(updatedRow));

  } catch (error: any) {
    console.error(`Error updating candidate ${candidateId}:`, error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const candidateId = parseInt(params.id, 10);
  if (isNaN(candidateId)) {
    return NextResponse.json({ message: 'Invalid candidate ID' }, { status: 400 });
  }
  try {
    await sql`DELETE FROM candidates WHERE id = ${candidateId}`;
    return NextResponse.json({ message: 'Candidate deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
} 