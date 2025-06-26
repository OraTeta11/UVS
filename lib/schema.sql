-- Elections table
CREATE TABLE IF NOT EXISTS elections (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, active, completed, cancelled
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    department VARCHAR(50) REFERENCES users(department),
    is_department_specific BOOLEAN DEFAULT false,
    CONSTRAINT valid_status CHECK (status IN ('draft', 'active', 'completed', 'cancelled'))
);

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
    id SERIAL PRIMARY KEY,
    election_id INTEGER REFERENCES elections(id) ON DELETE CASCADE,
    student_id VARCHAR(50) REFERENCES users(student_id),
    position VARCHAR(255) NOT NULL,
    manifesto TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(election_id, student_id)
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    election_id INTEGER REFERENCES elections(id) ON DELETE CASCADE,
    voter_id INTEGER REFERENCES users(id),
    candidate_id INTEGER REFERENCES candidates(id),
    voted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(election_id, voter_id)
);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(id)
);

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
    ('face_recognition_threshold', '0.6', 'Threshold for face matching (0-1)'),
    ('default_election_duration_days', '7', 'Default duration for new elections in days'),
    ('max_candidates_per_position', '5', 'Maximum number of candidates per position'),
    ('voting_start_time', '08:00:00', 'Default start time for voting'),
    ('voting_end_time', '17:00:00', 'Default end time for voting')
ON CONFLICT (key) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_elections_status ON elections(status);
CREATE INDEX IF NOT EXISTS idx_elections_dates ON elections(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_votes_election ON votes(election_id);
CREATE INDEX IF NOT EXISTS idx_votes_voter ON votes(voter_id);
CREATE INDEX IF NOT EXISTS idx_candidates_election ON candidates(election_id); 