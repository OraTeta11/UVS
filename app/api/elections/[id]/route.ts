import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET /api/elections/[id] - Get election details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await sql`
      SELECT 
        e.*,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name,
        COUNT(DISTINCT c.id) as candidate_count,
        COUNT(DISTINCT v.id) as vote_count,
        json_agg(
          json_build_object(
            'id', c.id,
            'student_id', c.student_id,
            'position', c.position,
            'manifesto', c.manifesto,
            'votes', COUNT(v.id)
          )
        ) as candidates
      FROM elections e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN candidates c ON e.id = c.election_id
      LEFT JOIN votes v ON c.id = v.candidate_id
      WHERE e.id = ${params.id}
      GROUP BY e.id, u.first_name, u.last_name
    `;

    if (result.count === 0) {
      return NextResponse.json({ message: 'Election not found' }, { status: 404 });
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching election:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/elections/[id] - Update election
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userData = await request.json();
    const { title, description, startDate, endDate, status, department, isDepartmentSpecific } = userData;

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

    // Update the election
    const result = await sql`
      UPDATE elections
      SET 
        title = ${title},
        description = ${description},
        start_date = ${startDate},
        end_date = ${endDate},
        status = ${status},
        department = ${department},
        is_department_specific = ${isDepartmentSpecific},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING id;
    `;

    if (result.count === 0) {
      return NextResponse.json({ message: 'Election not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Election updated successfully',
      electionId: result[0].id 
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating election:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/elections/[id] - Delete election
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await sql`
      DELETE FROM elections
      WHERE id = ${params.id}
      RETURNING id;
    `;

    if (result.count === 0) {
      return NextResponse.json({ message: 'Election not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Election deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting election:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 