-- Migration : ajouter timezone aux règles + visitor_timezone aux réservations
-- À exécuter dans Supabase SQL Editor (projet uizzgoqxkvkanyemniyf)

ALTER TABLE availability_rules
  ADD COLUMN IF NOT EXISTS timezone varchar DEFAULT 'America/Toronto';

ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS visitor_timezone varchar;

UPDATE availability_rules
  SET timezone = 'America/Toronto'
  WHERE timezone IS NULL;
