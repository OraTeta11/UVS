-- Users table (already exists, but adding missing fields)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS faceset_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'voter',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS faculty VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": false, "sms": false, "app": false}'::jsonb,
ADD COLUMN IF NOT EXISTS face_image_path TEXT;

-- Elections table
CREATE TABLE IF NOT EXISTS elections (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'upcoming',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_status CHECK (status IN ('upcoming', 'active', 'completed'))
);

-- Positions table (for different roles in an election)
CREATE TABLE IF NOT EXISTS positions (
    id SERIAL PRIMARY KEY,
    election_id INTEGER REFERENCES elections(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    max_votes INTEGER DEFAULT 1,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
    id SERIAL PRIMARY KEY,
    election_id INTEGER REFERENCES elections(id) ON DELETE CASCADE,
    position_id INTEGER REFERENCES positions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    manifesto TEXT,
    image_url VARCHAR(255),
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    election_id INTEGER REFERENCES elections(id) ON DELETE CASCADE,
    position_id INTEGER REFERENCES positions(id) ON DELETE CASCADE,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    voter_id UUID REFERENCES users(id),
    face_verified BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Ensure one vote per position per voter per election
    CONSTRAINT unique_vote UNIQUE (election_id, position_id, voter_id)
);

-- Password Reset Tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_elections_status ON elections(status);
CREATE INDEX IF NOT EXISTS idx_elections_dates ON elections(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_candidates_election ON candidates(election_id);
CREATE INDEX IF NOT EXISTS idx_votes_election ON votes(election_id);
CREATE INDEX IF NOT EXISTS idx_votes_voter ON votes(voter_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_elections_updated_at ON elections;
CREATE TRIGGER update_elections_updated_at
    BEFORE UPDATE ON elections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_positions_updated_at ON positions;
CREATE TRIGGER update_positions_updated_at
    BEFORE UPDATE ON positions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_candidates_updated_at ON candidates;
CREATE TRIGGER update_candidates_updated_at
    BEFORE UPDATE ON candidates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();