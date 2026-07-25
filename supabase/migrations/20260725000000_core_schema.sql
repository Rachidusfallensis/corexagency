-- Core Schema for Corex Agency (F4)

CREATE TYPE service_type AS ENUM ('digitalisation', 'saas', 'other');
CREATE TYPE profile_type AS ENUM ('startup', 'pme', 'freelance', 'other');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE urgency_type AS ENUM ('high', 'medium', 'low');
CREATE TYPE queue_status AS ENUM ('waiting', 'invited', 'converted', 'rejected');
CREATE TYPE lead_source AS ENUM ('booking', 'queue', 'contact');

CREATE TABLE IF NOT EXISTS reservations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    service service_type NOT NULL,
    profile profile_type NOT NULL,
    project_desc text NOT NULL,
    contact_name varchar NOT NULL,
    contact_email varchar NOT NULL,
    contact_phone varchar,
    contact_company varchar,
    slot_date date NOT NULL,
    slot_time time NOT NULL,
    status booking_status DEFAULT 'pending',
    admin_note text,
    reschedule_token uuid,
    cancelled_at timestamptz,
    confirmed_at timestamptz,
    visitor_timezone varchar
);

CREATE TABLE IF NOT EXISTS availability_rules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    days_of_week int[] NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    slot_duration int NOT NULL,
    valid_from date,
    valid_until date,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS availability_blocks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    start_date date NOT NULL,
    end_date date NOT NULL,
    reason text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS queue_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    service service_type NOT NULL,
    profile profile_type NOT NULL,
    project_desc text NOT NULL,
    contact_name varchar NOT NULL,
    contact_email varchar NOT NULL,
    contact_phone varchar,
    urgency urgency_type NOT NULL,
    status queue_status DEFAULT 'waiting',
    invite_token uuid,
    invite_sent_at timestamptz
);

CREATE TABLE IF NOT EXISTS leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    source lead_source NOT NULL,
    service service_type NOT NULL,
    profile profile_type NOT NULL,
    contact_name varchar NOT NULL,
    contact_email varchar NOT NULL,
    contact_phone varchar,
    contact_company varchar,
    project_desc text NOT NULL,
    status varchar NOT NULL,
    reservation_id uuid REFERENCES reservations(id),
    queue_id uuid REFERENCES queue_entries(id)
);
