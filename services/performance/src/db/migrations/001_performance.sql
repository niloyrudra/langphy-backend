CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE lp_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    total_quizzes INTEGER DEFAULT 0,
    avg_score NUMERIC(5,2) DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    last_quiz_score INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lp_users_updated_at
BEFORE UPDATE ON lp_performance
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();