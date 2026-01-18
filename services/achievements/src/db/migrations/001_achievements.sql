CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE lp_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE lp_user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    achievement_id UUID NOT NULL,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

    UNIQUE (user_id, achievement_id),

    FOREIGN KEY (achievement_id) REFERENCES lp_achievements(id),
);
-- CREATE TABLE lp_user_achievements (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     user_id UUID NOT NULL,
--     achievement_id UUID NOT NULL,
--     achieved_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

--     UNIQUE (user_id, achievement_id),

--     FOREIGN KEY (achievement_id) REFERENCES lp_achievements(id),
--     FOREIGN KEY (user_id) REFERENCES lp_profiles(id) ON DELETE CASCADE
-- );

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lp_users_updated_at
BEFORE UPDATE ON lp_streaks
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();