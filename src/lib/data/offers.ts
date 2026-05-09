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

export const EXAMPLES_DIGITAL: SectorExample[] = [
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

export const EXAMPLES_SAAS: SectorExample[] = [
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
