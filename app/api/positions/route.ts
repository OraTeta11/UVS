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
    const formData = await request.formData();
    const electionId = formData.get('electionId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string || "";
    const maxVotes = formData.get('maxVotes') as string || "1";

    if (!electionId || !title) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO positions (election_id, title, description, max_votes)
      VALUES (${parseInt(electionId)}, ${title}, ${description}, ${parseInt(maxVotes)})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error("Error creating position:", error);
    return NextResponse.json({ message: 'Failed to create position', error: error.message }, { status: 500 });
  }
} 