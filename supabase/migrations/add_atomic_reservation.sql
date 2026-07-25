-- Migration: Add atomic reservation support

-- 1. Create a unique index to prevent double booking
CREATE UNIQUE INDEX IF NOT EXISTS uniq_active_slot 
  ON reservations (slot_date, slot_time) 
  WHERE status <> 'cancelled';

-- 2. Create the RPC function
CREATE OR REPLACE FUNCTION create_reservation(payload jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_res_id uuid;
BEGIN
    -- Insert into reservations
    BEGIN
        INSERT INTO reservations (
            service, profile, project_desc, contact_name, contact_email, 
            contact_phone, contact_company, slot_date, slot_time, 
            status, visitor_timezone
        ) VALUES (
            payload->>'service',
            payload->>'profile',
            payload->>'projectDesc',
            payload->>'contactName',
            payload->>'contactEmail',
            payload->>'contactPhone',
            payload->>'contactCompany',
            (payload->>'slotDate')::date,
            (payload->>'slotTime')::time,
            'pending',
            payload->>'visitorTimezone'
        ) RETURNING id INTO new_res_id;
    EXCEPTION WHEN unique_violation THEN
        RAISE EXCEPTION 'SLOT_TAKEN';
    END;

    -- Insert into leads
    INSERT INTO leads (
        source, service, profile, project_desc, 
        contact_name, contact_email, contact_phone, contact_company, 
        status, reservation_id
    ) VALUES (
        'booking',
        payload->>'service',
        payload->>'profile',
        payload->>'projectDesc',
        payload->>'contactName',
        payload->>'contactEmail',
        payload->>'contactPhone',
        payload->>'contactCompany',
        'new',
        new_res_id
    );

    RETURN new_res_id;
END;
$$;
