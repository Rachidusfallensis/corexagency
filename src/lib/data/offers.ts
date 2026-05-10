export const OFFERS = {
  digitalisation: {
    services: [
      'ERP',
      'CRM',
      'E-commerce',
      'Site sur mesure',
      'Automatisation',
      'Intégrations API',
    ],
  },
  saas: {
    services: [
      'Product Design',
      'MVP rapide',
      'Architecture',
      'Développement',
      'Lancement',
      'Itération',
    ],
  },
} as const

export type SectorExample = {
  sector: string
  title: string
  desc: string
  result: string
}

export const EXAMPLES_DIGITAL_FR: SectorExample[] = [
  {
    sector: 'Restauration',
    title: 'Gestion des stocks et commandes fournisseurs automatisée',
    desc: 'Une chaîne de restaurants élimine les ruptures de stock et la saisie manuelle grâce à un ERP sur mesure synchronisé avec ses fournisseurs.',
    result: 'Zéro rupture, zéro saisie manuelle',
  },
  {
    sector: 'Immobilier',
    title: 'CRM centralisé pour prospects, visites et relances',
    desc: 'Une agence immobilière remplace ses fichiers Excel par un CRM qui automatise les relances et donne une vue complète sur chaque prospect.',
    result: '50% de temps commercial économisé',
  },
  {
    sector: 'Santé',
    title: 'Digitalisation des rendez-vous et dossiers patients',
    desc: "Une clinique dentaire digitalise ses prises de rendez-vous, dossiers patients et rappels SMS. L'équipe se concentre sur le soin.",
    result: '2h gagnées par jour par employé',
  },
  {
    sector: 'E-commerce',
    title: 'Boutique en ligne synchronisée avec le magasin physique',
    desc: 'Une boutique de mode lance sa présence en ligne avec gestion des stocks unifiée entre le magasin et le web.',
    result: 'Stocks toujours à jour sur tous les canaux',
  },
  {
    sector: 'Logistique',
    title: 'Automatisation des bons de livraison et de la facturation',
    desc: 'Une PME de transport automatise ses bons de livraison, le suivi des chauffeurs et la génération des factures clients.',
    result: 'Facturation instantanée à la livraison',
  },
  {
    sector: 'Formation',
    title: 'Plateforme de gestion des inscriptions et certifications',
    desc: 'Un centre de formation remplace ses processus papier par une plateforme qui gère inscriptions, paiements et certificats.',
    result: '100% du parcours apprenant digital',
  },
]

export const EXAMPLES_DIGITAL_EN: SectorExample[] = [
  {
    sector: 'Restaurant',
    title: 'Automated stock and supplier order management',
    desc: 'A restaurant chain eliminates stock shortages and manual entry with a custom ERP synchronized with its suppliers.',
    result: 'Zero shortage, zero manual entry',
  },
  {
    sector: 'Real Estate',
    title: 'Centralized CRM for prospects, visits and follow-ups',
    desc: 'A real estate agency replaces Excel files with a CRM that automates follow-ups and gives a complete view of each prospect.',
    result: '50% commercial time saved',
  },
  {
    sector: 'Healthcare',
    title: 'Digitalization of appointments and patient records',
    desc: 'A dental clinic digitalizes its appointment booking, patient records and SMS reminders. The team focuses on care, not admin.',
    result: '2h saved per employee per day',
  },
  {
    sector: 'E-commerce',
    title: 'Online store synchronized with physical store',
    desc: 'A fashion boutique launches its online presence with unified stock management between the store and the web.',
    result: 'Stock always up to date across all channels',
  },
  {
    sector: 'Logistics',
    title: 'Automated delivery notes and invoicing',
    desc: 'A transport SME automates its delivery notes, driver tracking and client invoice generation.',
    result: 'Instant invoicing at delivery',
  },
  {
    sector: 'Training',
    title: 'Registration and certification management platform',
    desc: 'A training center replaces paper processes with a platform that manages registrations, payments and certificate delivery.',
    result: '100% digital learner journey',
  },
]

// Backward compat alias (default = FR)
export const EXAMPLES_DIGITAL = EXAMPLES_DIGITAL_FR

export const EXAMPLES_SAAS_FR: SectorExample[] = [
  {
    sector: 'RH',
    title: 'SaaS de gestion des congés pour TPE et PME',
    desc: 'Un fondateur RH lance un outil simple de gestion des congés et absences pour les petites entreprises sans SIRH complet.',
    result: 'MVP livré en 8 semaines',
  },
  {
    sector: 'Juridique',
    title: 'Générateur automatique de contrats pour freelances',
    desc: 'Une startup juridique construit un outil permettant aux freelances de générer des contrats conformes en quelques clics.',
    result: 'Contrat prêt en moins de 5 minutes',
  },
  {
    sector: 'Retail',
    title: 'Programme de fidélisation pour commerces de proximité',
    desc: 'Un entrepreneur développe un SaaS qui permet aux petits commerces de lancer leur propre programme de fidélité.',
    result: 'Activé en 1 jour par le commerçant',
  },
  {
    sector: 'Éducation',
    title: 'Plateforme de micro-learning avec suivi de progression',
    desc: 'Une EdTech lance une plateforme de formation courte avec suivi de progression, quiz et certification automatisée.',
    result: 'Lancement en moins de 10 semaines',
  },
]

export const EXAMPLES_SAAS_EN: SectorExample[] = [
  {
    sector: 'HR',
    title: 'Leave management SaaS for small businesses',
    desc: 'An HR founder launches a simple leave and absence management tool for small companies without a full HRIS.',
    result: 'MVP delivered in 8 weeks',
  },
  {
    sector: 'Legal',
    title: 'Automatic contract generator for freelancers',
    desc: 'A legal startup builds a tool allowing freelancers to generate compliant contracts in a few clicks, without a lawyer.',
    result: 'Contract ready in under 5 minutes',
  },
  {
    sector: 'Retail',
    title: 'Loyalty program for local businesses',
    desc: 'An entrepreneur develops a SaaS allowing small businesses to launch their own loyalty program without complex tech.',
    result: 'Activated in 1 day by the merchant',
  },
  {
    sector: 'Education',
    title: 'Micro-learning platform with progress tracking',
    desc: 'An EdTech launches a short-form learning platform with progress tracking, quizzes and automated certification.',
    result: 'Launched in under 10 weeks',
  },
]

// Backward compat alias (default = FR)
export const EXAMPLES_SAAS = EXAMPLES_SAAS_FR

export const PROCESS_STEPS = [
  { num: '01', titleKey: 'process.step1.title', descKey: 'process.step1.desc' },
  { num: '02', titleKey: 'process.step2.title', descKey: 'process.step2.desc' },
  { num: '03', titleKey: 'process.step3.title', descKey: 'process.step3.desc' },
  { num: '04', titleKey: 'process.step4.title', descKey: 'process.step4.desc' },
] as const

export type WhyIcon =
  | 'lightning'
  | 'clock'
  | 'users'
  | 'code'
  | 'shield'
  | 'support'

export const WHY_ITEMS: ReadonlyArray<{
  icon: WhyIcon
  titleKey: string
  descKey: string
}> = [
  { icon: 'lightning', titleKey: 'why.item1.title', descKey: 'why.item1.desc' },
  { icon: 'clock', titleKey: 'why.item2.title', descKey: 'why.item2.desc' },
  { icon: 'users', titleKey: 'why.item3.title', descKey: 'why.item3.desc' },
  { icon: 'code', titleKey: 'why.item4.title', descKey: 'why.item4.desc' },
  { icon: 'shield', titleKey: 'why.item5.title', descKey: 'why.item5.desc' },
  { icon: 'support', titleKey: 'why.item6.title', descKey: 'why.item6.desc' },
]

export const SAAS_STEPS = [
  { num: '1', titleKey: 'saas.step1.title', descKey: 'saas.step1.desc' },
  { num: '2', titleKey: 'saas.step2.title', descKey: 'saas.step2.desc' },
  { num: '3', titleKey: 'saas.step3.title', descKey: 'saas.step3.desc' },
  { num: '4', titleKey: 'saas.step4.title', descKey: 'saas.step4.desc' },
] as const

export const SAAS_PROGRESS = [
  { label: 'Cadrage & Design', weeks: 'Semaine 1–2', pct: 100 },
  { label: 'Backend & API', weeks: 'Semaine 3–5', pct: 80 },
  { label: 'Frontend', weeks: 'Semaine 4–6', pct: 65 },
  { label: 'Tests & QA', weeks: 'Semaine 7', pct: 40 },
  { label: 'Lancement', weeks: 'Semaine 8', pct: 10 },
] as const

export const TECH_BADGES = [
  'Next.js',
  'Supabase',
  'React',
  'TypeScript',
  'Node.js',
] as const
