import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { z } from 'zod';
import { getElectionsByStatus, createElection, electionSchema } from '@/lib/db/utils';

export async function GET(request: Request) {
  try {
    console.log('API: Entering GET /api/elections');
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const department = searchParams.get('department');

    const conditions = [];
    if (status) {
      conditions.push(sql`e.status = ${status}`);
    }
    if (department) {
      conditions.push(sql`e.department = ${department}`);
    }

    let whereClause = sql``;
    if (conditions.length > 0) {
      whereClause = sql`WHERE ${conditions[0]}`;
      for (let i = 1; i < conditions.length; i++) {
        whereClause = sql`${whereClause} AND ${conditions[i]}`;
      }
    }

    console.log('API: Executing first SQL query for elections...');
    const elections = await sql`
      SELECT 
        e.id,
        e.title,
        e.description,
        e.start_date as "startDate",
        e.end_date as "endDate",
        e.status,
        e.department,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name,
        COUNT(DISTINCT c.id) as candidate_count,
        COUNT(DISTINCT v.id) as vote_count
      FROM elections e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN candidates c ON e.id = c.election_id
      LEFT JOIN votes v ON e.id = v.election_id
      ${whereClause}
      GROUP BY e.id, u.first_name, u.last_name
      ORDER BY e.created_at DESC
    `;
    console.log('API: First SQL query complete. Elections count:', elections.length);

    // If no elections found, return test data
    if (!elections || elections.length === 0) {
      console.log('No elections found, returning test data');
      const testData = [
        {
          id: '1',
          title: 'Student Council Elections 2024',
          description: 'Vote for your student representatives',
          startDate: '2024-05-01',
          endDate: '2024-05-15',
          status: 'active',
          department: 'All',
          creator_first_name: 'Admin',
          creator_last_name: 'User',
          candidate_count: 5,
          vote_count: 0,
          positions: [
            { id: '1', title: 'President' },
            { id: '2', title: 'Vice President' }
          ],
          hasVoted: false
        },
        {
          id: '2',
          title: 'Faculty Representative Election',
          description: 'Select your faculty representative',
          startDate: '2024-06-01',
          endDate: '2024-06-15',
          status: 'upcoming',
          department: 'Science',
          creator_first_name: 'Admin',
          creator_last_name: 'User',
          candidate_count: 3,
          vote_count: 0,
          positions: [
            { id: '3', title: 'Faculty Representative' }
          ],
          hasVoted: false
        }
      ];
      return NextResponse.json(testData, { status: 200 });
    }

    console.log('API: Processing elections to get positions and vote status...');
    // Then, for each election, get its positions
    const electionsWithPositions = await Promise.all(
      elections.map(async (election) => {
        console.log(`API: Fetching positions for election ${election.id}`);
        const positions = await sql`
          SELECT DISTINCT p.id, p.title
          FROM positions p
          WHERE p.election_id = ${election.id}
        `;
        console.log(`API: Positions fetched for election ${election.id}. Count: ${positions.length}`);

        // Check if the current user has voted in this election
        // TODO: Replace '12345' with actual user ID from session
        console.log(`API: Checking vote status for election ${election.id}`);
        const hasVoted = await sql`
          SELECT EXISTS (
            SELECT 1 FROM votes v
            WHERE v.election_id = ${election.id}
            AND v.voter_id = '12345'
          ) as has_voted
        `;
        console.log(`API: Vote status checked for election ${election.id}. hasVoted: ${hasVoted[0]?.has_voted}`);

        return {
          ...election,
          positions: positions || [],
          hasVoted: hasVoted[0]?.has_voted || false
        };
      })
    );

    console.log('Returning elections:', electionsWithPositions.length, 'elections processed.');
    return NextResponse.json(electionsWithPositions, { status: 200 });
  } catch (error) {
    console.error('Error fetching elections:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, description, startDate, endDate, department, isDepartmentSpecific } = data;

    // Basic validation (using manual validation for now, can be replaced by electionSchema.parse if it fits)
    if (!title || !startDate || !endDate) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return NextResponse.json({ message: 'End date must be after start date' }, { status: 400 });
    }

    // TODO: Get the actual user ID from the session
    const createdBy = '00000000-0000-0000-0000-000000000000'; // Temporary UUID

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
        ${createdBy}
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