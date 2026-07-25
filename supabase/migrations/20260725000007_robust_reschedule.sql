-- Fix F5: Robust reschedule

-- 1. Add rescheduled status if it doesn't exist
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'rescheduled';

-- 2. Update the create_rescheduled_reservation RPC
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

    -- 4. Mark old reservation as rescheduled
    UPDATE reservations SET status = 'rescheduled' WHERE id = old_res_id;

    -- 5. Reuse the existing lead instead of creating a new one
    UPDATE leads SET reservation_id = new_res_id WHERE reservation_id = old_res_id;

    RETURN new_res_id;
END;
$$;
