import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

function toCSV(rows: any[]) {
  if (!rows.length) return '';
  const header = Object.keys(rows[0]).join(',');
  const data = rows.map(row => Object.values(row).map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  return `${header}\n${data}`;
}

export async function GET() {
  try {
    const result = await sql`
      SELECT c.id as candidate_id, c.election_id, c.position_id, c.user_id, c.manifesto, c.image_url, c.vote_count, c.verified
      FROM candidates c
      ORDER BY c.election_id, c.position_id, c.id
    `;
    const csv = toCSV(result.rows);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="candidates.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export candidates' }, { status: 500 });
  }
} 