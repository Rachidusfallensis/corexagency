# Architecture — Corex Website v1.0

> Source : `corex-cdc.md` (sections 2, 3.1, 8)

---

## 1. Stack technique

| Couche | Technologie |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| i18n | next-intl — URLs `/fr/...` et `/en/...` |
| Backend | Supabase (Auth, Database, Edge Functions, Storage) |
| Auth admin | Supabase Auth (email + mot de passe, session persistante) |
| Email | Supabase Edge Functions → Resend (fallback SendGrid) |
| Déploiement | Vercel |

---

## 2. Structure des dossiers Next.js

```
/app
  /[locale]
    /page.tsx                              → Homepage
    /digitalisation/page.tsx               → Offre Digitalisation
    /saas-builder/page.tsx                 → Offre SaaS Builder
    /about/page.tsx                        → À propos
    /booking/page.tsx                      → Prise de rendez-vous
    /booking/reschedule/[token]/page.tsx   → Re-booking tokenisé
    /booking/confirmation/page.tsx         → Confirmation
    /admin
      /page.tsx                            → Dashboard (protégé)
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

---

## 3. URLs des pages — FR & EN

| Page | URL FR | URL EN |
|---|---|---|
| Homepage | `/fr` | `/en` |
| Digitalisation | `/fr/digitalisation` | `/en/digitalisation` |
| SaaS Builder | `/fr/saas-builder` | `/en/saas-builder` |
| À propos | `/fr/a-propos` | `/en/about` |
| Booking | `/fr/rendez-vous` | `/en/booking` |
| Re-booking | `/fr/rendez-vous/replanifier/[token]` | `/en/booking/reschedule/[token]` |
| Confirmation | `/fr/rendez-vous/confirmation` | `/en/booking/confirmation` |

i18n :
- Détection automatique langue navigateur
- Switch FR / EN dans le header
- Persistance du choix en cookie

---

## 4. Schéma Supabase

### Table `reservations`
| Champ | Type |
|---|---|
| id | uuid PRIMARY KEY |
| created_at | timestamp |
| service | enum('digitalisation', 'saas', 'other') |
| profile | enum('startup', 'pme', 'freelance', 'other') |
| project_desc | text |
| contact_name | varchar |
| contact_email | varchar |
| contact_phone | varchar (nullable) |
| contact_company | varchar (nullable) |
| slot_date | date |
| slot_time | time |
| status | enum('pending', 'confirmed', 'cancelled') |
| admin_note | text (nullable) |
| reschedule_token | uuid (nullable) |
| cancelled_at | timestamp (nullable) |
| confirmed_at | timestamp (nullable) |

### Table `availability_rules`
| Champ | Type |
|---|---|
| id | uuid PRIMARY KEY |
| days_of_week | int[] (0=Lun, 4=Ven) |
| start_time | time |
| end_time | time |
| slot_duration | int (minutes) |
| valid_from | date (nullable) |
| valid_until | date (nullable) |
| created_at | timestamp |

### Table `availability_blocks`
| Champ | Type |
|---|---|
| id | uuid PRIMARY KEY |
| start_date | date |
| end_date | date |
| reason | text (nullable) |
| created_at | timestamp |

### Table `queue_entries`
| Champ | Type |
|---|---|
| id | uuid PRIMARY KEY |
| created_at | timestamp |
| service | enum('digitalisation', 'saas', 'other') |
| profile | enum('startup', 'pme', 'freelance', 'other') |
| project_desc | text |
| contact_name | varchar |
| contact_email | varchar |
| contact_phone | varchar (nullable) |
| urgency | enum('high', 'medium', 'low') |
| status | enum('waiting', 'invited', 'converted', 'rejected') |
| invite_token | uuid (nullable) |
| invite_sent_at | timestamp (nullable) |

### Table `leads`
| Champ | Type |
|---|---|
| id | uuid PRIMARY KEY |
| created_at | timestamp |
| source | enum('booking', 'queue', 'contact') |
| service | enum('digitalisation', 'saas', 'other') |
| profile | enum('startup', 'pme', 'freelance', 'other') |
| contact_name | varchar |
| contact_email | varchar |
| contact_phone | varchar (nullable) |
| contact_company | varchar (nullable) |
| project_desc | text |
| status | varchar |
| reservation_id | uuid (nullable, FK → reservations) |
| queue_id | uuid (nullable, FK → queue_entries) |

---

## 5. Relations entre les tables

```
reservations  1 ─── 0..1  leads        (leads.reservation_id → reservations.id)
queue_entries 1 ─── 0..1  leads        (leads.queue_id → queue_entries.id)

availability_rules    → indépendante (sert au calcul de créneaux à la volée)
availability_blocks   → indépendante (override les rules sur la période)
```

Logique de calcul des créneaux disponibles (à la volée, pas pré-générés) :

```
créneaux_disponibles =
  générer_depuis_règles_récurrentes(date)
  - créneaux_déjà_réservés(date)
  - si date_dans_blocage → aucun créneau
```

Un lead est créé automatiquement à chaque réservation ou inscription en file d'attente. Source = `'booking' | 'queue' | 'contact'`.
