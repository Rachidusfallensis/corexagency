-- Fix F3: Hashed and single-use atomic tokens

-- 1. Remove old insecure tokens
ALTER TABLE reservations DROP COLUMN IF EXISTS reschedule_token;
ALTER TABLE queue_entries DROP COLUMN IF EXISTS invite_token;

-- 2. Create secure token tables
CREATE TABLE reschedule_tokens (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash varchar NOT NULL UNIQUE,
    reservation_id uuid NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    expires_at timestamptz NOT NULL,
    used_at timestamptz,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE queue_invites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash varchar NOT NULL UNIQUE,
    queue_id uuid NOT NULL REFERENCES queue_entries(id) ON DELETE CASCADE,
    expires_at timestamptz NOT NULL,
    used_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- Protect tables
ALTER TABLE reschedule_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_invites ENABLE ROW LEVEL SECURITY;

-- 3. Create RPCs
-- check_reschedule_token (read only for UI)
CREATE OR REPLACE FUNCTION check_reschedule_token(p_token_hash varchar)
RETURNS TABLE (
    valid boolean,
    expired boolean,
    reservation_id uuid,
    service service_type,
    profile profile_type,
    project_desc text,
    contact_name varchar,
    contact_email varchar,
    contact_phone varchar,
    contact_company varchar,
    slot_date date,
    slot_time time
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    token_rec record;
    res_rec record;
BEGIN
    SELECT * INTO token_rec FROM reschedule_tokens WHERE token_hash = p_token_hash;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, false, null::uuid, null::service_type, null::profile_type, null::text, null::varchar, null::varchar, null::varchar, null::varchar, null::date, null::time;
        RETURN;
    END IF;

    IF token_rec.used_at IS NOT NULL THEN
        RETURN QUERY SELECT false, false, null::uuid, null::service_type, null::profile_type, null::text, null::varchar, null::varchar, null::varchar, null::varchar, null::date, null::time;
        RETURN;
    END IF;

    IF token_rec.expires_at < now() THEN
        RETURN QUERY SELECT false, true, null::uuid, null::service_type, null::profile_type, null::text, null::varchar, null::varchar, null::varchar, null::varchar, null::date, null::time;
        RETURN;
    END IF;

    SELECT * INTO res_rec FROM reservations WHERE id = token_rec.reservation_id;
    
    RETURN QUERY SELECT 
        true, false,
        res_rec.id, res_rec.service, res_rec.profile, res_rec.project_desc, 
        res_rec.contact_name, res_rec.contact_email, res_rec.contact_phone, res_rec.contact_company, 
        res_rec.slot_date, res_rec.slot_time;
END;
$$;

-- create_rescheduled_reservation (atomic update and creation)
CREATE OR REPLACE FUNCTION create_rescheduled_reservation(p_token_hash varchar, p_slot_date date, p_slot_time time)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    old_res_id uuid;
    res_rec record;
    new_res_id uuid;
BEGIN
    -- 1. Consume token atomically
    UPDATE reschedule_tokens
    SET used_at = now()
    WHERE token_hash = p_token_hash 
      AND used_at IS NULL 
      AND expires_at > now()
    RETURNING reservation_id INTO old_res_id;
    
    IF old_res_id IS NULL THEN
        RAISE EXCEPTION 'INVALID_TOKEN';
    END IF;

    -- 2. Fetch old reservation
    SELECT * INTO res_rec FROM reservations WHERE id = old_res_id;

    -- 3. Create new reservation (with same details)
    BEGIN
        INSERT INTO reservations (
            service, profile, project_desc, contact_name, contact_email, 
            contact_phone, contact_company, slot_date, slot_time, 
            status, visitor_timezone
        ) VALUES (
            res_rec.service, res_rec.profile, res_rec.project_desc, res_rec.contact_name, res_rec.contact_email, 
            res_rec.contact_phone, res_rec.contact_company, p_slot_date, p_slot_time, 
            'pending', res_rec.visitor_timezone
        ) RETURNING id INTO new_res_id;
    EXCEPTION WHEN unique_violation THEN
        RAISE EXCEPTION 'SLOT_TAKEN';
    END;

    -- 4. Create lead
    INSERT INTO leads (
        source, service, profile, project_desc, 
        contact_name, contact_email, contact_phone, contact_company, 
        status, reservation_id
    ) VALUES (
        'booking', res_rec.service, res_rec.profile, res_rec.project_desc, 
        res_rec.contact_name, res_rec.contact_email, res_rec.contact_phone, res_rec.contact_company, 
        'new', new_res_id
    );

    RETURN new_res_id;
END;
$$;

GRANT EXECUTE ON FUNCTION check_reschedule_token(varchar) TO anon;
GRANT EXECUTE ON FUNCTION create_rescheduled_reservation(varchar, date, time) TO anon;
