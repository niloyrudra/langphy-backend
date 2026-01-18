CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE lp_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL,
    unit_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content_type TEXT NOT NULL, -- quiz | lesson | practice
    content_id UUID NOT NULL,
    completed BOOLEAN DEFAULT false,
    progress_percent INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

    UNIQUE (user_id, content_type, content_id)
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lp_users_updated_at
BEFORE UPDATE ON lp_progress
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();