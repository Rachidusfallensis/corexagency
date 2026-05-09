-- Corex DB schema — to run in Supabase SQL Editor
-- Project: https://uizzgoqxkvkanyemniyf.supabase.co

-- Reservations
CREATE TABLE reservations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  service varchar CHECK (service IN ('digitalisation','saas','other')),
  profile varchar CHECK (profile IN ('startup','pme','freelance','other')),
  project_desc text,
  contact_name varchar NOT NULL,
  contact_email varchar NOT NULL,
  contact_phone varchar,
  contact_company varchar,
  slot_date date NOT NULL,
  slot_time time NOT NULL,
  status varchar DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  admin_note text,
  reschedule_token uuid,
  cancelled_at timestamptz,
  confirmed_at timestamptz
);

-- Availability rules
CREATE TABLE availability_rules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  days_of_week int[] NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  slot_duration int NOT NULL DEFAULT 60,
  valid_from date,
  valid_until date,
  created_at timestamptz DEFAULT now()
);

-- Availability blocks
CREATE TABLE availability_blocks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- Queue entries
CREATE TABLE queue_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  service varchar CHECK (service IN ('digitalisation','saas','other')),
  profile varchar CHECK (profile IN ('startup','pme','freelance','other')),
  project_desc text,
  contact_name varchar NOT NULL,
  contact_email varchar NOT NULL,
  contact_phone varchar,
  urgency varchar DEFAULT 'medium' CHECK (urgency IN ('high','medium','low')),
  status varchar DEFAULT 'waiting' CHECK (status IN ('waiting','invited','converted','rejected')),
  invite_token uuid,
  invite_sent_at timestamptz
);

-- Leads
CREATE TABLE leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  source varchar CHECK (source IN ('booking','queue','contact')),
  service varchar CHECK (service IN ('digitalisation','saas','other')),
  profile varchar CHECK (profile IN ('startup','pme','freelance','other')),
  contact_name varchar NOT NULL,
  contact_email varchar NOT NULL,
  contact_phone varchar,
  contact_company varchar,
  project_desc text,
  status varchar DEFAULT 'new',
  reservation_id uuid REFERENCES reservations(id),
  queue_id uuid REFERENCES queue_entries(id)
);

-- RLS Policies
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour les dispos (booking page)
CREATE POLICY "Public read availability_rules"
  ON availability_rules FOR SELECT USING (true);
CREATE POLICY "Public read availability_blocks"
  ON availability_blocks FOR SELECT USING (true);
CREATE POLICY "Public read reservations slots"
  ON reservations FOR SELECT USING (true);

-- Insert public pour booking et queue
CREATE POLICY "Public insert reservations"
  ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert queue"
  ON queue_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert leads"
  ON leads FOR INSERT WITH CHECK (true);
