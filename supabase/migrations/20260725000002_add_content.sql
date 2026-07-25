-- CMS : table site_content + données initiales
-- À exécuter dans Supabase SQL Editor

CREATE TABLE IF NOT EXISTS site_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key varchar NOT NULL UNIQUE,
  value_fr text NOT NULL,
  value_en text NOT NULL,
  section varchar NOT NULL,
  label varchar NOT NULL,
  type varchar DEFAULT 'text' CHECK (type IN ('text', 'textarea', 'list')),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_content"
  ON site_content FOR SELECT USING (true);

CREATE POLICY "Service role write site_content"
  ON site_content FOR ALL
  USING (true)
  WITH CHECK (true);

INSERT INTO site_content (key, value_fr, value_en, section, label, type) VALUES
  -- Hero
  ('hero.badge', 'Votre partenaire tech', 'Your tech partner', 'Hero', 'Badge', 'text'),
  ('hero.title', 'Your tech partner,', 'Your tech partner,', 'Hero', 'Titre ligne 1', 'text'),
  ('hero.titleEm', 'from day one.', 'from day one.', 'Hero', 'Titre ligne 2 (vert)', 'text'),
  ('hero.desc',
    'Nous digitalisons vos opérations et transformons vos idées en produits SaaS. Une seule équipe, deux expertises, des résultats concrets.',
    'We digitalize your operations and turn your ideas into SaaS products. One team, two expertises, concrete results.',
    'Hero', 'Description', 'textarea'),
  ('hero.ctaPrimary', 'Découvrir nos offres', 'Discover our services', 'Hero', 'Bouton principal', 'text'),
  ('hero.ctaSecondary', 'Prendre un RV', 'Book a call', 'Hero', 'Bouton secondaire', 'text'),
  ('hero.cardTitle', 'Deux offres, zéro compromis.', 'Two offers, zero compromise.', 'Hero', 'Titre card verte', 'text'),
  ('hero.cardDesc',
    'Digitalisation d''entreprise ou construction de SaaS. On s''engage à 100% sur votre projet.',
    'Business digitalization or SaaS construction. We commit 100% to your project.',
    'Hero', 'Description card verte', 'textarea'),

  -- Offres
  ('offers.title', 'Deux expertises, une seule vision.', 'Two expertises, one vision.', 'Offres', 'Titre section', 'text'),
  ('offers.desc',
    'Que vous soyez une entreprise qui veut se digitaliser ou un entrepreneur avec une idée de produit, on a la bonne offre pour vous.',
    'Whether you are a company looking to digitalize or an entrepreneur with a product idea, we have the right offer for you.',
    'Offres', 'Description section', 'textarea'),
  ('offers.digital.title', 'Transformez votre entreprise avec les bons outils.', 'Transform your business with the right tools.', 'Offres', 'Titre Digitalisation', 'text'),
  ('offers.digital.desc',
    'ERP, CRM, e-commerce, sites sur mesure, automatisations. On construit les fondations digitales de votre croissance.',
    'ERP, CRM, e-commerce, custom sites, automations. We build the digital foundations of your growth.',
    'Offres', 'Description Digitalisation', 'textarea'),
  ('offers.saas.title', 'De l''idée au produit.', 'From idea to product.', 'Offres', 'Titre SaaS Builder', 'text'),
  ('offers.saas.desc',
    'Vous avez une idée de SaaS ? On la construit avec vous, de la conception au lancement, en passant par le MVP.',
    'You have a SaaS idea? We build it with you, from conception to launch, including the MVP.',
    'Offres', 'Description SaaS Builder', 'textarea'),

  -- Processus
  ('process.title', 'Simple, rapide, structuré.', 'Simple, fast, structured.', 'Processus', 'Titre section', 'text'),
  ('process.step1.title', 'Appel découverte', 'Discovery call', 'Processus', 'Étape 1 titre', 'text'),
  ('process.step1.desc',
    'On comprend votre contexte, vos besoins et vos objectifs en 30 minutes.',
    'We understand your context, needs and goals in 30 minutes.',
    'Processus', 'Étape 1 description', 'textarea'),
  ('process.step2.title', 'Proposition', 'Proposal', 'Processus', 'Étape 2 titre', 'text'),
  ('process.step2.desc',
    'On vous présente un plan clair : périmètre, délais, budget.',
    'We present a clear plan: scope, timeline, budget.',
    'Processus', 'Étape 2 description', 'textarea'),
  ('process.step3.title', 'Développement', 'Development', 'Processus', 'Étape 3 titre', 'text'),
  ('process.step3.desc',
    'On construit avec des points de suivi réguliers et une transparence totale.',
    'We build with regular check-ins and total transparency.',
    'Processus', 'Étape 3 description', 'textarea'),
  ('process.step4.title', 'Livraison', 'Delivery', 'Processus', 'Étape 4 titre', 'text'),
  ('process.step4.desc',
    'Mise en production, formation et support pour assurer la continuité.',
    'Launch, training and support to ensure continuity.',
    'Processus', 'Étape 4 description', 'textarea'),

  -- CTA
  ('cta.title', 'Prêt à démarrer ?', 'Ready to get started?', 'CTA', 'Titre', 'text'),
  ('cta.desc',
    'Réservez un appel découverte de 30 minutes. On analyse votre situation et on voit ensemble comment avancer.',
    'Book a 30-minute discovery call. We will analyze your situation and figure out the best path forward together.',
    'CTA', 'Description', 'textarea'),
  ('cta.btn', 'Prendre un rendez-vous', 'Book a call', 'CTA', 'Bouton', 'text'),

  -- Footer
  ('footer.tagline', 'Your tech partner, from day one.', 'Your tech partner, from day one.', 'Footer', 'Tagline', 'text'),

  -- Contact
  ('contact.email', 'hello@corex.com', 'hello@corex.com', 'Contact', 'Email', 'text')
ON CONFLICT (key) DO NOTHING;
