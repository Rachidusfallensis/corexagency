-- Fix F6: Email logs and Webhook

-- 1. Create email_logs table
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS locale varchar DEFAULT 'fr';
CREATE TYPE email_status AS ENUM ('queued', 'sent', 'failed');

CREATE TABLE IF NOT EXISTS email_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    idempotency_key varchar NOT NULL UNIQUE,
    type varchar NOT NULL,
    to_email varchar NOT NULL,
    related_id uuid,
    status email_status DEFAULT 'queued',
    attempts int DEFAULT 0,
    error_msg text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Auto update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_email_logs_updated_at
    BEFORE UPDATE ON email_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
