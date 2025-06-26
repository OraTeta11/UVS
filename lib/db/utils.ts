import { sql } from '@/lib/db';
import { z } from 'zod';
import { Election, Position, Candidate, Vote } from '@/types';

// Validation schemas
export const electionSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: z.enum(['upcoming', 'active', 'completed']).default('upcoming'),
  requireFaceVerification: z.boolean().default(true),
  allowAbstentions: z.boolean().default(false),
});

export const positionSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  maxVotes: z.number().int().positive().default(1),
});

export const candidateSchema = z.object({
  student_id: z.string().min(1),
  full_name: z.string().min(1),
  department: z.string().min(1),
  gender: z.string().min(1),
  image_url: z.string().url().optional(),
  position_id: z.number().int().positive(),
  manifesto: z.string().optional(),
  verified: z.boolean().optional().default(false)
});

// Helper functions
export async function getElectionWithDetails(electionId: number) {
  try {
    // Get election details
    const electionResult = await sql`
      SELECT * FROM elections WHERE id = ${electionId}
    `;
    
    if (electionResult.length === 0) {
      return null;
    }

    const election = electionResult[0];

    // Get positions for this election
    const positionsResult = await sql`
      SELECT * FROM positions WHERE election_id = ${electionId}
    `;

    const positions = positionsResult;

    // Get candidates for each position
    const candidatesResult = await sql`
      SELECT 
        c.*,
        p.title as position_title
      FROM candidates c
      LEFT JOIN positions p ON c.position_id = p.id
      WHERE c.election_id = ${electionId}
    `;

    // Organize candidates by position
    const candidatesByPosition = candidatesResult.reduce((acc, candidate) => {
      const positionId = candidate.position_id;
      if (!acc[positionId]) {
        acc[positionId] = [];
      }
      acc[positionId].push(candidate);
      return acc;
    }, {} as Record<number, Candidate[]>);

    // Combine all data
    return {
      ...election,
      startDate: election.start_date ? new Date(election.start_date).toISOString() : null,
      endDate: election.end_date ? new Date(election.end_date).toISOString() : null,
      positions: positions.map(position => ({
        ...position,
        candidates: candidatesByPosition[position.id] || []
      }))
    };
  } catch (error) {
    console.error('Error fetching election details:', error);
    throw error;
  }
}

export async function getElectionsByStatus(status: 'upcoming' | 'active' | 'completed') {
  return sql`
    SELECT 
      e.*,
      COUNT(DISTINCT v.id) as total_votes,
      COUNT(DISTINCT u.id) FILTER (WHERE u.role = 'voter') as eligible_voters
    FROM elections e
    LEFT JOIN votes v ON v.election_id = e.id
    LEFT JOIN users u ON u.role = 'voter'
    WHERE e.status = ${status}
    GROUP BY e.id
    ORDER BY e.start_date DESC
  `;
}

export async function hasUserVoted(electionId: number, userId: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT 1 FROM votes v
        JOIN positions p ON v.position_id = p.id
        WHERE p.election_id = ${electionId}
        AND v.voter_id = ${userId}
      ) as has_voted
    `;
    
    return result[0].has_voted;
  } catch (error) {
    console.error('Error checking if user has voted:', error);
    throw error;
  }
}

export async function getVoteCounts(electionId: number) {
  return sql`
    SELECT 
      p.id as position_id,
      p.title as position_title,
      c.id as candidate_id,
      c.full_name,
      COUNT(v.id) as vote_count
    FROM positions p
    LEFT JOIN candidates c ON c.position_id = p.id
    LEFT JOIN votes v ON v.candidate_id = c.id
    WHERE p.election_id = ${electionId}
    GROUP BY p.id, p.title, c.id, c.full_name
    ORDER BY p.id, vote_count DESC
  `;
}

export async function createElection(data: z.infer<typeof electionSchema>, createdBy: string) {
  const result = await sql`
    INSERT INTO elections (
      title,
      description,
      start_date,
      end_date,
      status,
      require_face_verification,
      allow_abstentions,
      created_by
    ) VALUES (
      ${data.title},
      ${data.description},
      ${data.startDate},
      ${data.endDate},
      ${data.status},
      ${data.requireFaceVerification},
      ${data.allowAbstentions},
      ${createdBy}
    )
    RETURNING id
  `;
  return result[0].id;
}

export async function addPosition(electionId: number, data: z.infer<typeof positionSchema>) {
  const result = await sql`
    INSERT INTO positions (
      election_id,
      title,
      description,
      max_votes
    ) VALUES (
      ${electionId},
      ${data.title},
      ${data.description},
      ${data.maxVotes}
    )
    RETURNING id
  `;
  return result[0].id;
}

export async function addCandidate(
  electionId: number,
  data: z.infer<typeof candidateSchema>
) {
  // Insert the candidate
  const result = await sql`
    INSERT INTO candidates (
      election_id,
      student_id,
      full_name,
      department,
      gender,
      image_url,
      position_id,
      manifesto,
      verified
    ) VALUES (
      ${electionId},
      ${data.student_id},
      ${data.full_name},
      ${data.department},
      ${data.gender},
      ${data.image_url},
      ${data.position_id},
      ${data.manifesto},
      ${data.verified}
    )
    RETURNING id
  `;
  return result[0].id;
}

export async function submitVote(
  electionId: number,
  _positionId: number | undefined, // no longer used
  candidateId: number,
  voterId: string,
  faceVerified: boolean = false
): Promise<number> {
  try {
    // Look up candidate and their position
    const candidateResult = await sql`
      SELECT id, position_id FROM candidates
      WHERE id = ${candidateId}
    `;
    if (candidateResult.length === 0) {
      throw new Error('Invalid candidate');
    }
    const positionId = candidateResult[0].position_id;
    // Check if the position belongs to the election
    const positionResult = await sql`
      SELECT id FROM positions
      WHERE id = ${positionId}
      AND election_id = ${electionId}
    `;
    if (positionResult.length === 0) {
      throw new Error('Invalid position for this election');
    }
    // Check if user has already voted for this position
    const existingVoteResult = await sql`
      SELECT id FROM votes
      WHERE position_id = ${positionId}
      AND voter_id = ${voterId}
    `;
    if (existingVoteResult.length > 0) {
      throw new Error('You have already voted for this position');
    }
    // Submit the vote
    const voteResult = await sql`
      INSERT INTO votes (
        election_id,
        position_id,
        candidate_id,
        voter_id,
        face_verified
      ) VALUES (
        ${electionId},
        ${positionId},
        ${candidateId},
        ${voterId},
        ${faceVerified}
      )
      RETURNING id
    `;
    // Update candidate vote count
    await sql`
      UPDATE candidates
      SET vote_count = vote_count + 1
      WHERE id = ${candidateId}
    `;
    return voteResult[0].id;
  } catch (error) {
    console.error('Error submitting vote:', error);
    throw error;
  }
} 