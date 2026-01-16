CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS lp_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    provider TEXT NOT NULL,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT lp_users_email_unique UNIQUE (email),
    CONSTRAINT lp_users_username_unique UNIQUE (username),
    CONSTRAINT lp_users_username_not_empty CHECK (length(username) > 0),
    CONSTRAINT lp_users_email_not_empty CHECK (length(email) > 0)
);



CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lp_users_updated_at
BEFORE UPDATE ON lp_users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CREATE TABLE lp_users (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   email TEXT NOT NULL UNIQUE,
--   password TEXT,
--   provider TEXT NOT NULL,
--   created_at TIMESTAMP NOT NULL DEFAULT NOW(),
--   updated_at TIMESTAMP NOT NULL DEFAULT NOW()
-- );