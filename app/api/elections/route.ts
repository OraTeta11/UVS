import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { useAuth } from '@/context/AuthContext';

// GET /api/elections - Get all elections
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const department = searchParams.get('department');

    let query = sql`
      SELECT 
        e.*,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name,
        COUNT(DISTINCT c.id) as candidate_count,
        COUNT(DISTINCT v.id) as vote_count
      FROM elections e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN candidates c ON e.id = c.election_id
      LEFT JOIN votes v ON e.id = v.election_id
    `;

    const conditions = [];
    if (status) {
      conditions.push(sql`e.status = ${status}`);
    }
    if (department) {
      conditions.push(sql`e.department = ${department}`);
    }

    if (conditions.length > 0) {
      query = sql`${query} WHERE ${sql.join(conditions, sql` AND `)}`;
    }

    query = sql`${query} GROUP BY e.id, u.first_name, u.last_name ORDER BY e.created_at DESC`;

    const result = await query;
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching elections:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/elections - Create a new election
export async function POST(request: Request) {
  try {
    const userData = await request.json();
    const { title, description, startDate, endDate, department, isDepartmentSpecific } = userData;

    // Basic validation
    if (!title || !startDate || !endDate) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return NextResponse.json({ message: 'End date must be after start date' }, { status: 400 });
    }

    // Insert the new election
    const result = await sql`
      INSERT INTO elections (
        title, 
        description, 
        start_date, 
        end_date, 
        department, 
        is_department_specific,
        status,
        created_by
      )
      VALUES (
        ${title},
        ${description},
        ${startDate},
        ${endDate},
        ${department},
        ${isDepartmentSpecific},
        'draft',
        ${userData.createdBy}
      )
      RETURNING id;
    `;

    return NextResponse.json({ 
      message: 'Election created successfully',
      electionId: result[0].id 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating election:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 