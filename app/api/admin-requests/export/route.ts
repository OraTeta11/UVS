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
      SELECT ar.id, u.first_name, u.last_name, u.email, ar.title, ar.school, ar.department, ar.reason, ar.status, ar.created_at
      FROM admin_requests ar
      JOIN users u ON ar.user_id = u.id
      ORDER BY ar.created_at DESC
    `;
    const csv = toCSV(result.rows);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="admin_requests.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export admin requests' }, { status: 500 });
  }
} 