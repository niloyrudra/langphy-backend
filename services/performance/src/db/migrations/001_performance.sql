CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS lp_performance (
    user_id UUID PRIMARY KEY,

    total_lessons_completed INT NOT NULL DEFAULT 0,
    total_sessions_completed INT NOT NULL DEFAULT 0,

    practice_completed INT NOT NULL DEFAULT 0,
    quiz_completed INT NOT NULL DEFAULT 0,
    reading_completed INT NOT NULL DEFAULT 0,
    writing_completed INT NOT NULL DEFAULT 0,
    speaking_completed INT NOT NULL DEFAULT 0,
    listening_completed INT NOT NULL DEFAULT 0,

    avg_quiz_score FLOAT,
    avg_speaking_score FLOAT,
    avg_listening_score FLOAT,
    avg_writing_score FLOAT,

    quiz_score_count INT NOT NULL DEFAULT 0,
    speaking_score_count INT NOT NULL DEFAULT 0,
    listening_score_count INT NOT NULL DEFAULT 0,
    writing_score_count INT NOT NULL DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lp_performance_updated_at
BEFORE UPDATE ON lp_performance
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();