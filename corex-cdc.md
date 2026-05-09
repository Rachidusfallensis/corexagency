# Cahier des Charges — Corex Website v1.0

> **Statut** : En cours de développement  
> **Date** : Mai 2026  
> **Stack** : Next.js 14 (App Router) + TypeScript + Supabase  
> **Langue** : Bilingue FR / EN  

---

## 1. Contexte & Vision

### 1.1 L'entreprise

**Corex** est une agence tech basée au Canada (Laval, Québec) positionnée comme partenaire technologique de bout en bout. L'entreprise propose deux offres distinctes sous une seule marque :

- **Digitalisation** — transformation digitale des entreprises (ERP, CRM, e-commerce, sites sur mesure, automatisations)
- **SaaS Builder** — conception et développement de produits SaaS de zéro à la mise en production

**Tagline** : *Your tech partner, from day one.*

### 1.2 Objectifs du projet

- Créer une présence web professionnelle qui reflète le positionnement premium de Corex
- Convertir les visiteurs en leads qualifiés via deux tunnels distincts
- Offrir un système de prise de rendez-vous immersif et autonome
- Donner à l'admin un outil de gestion complet des réservations et disponibilités

### 1.3 Identité visuelle

| Élément | Valeur |
|---|---|
| Couleur principale | `#016B2D` (Vert profond) |
| Couleur vive | `#01EA62` (Vert vif) |
| Noir | `#050505` |
| Blanc | `#FFFFFF` |
| Gris | `#D1D5DB` |
| Dégradé | `#016B2D` → `#01EA62` |
| Typographie titres | Astonpoliz |
| Typographie body | Heywow |
| Style | Dark mode first, glassmorphism, animations fluides |

---

## 2. Architecture technique

### 2.1 Stack

```
Frontend     : Next.js 14 (App Router) + TypeScript
Backend      : Supabase (Auth, Database, Edge Functions, Storage)
Styling      : Tailwind CSS
i18n         : next-intl — URLs /fr/... et /en/...
Email        : Supabase Edge Functions (Resend ou SendGrid)
Déploiement  : Vercel
```

### 2.2 Structure des dossiers

```
/app
  /[locale]
    /page.tsx                  → Homepage
    /digitalisation/page.tsx   → Offre Digitalisation
    /saas-builder/page.tsx     → Offre SaaS Builder
    /about/page.tsx            → À propos
    /booking/page.tsx          → Prise de rendez-vous
    /booking/reschedule/[token]/page.tsx → Re-booking
    /booking/confirmation/page.tsx
    /admin
      /page.tsx                → Dashboard (protégé)
      /reservations/page.tsx
      /disponibilites/page.tsx
      /file-attente/page.tsx
      /leads/page.tsx
/components
/lib
  /supabase.ts
  /i18n.ts
/messages
  /fr.json
  /en.json
```

### 2.3 Base de données Supabase

#### Table `reservations`
```sql
id              uuid PRIMARY KEY
created_at      timestamp
service         enum('digitalisation', 'saas', 'other')
profile         enum('startup', 'pme', 'freelance', 'other')
project_desc    text
contact_name    varchar
contact_email   varchar
contact_phone   varchar (nullable)
contact_company varchar (nullable)
slot_date       date
slot_time       time
status          enum('pending', 'confirmed', 'cancelled')
admin_note      text (nullable)
reschedule_token uuid (nullable)
cancelled_at    timestamp (nullable)
confirmed_at    timestamp (nullable)
```

#### Table `availability_rules`
```sql
id              uuid PRIMARY KEY
days_of_week    int[] (0=Lun, 4=Ven)
start_time      time
end_time        time
slot_duration   int (minutes)
valid_from      date (nullable)
valid_until     date (nullable)
created_at      timestamp
```

#### Table `availability_blocks`
```sql
id              uuid PRIMARY KEY
start_date      date
end_date        date
reason          text (nullable)
created_at      timestamp
```

#### Table `queue_entries`
```sql
id              uuid PRIMARY KEY
created_at      timestamp
service         enum('digitalisation', 'saas', 'other')
profile         enum('startup', 'pme', 'freelance', 'other')
project_desc    text
contact_name    varchar
contact_email   varchar
contact_phone   varchar (nullable)
urgency         enum('high', 'medium', 'low')
status          enum('waiting', 'invited', 'converted', 'rejected')
invite_token    uuid (nullable)
invite_sent_at  timestamp (nullable)
```

#### Table `leads`
```sql
id              uuid PRIMARY KEY
created_at      timestamp
source          enum('booking', 'queue', 'contact')
service         enum('digitalisation', 'saas', 'other')
profile         enum('startup', 'pme', 'freelance', 'other')
contact_name    varchar
contact_email   varchar
contact_phone   varchar (nullable)
contact_company varchar (nullable)
project_desc    text
status          varchar
reservation_id  uuid (nullable, FK → reservations)
queue_id        uuid (nullable, FK → queue_entries)
```

---

## 3. Site public

### 3.1 Pages & URLs

| Page | URL FR | URL EN |
|---|---|---|
| Homepage | `/fr` | `/en` |
| Digitalisation | `/fr/digitalisation` | `/en/digitalisation` |
| SaaS Builder | `/fr/saas-builder` | `/en/saas-builder` |
| À propos | `/fr/a-propos` | `/en/about` |
| Booking | `/fr/rendez-vous` | `/en/booking` |
| Re-booking | `/fr/rendez-vous/replanifier/[token]` | `/en/booking/reschedule/[token]` |
| Confirmation | `/fr/rendez-vous/confirmation` | `/en/booking/confirmation` |

### 3.2 Homepage `/`

**Sections dans l'ordre :**

1. **Hero**
   - Tagline : *Your tech partner, from day one.*
   - Sous-titre descriptif des deux offres
   - CTA principal : "Découvrir nos offres"
   - CTA secondaire : "Prendre un RV"
   - Visuel : cards flottantes présentant les deux offres

2. **Offres** — deux cards côte à côte
   - Digitalisation (fond blanc)
   - SaaS Builder (fond vert profond)
   - Chaque card : tag, titre, description, services en pills, lien

3. **Exemples Digitalisation** — 6 cards sectorielles
   - Restauration, Immobilier, Santé, E-commerce, Logistique, Formation
   - Chaque card : secteur, titre du projet, description, résultat concret

4. **Exemples SaaS Builder** — 4 cards sectorielles (fond noir)
   - RH, Juridique, Retail, Éducation
   - Même structure que ci-dessus

5. **Processus** — 4 étapes
   - 01 Appel découverte → 02 Proposition → 03 Développement → 04 Livraison

6. **Pourquoi Corex** — 6 cards (fond noir)
   - Livraison rapide, Transparence totale, Équipe dédiée, Expertise technique, Sécurité & souveraineté, Support continu

7. **SaaS Builder focus**
   - Description + 4 étapes du process
   - Visuel : progression MVP avec timeline en semaines

8. **CTA final** — fond vert profond
   - "Prêt à démarrer ?"
   - Bouton "Prendre un rendez-vous"

9. **Footer**
   - Logo + tagline
   - Liens Offres, Entreprise, Contact
   - Copyright

### 3.3 Page Digitalisation

- Hero dédié avec focus sur la transformation d'entreprise
- Liste détaillée des services (ERP, CRM, e-commerce, site sur mesure, automatisation, API)
- 6 exemples sectoriels (même que homepage)
- Processus en 4 étapes
- CTA booking

### 3.4 Page SaaS Builder

- Hero dédié avec focus "de l'idée au produit"
- Process en 4 étapes détaillées (cadrage → design → dev → lancement)
- 4 exemples sectoriels
- Stack technique affiché
- CTA booking

### 3.5 i18n

- Détection automatique de la langue du navigateur
- Switch FR / EN dans le header
- Toutes les pages et le formulaire traduits
- Persistance du choix en cookie

---

## 4. Système de booking

### 4.1 Vue d'ensemble

La page `/booking` est une page plein écran en deux colonnes :
- **Colonne gauche** (fond vert) : branding, promesses, mentions légales
- **Colonne droite** (fond noir) : formulaire immersif 5 étapes

### 4.2 Formulaire — 5 étapes

Chaque étape s'affiche avec une transition horizontale fluide. Le bouton "Continuer" est désactivé tant que l'étape n'est pas complète.

**Étape 1 — Service**
- Question : "Quel service vous intéresse ?"
- Options (choix unique) :
  - Digitalisation (ERP, CRM, e-commerce, automatisations)
  - SaaS Builder (construire un SaaS de A à Z)
  - Je ne sais pas encore

**Étape 2 — Description du projet**
- Textarea libre, min 20 caractères
- Compteur de caractères visible
- Placeholder contextuel selon le service choisi à l'étape 1

**Étape 3 — Profil**
- Question : "Quel est votre profil ?"
- Options (choix unique) :
  - Startup / Fondateur
  - PME / TPE
  - Freelance / Indépendant
  - Autre

**Étape 4 — Créneau**
- Calendrier custom (pas de lib externe)
- Jours passés grisés et non cliquables
- Weekends non disponibles
- Jours bloqués par l'admin non disponibles
- Après sélection d'une date → affichage des créneaux horaires disponibles
- Créneaux déjà réservés affichés barrés
- Sélection obligatoire date + heure pour continuer

**Étape 5 — Coordonnées**
- Prénom (obligatoire)
- Nom (obligatoire)
- Email (obligatoire, validation format)
- Téléphone (optionnel)
- Entreprise (optionnel)

**Confirmation**
- Animation de succès
- Récap de la demande (service, profil, créneau, contact)
- Message : "Nous confirmerons dans les 24h"
- Lien retour au site

### 4.3 Logique des créneaux

Les créneaux disponibles sont calculés dynamiquement :

```
créneaux_disponibles = 
  générer_depuis_règles_récurrentes(date)
  - créneaux_déjà_réservés(date)
  - si date_dans_blocage → aucun créneau
```

### 4.4 Page de re-booking `/booking/reschedule/[token]`

Accessible uniquement via un lien tokenisé envoyé par email lors d'une annulation.

- Token unique par réservation, usage unique
- Affiche directement l'étape 4 (choix créneau)
- Informations du visiteur pré-remplies (non modifiables)
- Nouveau créneau choisi → ancienne réservation archivée → nouvelle créée avec statut `pending`
- Token invalidé après usage

---

## 5. Flow de réservation complet

```
Visiteur remplit le formulaire (5 étapes)
          ↓
Réservation créée en DB avec statut : pending
Lead créé automatiquement dans la table leads
          ↓
Admin reçoit une notification (email + badge dashboard)
          ↓
┌─────────────────────────────────────────────────┐
│                Admin confirme                    │
│  → Statut → confirmed                           │
│  → Email de confirmation envoyé au visiteur      │
│  → Date/heure + lien Google Meet (si intégré)   │
└─────────────────────────────────────────────────┘
          OU
┌─────────────────────────────────────────────────┐
│                Admin annule                      │
│  → Modale avec :                                │
│     - Motif obligatoire                         │
│     - Toggle "Proposer un nouveau créneau"      │
│  → Statut → cancelled                           │
│  → Email d'annulation envoyé avec :             │
│     - Le motif                                  │
│     - Si toggle ON : lien /reschedule/[token]   │
└─────────────────────────────────────────────────┘
```

### 5.1 Emails automatiques

| Déclencheur | Destinataire | Contenu |
|---|---|---|
| Nouvelle réservation | Admin | Notif avec détails complets |
| Admin confirme | Visiteur | Confirmation + détails du RV |
| Admin annule (sans reschedule) | Visiteur | Motif d'annulation |
| Admin annule (avec reschedule) | Visiteur | Motif + lien personnel de re-booking |
| Créneau libéré | Personnes en file d'attente | Invitation à booker |
| Admin invite depuis file d'attente | Visiteur en file | Lien personnel de booking |

---

## 6. File d'attente intelligente

### 6.1 Déclenchement

La page booking bascule automatiquement vers le formulaire de file d'attente dans deux cas :
- Aucun créneau disponible dans les 30 prochains jours
- L'admin a activé le mode "file d'attente forcée" dans le dashboard

### 6.2 Formulaire file d'attente

Mêmes étapes 1, 2, 3 que le booking standard.

À la place de l'étape 4 (créneau) :
- Message explicatif : "Aucun créneau disponible actuellement"
- Champ urgence : Dans moins d'une semaine / Dans le mois / Pas pressé
- Confirmation d'inscription en file

### 6.3 Mode de gestion

**Mode qualifié** — l'admin voit les demandes et choisit qui inviter en priorité selon le profil et le besoin. Il clique "Inviter à booker" → email avec lien personnalisé envoyé → le visiteur accède à une version du booking pré-remplie.

### 6.4 Notification automatique

Quand un créneau se libère (annulation ou nouvelle dispo ajoutée) :
- Les personnes en file d'attente par ordre d'inscription reçoivent un email
- Email contient un lien de booking avec token (valable 48h)
- Si non utilisé après 48h → email envoyé à la personne suivante

---

## 7. Dashboard Admin

### 7.1 Accès

- Route protégée `/admin`
- Auth via Supabase Auth (email + mot de passe)
- Session persistante
- Redirect vers `/admin` après login

### 7.2 Vue d'ensemble

**KPIs en temps réel :**
- Réservations en attente
- RV confirmés (mois en cours)
- Demandes en file d'attente
- Total leads

**Tableau des réservations récentes** (5 dernières)

**Mini calendrier** avec points sur les jours avec RV

**Liste des prochains RV** (3 suivants)

### 7.3 Réservations

**Filtres disponibles :**
- Statut : Toutes / En attente / Confirmées / Annulées
- Service : Digitalisation / SaaS Builder
- Période : Cette semaine / Ce mois / Tout

**Colonnes du tableau :**
Contact (nom + email) | Service | Profil | Créneau | Reçu le | Statut | Actions

**Actions par réservation :**
- **Détail** → modale avec toutes les informations + description du projet
- **Confirmer** → change le statut + déclenche l'email de confirmation
- **Annuler** → ouvre modale avec :
  - Champ motif (obligatoire)
  - Toggle "Proposer un nouveau créneau"
  - Bouton confirmer → change statut + déclenche email

**Note interne** : champ texte libre visible uniquement par l'admin

### 7.4 Disponibilités

**Règles récurrentes**

Chaque règle définit :
- Jours de la semaine actifs (L, M, M, J, V)
- Heure de début
- Heure de fin
- Durée d'un créneau (30 min / 1h / 1h30)
- Période de validité (optionnel : du ... au ...)

Actions : ajouter, supprimer

**Blocages**

Chaque blocage définit :
- Date de début
- Date de fin
- Motif (interne, non visible par les visiteurs)

Un blocage **override** toutes les règles récurrentes sur la période.

**Vue semaine**

Calendrier visuel 5 jours avec :
- Créneaux disponibles (vert)
- Créneaux réservés (bleu, avec nom du client)
- Créneaux bloqués (rouge)

### 7.5 File d'attente

**Métriques :**
- Nombre en attente
- Nombre urgence haute
- Durée d'attente moyenne

**Liste des demandes** (expandable) :
- Rang, nom, service, profil, durée d'attente
- Badge urgence (Urgent / Moyen / Faible)
- Description du projet (expandable)
- Actions : Inviter à booker / Détail / Rejeter

### 7.6 Leads

**Filtres :**
- Recherche texte
- Service
- Période
- Source (Booking / File d'attente)

**Export CSV** de tous les leads filtrés

---

## 8. Emails

### 8.1 Infrastructure

- Provider : Resend (ou SendGrid en fallback)
- Déclenchés via Supabase Edge Functions
- Templates HTML responsive

### 8.2 Templates requis

**email_new_reservation** (→ Admin)
```
Sujet : Nouvelle réservation — [Nom] — [Service]
Contenu : Nom, email, service, profil, créneau demandé, description projet, lien dashboard
```

**email_confirmation** (→ Visiteur)
```
Sujet : Votre rendez-vous est confirmé — Corex
Contenu : Confirmation, date/heure, ce à quoi s'attendre, lien d'annulation
```

**email_annulation_simple** (→ Visiteur)
```
Sujet : Votre rendez-vous a été annulé — Corex
Contenu : Motif, invitation à reprendre contact
```

**email_annulation_reschedule** (→ Visiteur)
```
Sujet : Votre rendez-vous a été annulé — Choisissez un nouveau créneau
Contenu : Motif + bouton CTA vers /booking/reschedule/[token] (valable 7 jours)
```

**email_invitation_queue** (→ Visiteur en file)
```
Sujet : Un créneau est disponible pour vous — Corex
Contenu : Invitation personnelle + bouton CTA vers /booking/[invite_token] (valable 48h)
```

**email_creneau_libere** (→ Visiteur en file — automatique)
```
Sujet : Un créneau vient de se libérer — Corex
Contenu : Invitation + bouton CTA (valable 48h)
```

---

## 9. Phases de développement

### Phase 1 — Foundation
- [ ] Setup Next.js 14 + TypeScript + Tailwind
- [ ] Setup Supabase (projet, tables, RLS policies)
- [ ] Setup next-intl (FR/EN, fichiers de traduction)
- [ ] Design system : couleurs, typographies, composants de base
- [ ] Layout principal (nav, footer)
- [ ] Déploiement Vercel initial

### Phase 2 — Pages publiques
- [ ] Homepage complète (toutes sections)
- [ ] Page Digitalisation
- [ ] Page SaaS Builder
- [ ] Page À propos
- [ ] Responsive mobile sur toutes les pages
- [ ] Animations et transitions

### Phase 3 — Système de booking
- [ ] Formulaire immersif 5 étapes
- [ ] Logique de génération de créneaux depuis les règles
- [ ] Page `/booking/reschedule/[token]`
- [ ] Page de confirmation
- [ ] Formulaire file d'attente (fallback)
- [ ] Emails (confirmation, annulation, reschedule, invitation file)

### Phase 4 — Dashboard Admin
- [ ] Auth Supabase (login, protection routes)
- [ ] Vue d'ensemble avec KPIs temps réel
- [ ] Gestion réservations (confirmer, annuler, détail, note)
- [ ] Gestion disponibilités (règles récurrentes, blocages, vue semaine)
- [ ] File d'attente (liste, inviter, rejeter)
- [ ] Leads (liste, filtres, export CSV)
- [ ] Notifications email admin

### Phase 5 — Polish & Lancement
- [ ] SEO (metadata, sitemap, robots.txt)
- [ ] Performance (images optimisées, lazy loading)
- [ ] Tests sur mobile (iOS + Android)
- [ ] Tests cross-browser
- [ ] Domaine + DNS
- [ ] Analytics (Plausible ou Vercel Analytics)

---

## 10. Règles métier importantes

### 10.1 Réservations
- Un créneau ne peut être réservé que par une seule personne
- Un créneau réservé est immédiatement indisponible pour les autres visiteurs (optimistic lock)
- Une réservation annulée libère automatiquement le créneau
- L'email de confirmation n'est envoyé QUE si l'admin confirme manuellement

### 10.2 Disponibilités
- Les blocages ont priorité absolue sur les règles récurrentes
- Les weekends sont toujours indisponibles (non configurable en v1)
- Les créneaux sont générés à la volée, pas pré-générés en DB
- Durée minimum d'un créneau : 30 minutes

### 10.3 File d'attente
- Un visiteur ne peut s'inscrire qu'une fois en file pour la même période
- Le lien d'invitation expire après 48h (créneau via notif auto) ou 7 jours (invitation manuelle admin)
- Après usage du lien, la demande en file passe au statut `converted`

### 10.4 Tokens de reschedule
- Un token est généré uniquement lors d'une annulation admin avec toggle reschedule ON
- Usage unique — invalide après premier accès
- Expire après 7 jours
- Le visiteur retrouve ses infos pré-remplies, seul le créneau est à choisir

---

## 11. Ce qui n'est PAS dans la v1

- Pas de prix sur le site
- Pas de mention de la localisation Canada sur le site public
- Pas de blog / ressources
- Pas d'intégration calendrier Google (v2)
- Pas de paiement en ligne
- Pas de portail client
- Pas d'app mobile native

---

## 12. Fichiers HTML de référence

Les prototypes HTML suivants servent de référence visuelle pour le développement :

| Fichier | Description |
|---|---|
| `corex-site.html` | Site public complet (homepage) |
| `corex-booking.html` | Page de prise de rendez-vous |
| `corex-admin.html` | Dashboard admin complet |

> Ces fichiers sont des prototypes statiques. Le développement Next.js reproduira fidèlement ces interfaces avec les données dynamiques Supabase.

---

*Cahier des charges rédigé sur la base des échanges de conception — Mai 2026*
