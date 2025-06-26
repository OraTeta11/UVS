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

export async function GET() {
  try {
    const candidates = await sql`
      SELECT c.id, c.election_id, c.full_name, c.position_id, p.title AS position, c.manifesto, c.student_id, c.department, c.gender, c.image_url, c.verified
      FROM candidates c
      LEFT JOIN positions p ON c.position_id = p.id
      ORDER BY c.id
    `;
    const serializedCandidates = candidates.map(serializeRow);
    return NextResponse.json(serializedCandidates);
  } catch (error: any) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: Partial<Candidate> = await request.json();
    const {
      election_id = 1, // Defaulting election_id to 1 as it's not in the form
      full_name,
      position_id,
      student_id,
      department,
      gender,
      manifesto,
      image_url
    } = body;

    if (!full_name || !position_id || !student_id || !department || !gender) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO candidates (election_id, full_name, position_id, student_id, department, gender, manifesto, image_url, verified)
      VALUES (${election_id}, ${full_name}, ${position_id}, ${student_id}, ${department}, ${gender}, ${manifesto}, ${image_url}, false)
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating candidate:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
} 