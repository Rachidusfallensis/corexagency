-- Migration: Secure public writes (F2)

-- 1. Enable RLS on core tables
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_entries ENABLE ROW LEVEL SECURITY;

-- 2. Create create_queue_entry RPC
CREATE OR REPLACE FUNCTION create_queue_entry(payload jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_queue_id uuid;
BEGIN
    -- Insert into queue_entries
    INSERT INTO queue_entries (
        service, profile, project_desc, contact_name, contact_email, 
        contact_phone, urgency, status
    ) VALUES (
        (payload->>'service')::service_type,
        (payload->>'profile')::profile_type,
        payload->>'projectDesc',
        payload->>'contactName',
        payload->>'contactEmail',
        payload->>'contactPhone',
        (payload->>'urgency')::urgency_type,
        'waiting'
    ) RETURNING id INTO new_queue_id;

    -- Insert into leads
    INSERT INTO leads (
        source, service, profile, project_desc, 
        contact_name, contact_email, contact_phone, contact_company, 
        status, queue_id
    ) VALUES (
        'queue',
        (payload->>'service')::service_type,
        (payload->>'profile')::profile_type,
        payload->>'projectDesc',
        payload->>'contactName',
        payload->>'contactEmail',
        payload->>'contactPhone',
        payload->>'contactCompany',
        'new',
        new_queue_id
    );

    RETURN new_queue_id;
END;
$$;

-- 3. Grant access to anon for RPCs
GRANT EXECUTE ON FUNCTION create_reservation(jsonb) TO anon;
GRANT EXECUTE ON FUNCTION create_queue_entry(jsonb) TO anon;

-- Note: Without explicit policies, RLS denies direct INSERT/UPDATE/DELETE/SELECT to anon.
