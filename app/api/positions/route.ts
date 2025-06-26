import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const positions = await sql`SELECT * FROM positions`;
    
    // Ensure all data is serializable
    const serializableRows = positions.map((row: any) => {
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
    });

    return NextResponse.json(serializableRows);
  } catch (error: any) {
    console.error("Error in /api/positions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { electionId, title, description = "", maxVotes = 1 } = body;

    if (!electionId || !title) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO positions (election_id, title, description, max_votes)
      VALUES (${electionId}, ${title}, ${description}, ${maxVotes})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error("Error creating position:", error);
    return NextResponse.json({ message: 'Failed to create position', error: error.message }, { status: 500 });
  }
} 