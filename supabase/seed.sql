-- Données de test Corex — à exécuter dans le SQL Editor Supabase
-- Une fois `schema.sql` appliqué.
-- Convention days_of_week : 0=Lun, 1=Mar, 2=Mer, 3=Jeu, 4=Ven

-- Règle récurrente : Mar/Mer/Jeu matin 9h-12h
INSERT INTO availability_rules
  (days_of_week, start_time, end_time, slot_duration)
VALUES
  (ARRAY[1,2,3], '09:00', '12:00', 60);

-- Règle récurrente : Mar/Jeu après-midi 14h-17h
INSERT INTO availability_rules
  (days_of_week, start_time, end_time, slot_duration)
VALUES
  (ARRAY[1,3], '14:00', '17:00', 60);

-- Blocage test : dans 3 semaines, sur 2 jours
INSERT INTO availability_blocks
  (start_date, end_date, reason)
VALUES
  (
    CURRENT_DATE + INTERVAL '21 days',
    CURRENT_DATE + INTERVAL '23 days',
    'Test blocage'
  );
