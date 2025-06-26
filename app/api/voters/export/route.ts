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
      SELECT student_id, first_name, last_name, email, department, role, verified
      FROM users
      WHERE role = 'Student' OR role = 'Voter'
      ORDER BY last_name, first_name
    `;
    const csv = toCSV(result.rows);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="voters.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export voters' }, { status: 500 });
  }
} 